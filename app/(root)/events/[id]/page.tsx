import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/database/actions/event.actions";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types/urlQuery";
import Image from "next/image";
import { auth } from "@clerk/nextjs";

import Collection from "@/components/shared/Collection";
import CheckoutButton from "@/components/shared/CheckoutButton";
import { checkIfUserOrderedEvent } from "@/lib/database/actions/order.actions";
import Link from "next/link";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";

const EventDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const event = await getEventById(id);
  const ITEM_LIMIT = 3;
  const page = (searchParams.page as string) || 1;

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page,
    limit: ITEM_LIMIT,
  });

  const hasOrdered = (await checkIfUserOrderedEvent({
    eventId: id,
    userId,
  })) as boolean;
  const isEventOwner = userId === event.organizer._id;
  const buttonDisabled = isEventOwner || hasOrdered;

  return (
    <>
      <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain'>
        <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
          <Image
            src={event.imageUrl}
            alt='hero image'
            width={1000}
            height={1000}
            className='h-full min-h-[300px] object-cover object-center'
          />

          <div className='flex w-full flex-col gap-8 p-5 md:p-10 md:pr-0'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-2 justify-between'>
                <h2 className='h2-bold'>{event.title}</h2>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <p className='p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700'>
                    {event.isFree ? "FREE" : `$${event.price}`}
                  </p>
                  <p className='p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500'>
                    {event.category.name}
                  </p>
                </div>

                <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>
                  by{" "}
                  <span className='text-primary-500'>
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            <CheckoutButton event={event} buttonDisabled={buttonDisabled} />

            <div className='flex flex-col gap-5'>
              <div className='flex gap-2 md:gap-3'>
                <Image
                  src='/assets/icons/calendar.svg'
                  alt='calendar'
                  width={32}
                  height={32}
                />
                <div className='p-medium-16 lg:p-regular-20 flex flex-col items-left'>
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className='p-regular-20 flex items-center gap-3'>
                <Image
                  src='/assets/icons/location.svg'
                  alt='location'
                  width={32}
                  height={32}
                />
                <p className='p-medium-16 lg:p-regular-20'>{event.location}</p>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <p className='p-bold-20 text-grey-600'>Description:</p>
              <p className='p-medium-16 lg:p-regular-18'>{event.description}</p>
              <p className='p-bold-20 text-grey-600'>Event URL:</p>
              <p className='p-medium-16 lg:p-regular-18 truncate text-primary-500 underline'>
                {event.url}
              </p>
              {isEventOwner && (
                <div className='w-full flex flex-row justify-end gap-4 items-center pl-1'>
                  <Link href={`/events/${event._id}/update`}>
                    <p className='text-link text-primary-500'>edit</p>
                  </Link>

                  <DeleteConfirmation
                    eventId={event._id}
                    newPathname='/#events'
                    isText
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
        <h2 className='h2-bold'>Related Events</h2>
        <Collection
          data={relatedEvents?.data}
          emptyTitle='No Events Found'
          emptyStateSubtext='Please come back later'
          collectionType='All_Events'
          limit={ITEM_LIMIT}
          page={page}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default EventDetails;
