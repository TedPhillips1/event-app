"use client";

import React from "react";
import { headerLinks } from "@/constants/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NavItems = () => {
  const pathname = usePathname();

  return (
    <ul className='md:flex-between md:flex-row flex w-full flex-col items-start gap-6'>
      {headerLinks.map(({ label, route }) => {
        const isActive = pathname === route;

        return (
          <li
            key={route}
            className={clsx(
              isActive && "text-primary-500",
              "flex-center p-medium-16 whitespace-nowrap"
            )}>
            <Link href={route}>{label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
