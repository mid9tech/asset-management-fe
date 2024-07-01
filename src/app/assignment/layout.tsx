'use client'

import { PushUp } from "./pushUp";
export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <PushUp>
            {children}
        </PushUp>
    )
  }