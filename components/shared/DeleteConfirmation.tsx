"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { deleteEvent } from "@/lib/database/actions/event.actions";

export const DeleteConfirmation = ({
  eventId,
  isText = false,
}: {
  eventId: string;
  isText?: boolean;
}) => {
  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();

  return (
    <Dialog>
      <DialogTrigger>
        {isText ? (
          <p className='text-link text-red-400'>delete</p>
        ) : (
          <Image
            src='/assets/icons/delete.svg'
            alt='edit'
            width={24}
            height={24}
          />
        )}
      </DialogTrigger>

      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This will permanently delete this event
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button
              variant='destructive'
              type='submit'
              onClick={() =>
                startTransition(async () => {
                  await deleteEvent({ eventId, path: pathname });
                })
              }>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
