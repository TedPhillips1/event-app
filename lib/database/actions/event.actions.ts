'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/utils';
import { CreateEventParams } from '@/types/event';
import { connectToDatabase } from '..';
import User from '../models/user.model';
import Event from '../models/event.model';
import Category from '../models/category.model';

const populateEvent = (query: any) => {
    return query
        .populate({
            path: 'organizer',
            model: User,
            select: '_id firstName lastName',
        })
        .populate({ path: 'category', model: Category, select: '_id name' });
};

export async function createEvent({ userId, event, path }: CreateEventParams) {
    try {
        await connectToDatabase();

        const organizer = await User.findById(userId);
        if (!organizer) throw new Error('Event Owner not found');

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

export async function getEventById(eventId: string) {
    try {
        await connectToDatabase();

        const event = await populateEvent(Event.findById(eventId));
        if (!event) throw new Error('Event not found');

        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        handleError(error);
    }
}
