'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/utils';
import { CreateEventParams } from '@/types/event';
import { connectToDatabase } from '..';
import User from '../models/user.model';
import Event from '../models/event.model';

export async function createEvent({ userId, event, path }: CreateEventParams) {
    try {
        await connectToDatabase();

        const organiser = await User.findById(userId);
        if (!organiser) throw new Error('Event Owner not found');

        const newEvent = await Event.create({
            ...event,
            category: event.categoryId,
            organizer: userId,
        });
        revalidatePath(path);

        return JSON.parse(JSON.stringify(newEvent));
    } catch (error) {
        handleError(error);
    }
}
