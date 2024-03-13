'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { eventFormSchema } from '@/lib/formValidator';
import { eventDefaultValues, DESCRIPTION_LENGTH } from '@/constants/event';

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
import { Textarea } from '../ui/textarea';
import FileUploader from './FileUploader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type EventFormProps = {
    userId: string;
    type: 'CREATE' | 'EDIT';
};

const EventForm = ({ userId, type }: EventFormProps) => {
    const [files, setFiles] = useState<File[]>([]);

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

                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Description</FormLabel>
                            <FormControl className='h-48'>
                                <Textarea
                                    placeholder='Description'
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Max Length {DESCRIPTION_LENGTH} Characters
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='imageUrl'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <FileUploader
                                    onFieldChange={field.onChange}
                                    imageUrl={field.value}
                                    setFiles={setFiles}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Location (e.g. Online)'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='startDateTime'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Start Date & Time</FormLabel>
                            <FormControl>
                                <DatePicker
                                    selected={field.value}
                                    onChange={(date: Date) =>
                                        field.onChange(date)
                                    }
                                    showTimeSelect
                                    timeIntervals={30}
                                    timeCaption='Time'
                                    wrapperClassName='datePicker'
                                    dateFormat='MMMM d, yyyy h:mm aa'
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
