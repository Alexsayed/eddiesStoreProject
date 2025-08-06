import { useEffect, useState } from "react";
import { GetServerSidePropsContext } from 'next'; // Import the appropriate type
// import { getCsrfToken } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { signIn, getCsrfToken } from 'next-auth/react';
import { useSession } from "next-auth/react";

// /pages/auth/error.tsx

import { useRouter } from 'next/router';
import Link from 'next/link';

const errorMessages: Record<string, string> = {
  CredentialsSignin: 'Invalid username or password.',
  AccessDenied: 'You do not have permission to access this page.',
  Configuration: 'There is a configuration error.',
  Verification: 'The sign in link is no longer valid.',
  Default: 'An unknown error occurred. Please try again.',
};

export default function AuthErrorPage() {
  const { query } = useRouter();
  const error = query.error as string;

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Authentication Error</h1>
      <p style={{ color: 'red' }}>{errorMessage}</p>
      <Link href="/auth/signin">Go back to Sign In</Link>
    </div>
  );
}
