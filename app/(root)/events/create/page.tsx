import { auth } from '@clerk/nextjs';
import React from 'react';

import EventForm from '@/components/shared/EventForm';

const CreateEvent = () => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    return (
        <>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center md:py-10'>
                <h3 className='wrapper h3-bold sm:text-center text-left'>
                    Create Event
                </h3>
            </section>

            <div className='wrapper my-8'>
                <EventForm userId={userId} type='CREATE' />
            </div>
        </>
    );
};

export default CreateEvent;
