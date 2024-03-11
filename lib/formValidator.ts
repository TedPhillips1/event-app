import { z } from 'zod';

export const eventFormSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3).max(400),
    location: z.string().min(3).max(400),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url(),
});
