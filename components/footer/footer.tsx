import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import Link from "next/link";
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

const Footer = () => {
  const { data: session, status } = useSession();
  return (
    <>
      <div className="h-12  inline-block w-full   p-2 bg-gray-200 rounded border-t border-white">
        <p className=" p-2 inline">Copy rights goes here</p>
        <div className=" inline float-right pr-2">
          {status === 'authenticated' ? (
            <>
              <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
            </>
          ) : (
            <Link href={'/auth/signin'}>Sign In</Link>
          )}
        </div>
      </div>
    </>
  )
}
export default Footer; 