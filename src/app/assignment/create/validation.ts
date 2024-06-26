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
            "Assigned date cannot be Saturday or Sunday.",
        }
      ),
  })
  .superRefine((values, ctx) => {
    const assignedDate = new Date(values.assignedDate);
    const currentDate = new Date();

    const assignedDateNormalized = new Date(
      assignedDate.getFullYear(),
      assignedDate.getMonth(),
      assignedDate.getDate()
    );
    const currentDateNormalized = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (assignedDateNormalized < currentDateNormalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Assigned date is not sooner than current date",
        path: ["assignedDate"],
      });
    }
  });
