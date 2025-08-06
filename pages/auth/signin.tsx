import { useEffect, useState } from "react";
import { GetServerSidePropsContext } from 'next'; // Import the appropriate type
// import { getCsrfToken } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { signIn, getCsrfToken } from 'next-auth/react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
type Props = {
  csrfToken: string,
};
// Handle sign-in
const SignInPage = ({ csrfToken }: Props) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Extract callbackUrl from query params/browser URL section (if not provided, fallback to '/');
  //HOW IT WORKS: when we are attempting to visit restrected pages like: edit, delete or new post, we will attach callbackUrl to it's params. 
  //              callbackUrl: comes from pages/[id]/edit.tsx or pages/new.tsx (Line: destination: `/auth/signin?callbackUrl=${callbackUrl}`) if we are editting the post or adding new product.    
  const redirectURL = typeof router.query.callbackUrl === 'string' && router.query.callbackUrl.startsWith('/')
    ? router.query.callbackUrl
    : '/'; // default to '/' 

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  // if user is already signed in 
  if (status === 'authenticated') {
    router.push(redirectURL as string);
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string; // get username input
    const password = formData.get("password") as string; // get password input    
    // Ensure that username and password are non-null.
    if (!username || !password) {
      console.log('Username or password is missing');
      return;
    }
    // res will return  the successful or failed login.
    const res = await signIn("credentials", {
      redirect: false, // The option redirect: false is a way to prevent the automatic redirect behavior after a successful or failed login.
      username,
      password,
      callbackUrl: redirectURL, // Provide the redirect URL 
    });
    if (res?.error) {
      // Handle error if needed
      console.log('Error during login:', res.error);
    } else {
      // Redirect after successful login
      router.push(redirectURL as string);
    }
  };

  if (status === 'unauthenticated') {
    return (
      <>
        <div className=" mt-10 md:mt-0 border-t md:border-none pt-4  min-h-[calc(100vh-230px)] min-[376px]:min-h-[calc(100vh-150px)] ">
          <div className="w-[90%] md:w-[60%] mx-auto ">
            <h1 className="text-xl font-semibold text-center">Sign In</h1>
            <form method="POST" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className="flex items-center">
                <label htmlFor="username" className="w-24">Username:</label>
                <input type="text" id="username" name="username" placeholder="Username" className="border flex-1 pl-2" required />
              </div>
              <div className="flex items-center">
                <label htmlFor="password" className="w-24">Password:</label>
                <input type="password" id="password" name="password" placeholder="Password" className="border flex-1 pl-2" required />
              </div>
              <button type="submit" className="btn bg-slate-700 text-white border-none w-1/2 mx-auto ">Sign in</button>
            </form>
          </div>
        </div>

      </>
    );
  }
};
// `getServerSideProps` to fetch csrfToken and callbackUrl
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // csrfToken come the server-side.
  const csrfToken = await getCsrfToken(context); // Fetch CSRF token
  // const callbackUrl = (context.query.callbackUrl as string) || '/'; // Default to '/' if no callbackUrl
  // return { props: { csrfToken, callbackUrl } };  
  return { props: { csrfToken } };
}
export default SignInPage;  
