"use client";

import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

import { Button } from "../ui/button";
import Checkout from "./Checkout";

const CheckoutButton = ({
  event,
  hasOrdered,
}: {
  event: IEvent;
  hasOrdered: boolean;
}) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  const viewerIsOwner = userId === event.organizer._id;

  const buttonDisabled = viewerIsOwner || hasOrdered ? true : false;

  return (
    <div className='flex items-center gap-3'>
      {hasEventFinished ? (
        <p className='p-2 text-red-400'>
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className='button rounded-full' size='lg'>
              <Link href='/sign-in'>Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout event={event} userId={userId} disabled={buttonDisabled} />
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
