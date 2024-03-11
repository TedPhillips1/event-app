'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { eventFormSchema } from '@/lib/formValidator';
import { eventDefaultValues } from '@/constants/eventDefaultValues';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Dropdown from './Dropdown';

type EventFormProps = {
    userId: string;
    type: 'CREATE' | 'EDIT';
};

const EventForm = ({ userId, type }: EventFormProps) => {
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: eventDefaultValues,
    });

    function onSubmit(values: z.infer<typeof eventFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col gap-5'>
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                                <Input placeholder='Event Title' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Dropdown
                                    onChangeHandler={field.onChange}
                                    currentValue={field.value}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit'>Submit</Button>
            </form>
        </Form>
    );
};

export default EventForm;
