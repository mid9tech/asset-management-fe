import { z } from "zod";
import { ASSET_TYPE_EDIT } from "../../../types/enum.type";

export const formSchema = z.object({
    assetName: z.string().min(1, { message: "Asset name is missing" })
    .refine((val) => /[a-zA-Z]/.test(val), {
        message: "Asset Name is invalid",
    })
    ,
    installedDate: z.string().min(1, { message: "Installed Date is missing" }),
    state: z.nativeEnum(ASSET_TYPE_EDIT),
    specification: z.string().min(1, { message: "Specification is missing" }).max(200, {
        message: "Specification can't be more than 200 characters",
    }),
    category: z.object({
        categoryName: z.string().min(1, { message: "Category name is missing" }),
        categoryCode: z.string().min(1, { message: "Category code is missing" }),
    }),
});
