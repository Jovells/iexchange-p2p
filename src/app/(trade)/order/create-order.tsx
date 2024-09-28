'use client'
import React, { FC, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import InputWithSelect from "@/components/ui/InputWithSelect";
import InputSelect from "@/components/ui/InputSelect";
import Button from "@/components/ui/Button";
import MerchantProfile from "@/components/merchant/MerchantProfile";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { decodeEventLog } from "viem";
import { useContracts } from "@/common/contexts/ContractContext";
import CediH from "@/common/abis/CediH";
import { Offer, Order, OrderState, PaymentMethod, } from "@/common/api/types";
import toast from "react-hot-toast";
import  z  from "zod";
import useWriteContractWithToast from "@/common/hooks/useWriteContractWithToast";
import useUserPaymentMethods from "@/common/hooks/useUserPaymentMenthods";
import storeAccountDetails from "@/common/api/storeAccountDetails";
import { Link } from "lucide-react";
import AddPaymentMethod from "@/app/dashboard/account/payment/AddPaymentMethod";
import { useModal } from "@/common/contexts/ModalContext";
import PaymentMethodSelect from "@/components/ui/PaymentMethodSelect";
import { useUser } from "@/common/contexts/UserContext";
import { useQueryClient } from "@tanstack/react-query";
import { getBlock } from '@wagmi/core'
import { config } from "@/common/configs";

const formSchema = z.object({
  toPay: z.string().min(1, "Please enter a valid amount").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number"
  }),
  toReceive: z.string().min(1, "Please enter a valid amount").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number"
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

interface Props {
  data: Offer;
  toggleExpand: () => void;
  orderType: string;
}

const CreateOrder: FC<Props> = ({ data, toggleExpand, orderType }) => {
  const [{ toPay, toReceive, paymentMethod }, setFormData] = useState({
    toPay: "",
    toReceive: "",
    paymentMethod: data.paymentMethod,
  });
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const {p2p, tokens, currentChain} = useContracts();
  const token = tokens.find((token) => token.address.toLowerCase() === data.token.id.toLowerCase());
  const {address: userAddress} = useUser();
  const prevOrderType = useRef(orderType);
  const searchParams = useSearchParams();
  const navigate = useRouter();
  const newOrder =  useRef<Partial<Order>>();
  const afterRef = useRef<(value: any)=>any>();
  const {paymentMethods : userPaymentMethods, isFetching, refetch} = useUserPaymentMethods();
  const {showModal, hideModal} = useModal();

  const trade = orderType === "buy" ? "Buy" : "Sell";
  const crypto = data.token.symbol

  const { writeContractAsync: writeToken, data: approveHash, isSuccess: isApproveSuccess, isPending: isApprovePending } = useWriteContractWithToast();
  const { writeContractAsync: writeP2p, data: p2phash, receipt, isSuccess, isPending  } = useWriteContractWithToast();


  const isMerchant = userAddress === data.merchant.id;

  const { data: allowance } = useReadContract({
    abi: CediH,
    address: data.token.id,
    functionName: "allowance",
    args: [userAddress!, p2p.address],
  });
  const isBuy = orderType.toLowerCase() === "buy"

  function handleFormDateChange(name: string, value: string | PaymentMethod) {
    console.log('name', name, 'orderType', orderType, 'isbuy', isBuy, )
    // Prevent non-numeric input for toPay and toReceive fields
    if ((name === "toPay" || name === "toReceive") && !/^\d*\.?\d*$/.test(value as string)) {
      return;
    }

    if (name === "toPay") {

      let newToReceive
       
        newToReceive = Number(value) / Number(data.rate);
   
      setFormData((prev) => ({
        ...prev,
        toPay: value as string,
        toReceive: newToReceive.toFixed(8),  // Limit to 8 decimal places
      }));
    } else if (name === "toReceive") {
      let newToPay
       
        newToPay = Number(value) * Number(data.rate);
      
      setFormData((prev) => ({
        ...prev,
        toReceive: value as string,
        toPay: newToPay.toFixed(8),  // Limit to 8 decimal places
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  useEffect(() => {
    if (prevOrderType.current !== orderType) {
      toggleExpand();
      prevOrderType.current = orderType;
    }
  }, [orderType, toggleExpand]);

  const tokensAmount = toReceive ? BigInt(Math.floor(Number(toReceive) * 10 ** 18)) : BigInt(0);
  const alreadyApproved = (allowance! >= tokensAmount)  || (orderType === "buy");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('orderType', orderType, "paymentMethod", paymentMethod,)
    e.preventDefault();
    if(isMerchant){
      toast.error("You cannot trade with yourself");
      return;
    }
    
    
    // Validate the form before submission
    const formData = { toPay, toReceive, paymentMethod : paymentMethod.method }; 
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.issues);
      toast.error("Please correct the form errors");
      return;
    } else {
      setErrors([]);
    }
    
    const depositAddress = isBuy ? data.depositAddress.id : userAddress;

    const accountHash = isBuy ? data.accountHash : await storeAccountDetails({
      name: "" as string,
      address: userAddress as string,
      number: "" as string,
      paymentMethod: paymentMethod.method,
      details: paymentMethod.details,
      });
  
    try {
      if (!alreadyApproved) {
        const approveHash = await writeToken({
        },{
          abi: tokens[0].abi,
          address: data.token.id,
          functionName: "approve",
          args: [p2p.address, tokensAmount],
        });
      } 
      newOrder.current = { 
        accountHash: accountHash as `0x${string}`, 
        offer: data, 
        trader: { id: userAddress! },
        depositAddress : { id: depositAddress! },
        orderType: data.offerType,
        quantity: tokensAmount.toString(),
        status: OrderState.Pending
       } satisfies Partial<Order>;

       await writeP2p(
          {loadingMessage:"Creating Order",
          successMessage: "Order Created Successfully",
          afterAction: new Promise(async (resolve) => {
            afterRef.current = resolve;
          })
          },{
          abi: p2p.abi,
          address: p2p.address,
          functionName: "createOrder",
          args: [
            BigInt(data.id),
            tokensAmount,
            depositAddress,
            accountHash,
          ],
        });


    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(()=>{
   const getTimeStampAndNavigate = async () => {
    console.log('qweisSuccess', isSuccess, 'receipt', receipt)

    if (isSuccess && receipt) {

   let orderId : string;
    for (const log of receipt.logs) {
      try {
      const decoded = decodeEventLog({
        abi: p2p.abi,
        data: log.data,
        topics: log.topics,
        eventName: "NewOrder",
      });
      const args = decoded?.args;
      console.log('qwargs', args);
      orderId = args.orderId.toString();

      //TODO: @Jovells MOVE BLOCKTIMESTAMP ELSEWHERE
      const block = await getBlock(config, { blockNumber: receipt.blockNumber });
      console.log('qwblock', block);
      const order = { id: orderId, blockTimestamp: block.timestamp.toString(), ...newOrder.current } as Order;
      console.log('qworder', order);
      navigate.push("/order/" + orderId);
      queryClient.setQueryData(["order", orderId], order);
      afterRef.current?.("done");

      break;
      } catch (e) {
      continue;
      }
    }
}      
    }
    getTimeStampAndNavigate();
  }, [isSuccess, receipt, p2phash, navigate])

  let paymentsMethods = isBuy 
    ? [data.paymentMethod] 
    : userPaymentMethods?.filter((method) => method.method === data.paymentMethod.method)  || [];
  
  const handleAddPaymentMethodClick = () => {
    showModal(
<AddPaymentMethod method={data.paymentMethod.method}  hideModal={hideModal} onSuccess={refetch} /> );
  };


  return (
    <Suspense>
      <form
        onSubmit={handleSubmit}
        className="w-full border-0 lg:border rounded-xl p-0 lg:p-6 min-h-[400px] flex  flex-col-reverse lg:grid lg:grid-cols-2 bg-white lg:bg-gray-200">
        <div className="bg-transparent rounded-xl p-0 pt-6">
          <MerchantProfile offer={data} />
        </div>
        <div className="bg-white rounded-xl p-0 lg:p-6 space-y-3 pt-6">
          <InputWithSelect
            placeholder={ isBuy ? "You Pay" : "You Receive"}
            initialCurrency={data.currency.currency}
            name="toPay"
            currencies={[{symbol: data.currency.currency, id: data.currency.id, name: data.currency.currency}]}
            value={toPay}
            onValueChange={(value) => handleFormDateChange("toPay", value.amount)}
            readOnly={false}
            selectIsReadOnly={true}
          />
          {errors.find(e => e.path[0] === "toPay") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "toPay")?.message}</p>
          )}

          <InputWithSelect
            placeholder={isBuy ? "You Receive" : "You Pay"}
            initialCurrency={data.token.symbol}
            name="toReceive"
            value={toReceive}
            currencies={[{symbol: data.token.symbol, id: data.token.id, name: data.token.name}]}
            onValueChange={(value) => handleFormDateChange("toReceive", value.amount)}
            readOnly={false}
            selectIsReadOnly={true}
          />
          {errors.find(e => e.path[0] === "toReceive") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "toReceive")?.message}</p>
          )}
          {
          <PaymentMethodSelect
            addButton={
              isBuy ? "" :<>
              <Button icon='/images/icons/add-circle.png'
     className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2" text={"Add " + data.paymentMethod.method + " details"} onClick = {handleAddPaymentMethodClick}/>
              </>
            }
            label=""
            initialValue=""
            selectedMethod={paymentMethod}
            placeholder="Select Payment Method"
            name="paymentMethod"
            options={paymentsMethods}
            onValueChange={(value) => handleFormDateChange("paymentMethod", value)}
          />}
          {errors.find(e => e.path[0] === "paymentMethod") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "paymentMethod")?.message}</p>
          )}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <Button
              text="Cancel"
              className="bg-[#EAEBEC] text-black rounded-xl px-4 py-2"
              onClick={toggleExpand}
            />
            <Button
              loading={ isApprovePending || isPending}
              type="submit"
              text={alreadyApproved? `${trade} ${crypto}` : `Approve and ${trade} ${crypto}`}
              className={`${isBuy ? "bg-[#2D947A]" : "bg-[#f14e4e]"} text-white rounded-xl px-4 py-2`}
            />
          </div>
        </div>
      </form>
    </Suspense>
  );
};

export default CreateOrder;