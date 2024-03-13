import { z } from 'zod';

import { DESCRIPTION_LENGTH, LOCATION_LENGTH } from '@/constants/event';

export const eventFormSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3).max(DESCRIPTION_LENGTH),
    location: z.string().min(3).max(LOCATION_LENGTH),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url(),
});
