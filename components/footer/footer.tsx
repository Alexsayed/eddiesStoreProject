import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";

const Footer = () => {
  return (
    <>
      <div className="h-16 ">
        <h1>Lets see if this githut will be pushed</h1>
        <p className=" p-2">hey There im foooter</p>
      </div>
    </>
  )
}
export default Footer; 