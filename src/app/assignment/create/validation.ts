import { differenceInYears, isAfter, isWeekend } from "date-fns";
import { z, ZodSchema } from "zod";

export const validateCreateSchema: ZodSchema = z
  .object({
    assignedDate: z
      .string()
      .min(1, { message: "Assigned date is missing" })
      .refine(
        (val) => {
          const date = new Date(val);
          return !isWeekend(date);
        },
        {
          message:
            "Assigned date cannot be Saturday or Sunday. Please select a different date",
        }
      ),
  })
  .superRefine((values, ctx) => {
    const assignedDate = new Date(values.assignedDate);
    const currentDate = new Date();

    if (assignedDate < currentDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Assigned date is not sooner than current date",
        path: ["assignedDate"],
      });
    }
  });
