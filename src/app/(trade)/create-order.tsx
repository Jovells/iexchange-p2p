"use client";
import React, { FC, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import InputWithSelect from "@/components/ui/InputWithSelect";
import Button from "@/components/ui/Button";
import MerchantProfile from "@/components/merchant/MerchantProfile";
import { useRouter } from "next/navigation";
import { useContracts } from "@/common/contexts/ContractContext";
import { Offer, Order, OrderState, PaymentMethod } from "@/common/api/types";
import useUserPaymentMethods from "@/common/hooks/useUserPaymentMenthods";
import { useModal } from "@/common/contexts/ModalContext";
import PaymentMethodSelect from "@/components/ui/PaymentMethodSelect";
import { useUser } from "@/common/contexts/UserContext";
import { useQueryClient } from "@tanstack/react-query";
import useCreateOrder from "@/common/hooks/useCreateOrder";
import { offerTypes } from "@/common/constants";

interface Props {
  data: Offer;
  toggleExpand: () => void;
  orderType: string;
}

const CreateOrder: FC<Props> = ({ data, toggleExpand, orderType }) => {
  const prevOrderType = useRef(orderType);
  const { paymentMethods: userPaymentMethods, isFetching, refetch } = useUserPaymentMethods();
  const {
    handleSubmit,
    errors,
    isPending,
    isApprovePending,
    fiatAmount,
    cryptoAmount,
    paymentMethod,
    alreadyApproved,
    handleFormDataChange,
  } = useCreateOrder(data);

  const isBuy = orderType.toLowerCase() === "buy";

  const trade = isBuy ? "Buy" : "Sell";
  const crypto = data.token.symbol;

  useEffect(() => {
    if (prevOrderType.current !== orderType) {
      toggleExpand();
      prevOrderType.current = orderType;
    }
  }, [orderType, toggleExpand]);

  let paymentsMethods = isBuy
    ? [data.paymentMethod]
    : userPaymentMethods?.filter(method => method.method === data.paymentMethod.method) || [];

  return (
    <Suspense>
      <form
        onSubmit={handleSubmit}
        className="w-full border-0 lg:border rounded-xl p-0 lg:p-6 min-h-[400px] flex flex-col-reverse gap-6 lg:grid lg:grid-cols-2 bg-white dark:bg-gray-800 lg:bg-gray-200 dark:lg:bg-gray-900"
      >
        <div className="bg-transparent rounded-xl p-0 pt-0">
          <MerchantProfile offer={data} />
        </div>
        <div className="bg-white dark:bg-transparent border dark:border-gray-700 rounded-xl p-4 lg:p-6 space-y-3 pt-6">
          <InputWithSelect
            placeholder={isBuy ? "You Pay" : "You Receive"}
            initialCurrencyName={data.currency.currency}
            name="fiatAmount"
            currencies={[{ symbol: data.currency.currency, id: data.currency.id, name: data.currency.currency }]}
            value={fiatAmount}
            onValueChange={value => handleFormDataChange("fiatAmount", value.amount)}
            readOnly={false}
            selectIsReadOnly={true}
          />
          {errors.find(e => e.path[0] === "fiatAmount") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "fiatAmount")?.message}</p>
          )}

          <InputWithSelect
            placeholder={isBuy ? "You Receive" : "You Pay"}
            initialCurrencyName={data.token.symbol}
            name="cryptoAmount"
            value={cryptoAmount}
            currencies={[{ symbol: data.token.symbol, id: data.token.id, name: data.token.name }]}
            onValueChange={value => handleFormDataChange("cryptoAmount", value.amount)}
            readOnly={false}
            selectIsReadOnly={true}
          />
          {errors.find(e => e.path[0] === "cryptoAmount") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "cryptoAmount")?.message}</p>
          )}
          {
            <PaymentMethodSelect
              addButton={!isBuy}
              skipStep1={data.paymentMethod.method}
              addButtonText={"Add " + data.paymentMethod.method + " details"}
              label=""
              initialValue=""
              selectedMethod={paymentMethod}
              placeholder="Select Payment Method"
              name="paymentMethod"
              options={paymentsMethods}
              onValueChange={value => handleFormDataChange("paymentMethod", value)}
            />
          }
          {errors.find(e => e.path[0] === "paymentMethod") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "paymentMethod")?.message}</p>
          )}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <Button
              text="Cancel"
              className="bg-slate-50 dark:bg-gray-500 dark:text-gray-100 text-black rounded-xl px-4 py-2 transition duration-300 ease-in-out transform  hover:bg-slate-100 dark:hover:bg-gray-600"
              onClick={toggleExpand}
            />
            <Button
              loading={isApprovePending || isPending}
              type="submit"
              text={alreadyApproved ? `${trade} ${crypto}` : `Approve and ${trade} ${crypto}`}
              className={`${
                isBuy ? "bg-ixGreen" : "bg-ixRed"
              } text-white rounded-xl px-4 py-2 transition duration-300 ease-in-out transform hover:bg-opacity-90`}
            />
          </div>
        </div>
      </form>
    </Suspense>
  );
};

export default CreateOrder;
