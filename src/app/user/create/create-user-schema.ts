import { differenceInYears, isWeekend, isAfter } from "date-fns";
import { ZodSchema, z } from "zod";
import { Gender, Type } from "../../../types/enum.type";

export const formSchema: ZodSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First Name is missing" })
      .regex(/^[a-zA-Z0-9_ ]+$/, {
        message: "Must contain alphabetic characters",
      })
      .max(128, {
        message: "First Name can't be more than 128 characters",
      })
      .refine((val) => /[a-zA-Z]/.test(val), {
        message: "First Name is invalid",
      }),
    lastName: z
      .string()
      .min(1, { message: "Last Name is missing" })
      .regex(/^[a-zA-Z0-9_ ]+$/, {
        message: "Must contain only alphabetic characters",
      })
      .max(128, {
        message: "Last Name can't be more than 128 characters",
      })
      .refine((val) => /[a-zA-Z]/.test(val), {
        message: "Last Name is invalid",
      }),
    dateOfBirth: z
      .string()
      .min(1, { message: "Date of birth is missing" })
      .refine(
        (val) => {
          const date = new Date(val);
          return differenceInYears(new Date(), date) >= 18;
        },
        { message: "User is under 18. Please select a different date" }
      ),
    gender: z.nativeEnum(Gender, { message: "Gender is missing" }),
    joinedDate: z
      .string()
      .min(1, { message: "Joined Date is missing" })
      .refine(
        (val) => {
          const date = new Date(val);
          return !isWeekend(date);
        },
        {
          message:
            "Joined date cannot be Saturday or Sunday. Please select a different date",
        }
      ),
    type: z.string().min(1, { message: "Type is missing" }),
    location: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const dobDate = new Date(values.dateOfBirth);
    const joinedDate = new Date(values.joinedDate);

    if (differenceInYears(joinedDate, dobDate) < 18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Joined date is not later than Date of Birth. Please select a different date",
        path: ["joinedDate"],
      });
    }

    if (isAfter(dobDate, joinedDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Joined date is not later than Date of Birth. Please select a different date",
        path: ["joinedDate"],
      });
    }

    if (values.type === Type.Admin && !values.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location is required when Type is Admin",
        path: ["location"],
      });
    }

    if (values.type === Type.Admin && !values.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location is required when Type is Admin",
        path: ["location"],
      });
    }
  });