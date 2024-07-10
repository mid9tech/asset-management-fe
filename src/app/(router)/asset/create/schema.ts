import { z } from "zod";
import {  ASSET_TYPE_CREATE } from "../../../../types/enum.type";

export const formSchema = z.object({
    name: z.string().min(1, { message: "Asset Name is missing" }).max(128, {
        message: "Asset Name can't be more than 128 characters",
    })
        .refine((val) => /[a-zA-Z]/.test(val), {
            message: "Asset Name is invalid",
        }),
    categoryId: z.string().min(1, { message: "Category is missing" }),
    specification: z.string().min(1, { message: "Specification is missing" }).max(200, {
        message: "Specification can't be more than 128 characters",
    }),
    installedDate: z.string().min(1, { message: "Installed Date is missing" }),
    state: z.nativeEnum(ASSET_TYPE_CREATE),
});
