import { z } from "zod";

export const locationResultSchema = z.object({
  location: z.string(),
  place: z.string(),
  city: z.string(),
  country: z.string(),
  countryID: z.number(),
  cityID: z.number(),
  placeID: z.number(),
  placeHlt: z.string(),
  cityHlt: z.string(),
  countryHlt: z.string(),
  translationKey: z.string(),
  label: z.string(),
});

export const searchSchema = z
  .object({
    pickupLocation: locationResultSchema,
    sameDropoff: z.boolean(),
    dropoffLocation: locationResultSchema.optional(),
    pickupDatetime: z.string().min(1, "Pick-up date is required"),
    returnDatetime: z.string().min(1, "Return date is required"),
  })
  .refine((data) => data.sameDropoff || !!data.dropoffLocation, {
    message: "Drop-off location is required",
    path: ["dropoffLocation"],
  });

export type SearchFormValues = z.infer<typeof searchSchema>;
