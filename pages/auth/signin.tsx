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
  // const { callbackUrl: queryCallbackUrl } = router.query;
  // const callbackUrl2 = router.query;
  // const finalCallbackUrl = (queryCallbackUrl || callbackUrl || '/');
  // const finalCallbackUrl = (typeof queryCallbackUrl === 'string') ? queryCallbackUrl : callbackUrl || '/';

  // Extract callbackUrl from query params/browser URL section (if not provided, fallback to '/');
  //HOW IT WORKS: when we are attempting to visit restrected pages like: edit, delete... post, we will attach callbackUrl to it's params. 
  //              callbackUrl: comes from pages/[id]/edit.tsx (Line: destination: `/auth/signin?callbackUrl=${callbackUrl}`) if we are editting the post and for detele would work same way but delete page.  
  // const redirectURL = (typeof router.query.callbackUrl === 'string') ? router.query.callbackUrl : '/';
  const redirectURL = typeof router.query.callbackUrl === 'string' && router.query.callbackUrl.startsWith('/')
    ? router.query.callbackUrl
    : '/'; // default to '/'
  console.log('=======================redirectURL signin', redirectURL)
  // console.log('=======================redirectURL2 signin', redirectURL2)
  console.log('=======================session signin', session)
  console.log('=======================status signin', status)

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === 'authenticated') {
    router.push(redirectURL as string);
  }

  console.log('=======================status unauthenticated  signin', status)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string; // get username input
    const password = formData.get("password") as string; // get password input
    console.log('=======================username signin', username)
    console.log('=======================password signin', password)
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
      // callbackUrl: finalCallbackUrl, // Provide the callbackUrl  
      // callbackUrl: (typeof callbackUrl2.callbackUrl === 'string') ? callbackUrl2.callbackUrl : '/', // Provide the callbackUrl  
      // callbackUrl: (typeof router.query.callbackUrl === 'string') ? router.query.callbackUrl : '/', // Provide the redirect URL/callbackUrl  
      callbackUrl: redirectURL, // Provide the redirect URL/callbackUrl  
    });
    if (res?.error) {
      // Handle error if needed
      console.log('Error during login:', res.error);
    } else {
      // Redirect after successful login
      router.push(redirectURL as string);
      // Other way to redirect.
      // router.push(router.query.callbackUrl as string);
      // router.push((typeof router.query.callbackUrl === 'string') ? router.query.callbackUrl : '/' as string);
    }
  };
  if (status === 'unauthenticated') {
    return (
      <>
        <div>
          <h1 className="text-2xl">Sign in has issue with lowercase meaning i should do  lowercase upppercase check</h1>
        </div>
        <div className="grid">
          <h1>Sign In</h1>
          <form method="POST" onSubmit={handleSubmit} >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div>
              <label htmlFor="username">Username</label>
              <input name="username" type="text" className="border border-gray-400" required />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input name="password" type="password" className="border border-gray-400" required />
            </div>
            <button className="border w-32" type='submit'>Sign in</button>
          </form>
        </div>
      </>
    );
  }
};
// `getServerSideProps` to fetch csrfToken and callbackUrl
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // console.log('================context', context)
  // csrfToken come the server-side.
  const csrfToken = await getCsrfToken(context); // Fetch CSRF token
  // const callbackUrl = (context.query.callbackUrl as string) || '/'; // Default to '/' if no callbackUrl
  // return { props: { csrfToken, callbackUrl } };  
  return { props: { csrfToken } };
}
export default SignInPage;  
