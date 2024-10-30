import { z } from "zod";
import { Offer } from "../api/types";
import { formatCurrency } from "@/lib/utils";

export const createOrderSchema = (data: Offer) =>
  z.object({
    toPay: z
      .string()
      .min(1, "Please enter a valid amount")
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Must be a valid positive number",
      }),
    toReceive: z
      .string()
      .min(1, "Please enter a valid amount")
      .refine(
        val => {
          const valN = Number(val) * 10 ** 18;
          const minOrder = Number(data.minOrder);
          const maxOrder = Number(data.maxOrder);
          console.log("valN", valN, "minOrder", minOrder, "maxOrder", maxOrder);
          const res = !isNaN(valN) && valN >= minOrder && valN <= maxOrder;
          return res;
        },
        {
          message: `Value must be within ${formatCurrency(data.minOrder, data.token.symbol)} to ${formatCurrency(
            data.maxOrder,
            data.token.symbol,
          )}`,
        },
      ),
    paymentMethod: z.string().min(1, "Payment method is required"),
  });
