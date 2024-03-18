'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { eventFormSchema } from '@/lib/formValidator';
import { eventDefaultValues, DESCRIPTION_LENGTH } from '@/constants/event';
import clsx from 'clsx';
import { useUploadThing } from '@/lib/uploadthing';
import { handleError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/lib/database/actions/event.actions';

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
import { Checkbox } from '../ui/checkbox';

type EventFormProps = {
    userId: string;
    type: 'CREATE' | 'EDIT';
};

const EventForm = ({ userId, type }: EventFormProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing('imageUploader');
    const router = useRouter();

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: eventDefaultValues,
    });

    const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
        let uploadedImageUrl = values.imageUrl;

        if (files.length > 0) {
            const uploadedImages = await startUpload(files);

            if (!uploadedImages) return;

            uploadedImageUrl = uploadedImages[0].url;
        }

        if (type === 'CREATE') {
            try {
                const newEvent = await createEvent({
                    event: { ...values, imageUrl: uploadedImageUrl },
                    userId,
                    path: '/profile',
                });

                if (newEvent) {
                    form.reset();
                    router.push(`/events/${newEvent._id}`);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

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

                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Description</FormLabel>
                                <FormControl className='min-h-48'>
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
                </div>

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

                <div className='flex flex-col gap-5 md:flex-row'>
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

                    <FormField
                        control={form.control}
                        name='endDateTime'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>End Date & Time</FormLabel>
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
                </div>

                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <p className='p-medium-24 text-gray-400'>
                                            £
                                        </p>
                                        <Input
                                            type='number'
                                            placeholder='Price'
                                            {...field}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='isFree'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className='flex items-center h-full ml-2'>
                                                            <label
                                                                htmlFor='isFree'
                                                                className='whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                                                Free
                                                            </label>
                                                            <Checkbox
                                                                id='isFree'
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                                checked={
                                                                    field.value
                                                                }
                                                                // not working
                                                                className={clsx(
                                                                    'h-5 w-5 border-2',
                                                                    field.value
                                                                        ? 'border-primary-500'
                                                                        : 'border-gray-200'
                                                                )}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='url'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Event URL</FormLabel>
                                <FormControl>
                                    <Input placeholder='Event URL' {...field} />
                                </FormControl>
                                <FormDescription>
                                    URL for the Event
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type='submit'
                    size='lg'
                    disabled={form.formState.isSubmitting}
                    className='h-[54px] p-regular-16 col-span-2 w-full'>
                    {form.formState.isSubmitting
                        ? 'Submitting...'
                        : type === 'CREATE'
                        ? 'Create Event'
                        : 'Update Event'}
                </Button>
            </form>
        </Form>
    );
};

export default EventForm;
