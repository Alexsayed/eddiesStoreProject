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
      <div className="h-16 mx-auto mt-10 w-11/12">
        <p className=" p-2 inline">hey There im foooter</p>
        <div className=" inline float-right">
          {status === 'authenticated' ? (
            <>
              <button onClick={() => signOut()}>Sign Out</button>
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