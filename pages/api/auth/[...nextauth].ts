import NextAuth, { NextAuthOptions, Session, User, } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const envUsername = process.env.ADMIN_USERNAME;
const envPassword = process.env.ADMIN_PASSWORD;

if (!envUsername || !envPassword || envUsername.trim() === '' || envPassword.trim() === '') {
  throw new Error('Missing required environment variables: ADMIN_USERNAME or ADMIN_PASSWORD');
}
// define user
const users = { id: '1', username: envUsername, password: envPassword, role: 'admin', };
// Handle user authentication 
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Check if credentials is undefined or doesn't contain the expected fields
        if (!credentials || !credentials.username || !credentials.password) {
          return null; // Return null if credentials are not valid
        }

        // inputUsername and inputPassword comes from the Form submission in pages/auth/signin.tsx
        const { username: inputUsername, password: inputPassword, } = credentials;
        // IF WE NEED TO CREATE NEW HASHED PASSWORD 
        // 1. uncomment bcrypt.hash() method below. 
        // 2. When we are in signIn page just simaply any username (don't have to be the correct one) then type desired password to passwrod <input> and submit the form.
        // 3. Go to Terminal (mac) or command line (windows) and check for console.log('Hashed Password:', hash); copy the hashed Password/log.
        // 4. Open .env.local file and paste the hash to ADMIN_PASSWORD value
        // 5. Comment back below method bcrypt.hash(), and we are done creating hashed password.
        // 6. DONE. New password is created.
        // bcrypt.hash(credentials.password, 10, (err, hash) => {
        //   if (err) {
        //     console.error('Error hashing password:', err);
        //   } else {
        //     console.log('Hashed Password:', hash);
        //     // Store this hashed password in your .env file
        //     // Example: ADMIN_PASSWORD=<hashed_password>
        //   }
        // });
        // IF WE NEED TO CREATE NEW USERNAME
        // 1. Open .env.local file
        // 2. At .env file change the ADMIN_USERNAME=AnyName to desired name 
        // 3. Save and we are DONE.        
        if (users.username.toLowerCase() !== inputUsername.toLowerCase()) {
          throw new Error('Username not found');
        }
        // compare hashed password with input password.        
        const isPasswordValid = await bcrypt.compare(inputPassword, users.password);
        if (!isPasswordValid) {
          // return null; // Return null if password is incorrect
          throw new Error('Invalid password');
        }
        // Return user credentials if username and passwords matches.
        return { id: users.id, name: users.username, role: users.role };
      },

    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page     
    error: '/auth/error', // Custom error page      
  },
  session: {
    strategy: 'jwt',
    maxAge: 1800,  // 1800 seconds or 30 minutes. In other words sign out after 30 minute. 
    // Below are default values. We really won't need updateAge     
    // updateAge: 24 * 60 * 60,    // JWT token will be updated every 24 hours    
  },
  jwt: {
    // encryption: true, // or false depending on your setup
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    // Assign  JSON Web Token (jwt)
    async jwt({ token, user, }) {
      if (user) {
        token.name = user?.name ?? ''; // Add username to the token           
        token.id = user?.id ?? ''; // Add id to the token
        token.role = users.role ?? ''; // Add user role to the token (optional)

      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        // session.user.id = token.id as string; // Add id to session object if needed
        session.user.name = token.name as string;
        // session.user.role = token.role as string; // Add role to session object if needed        
      }
      return session;
    }
  }
};
export default NextAuth(authOptions);