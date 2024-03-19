import { auth } from "@clerk/nextjs";
import React from "react";
import { getEventById } from "@/lib/database/actions/event.actions";

import EventForm from "@/components/shared/EventForm";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const EditEvent = async ({ params: { id } }: UpdateEventProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const event = await getEventById(id);

  return (
    <>
      <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center md:py-10'>
        <h3 className='wrapper h3-bold sm:text-center text-left'>
          Update Event
        </h3>
      </section>

      <div className='wrapper my-8'>
        <EventForm userId={userId} type='UPDATE' event={event} eventId={id} />
      </div>
    </>
  );
};

export default EditEvent;
