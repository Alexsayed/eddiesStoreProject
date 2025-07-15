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
      <div className="h-20 border inline-block w-full">
        <p className=" p-2 inline">hey There im foooter</p>
        <div className=" inline float-right">
          {status === 'authenticated' ? (
            <>
              <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
              <Link href={'/new'} className="ml-2">
                Post New Product
              </Link>
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