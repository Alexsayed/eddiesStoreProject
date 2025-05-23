import NextAuth, { NextAuthOptions, Session, User, } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
// const users = [{ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD, role: 'admin' }]
const envUsername = process.env.ADMIN_USERNAME;
const envPassword = process.env.ADMIN_PASSWORD;
// const users = { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD, role: 'admin' }
if (!envUsername || !envPassword || envUsername.trim() === '' || envPassword.trim() === '') {
  throw new Error('Missing required environment variables: ADMIN_USERNAME or ADMIN_PASSWORD');
}
const users = { id: '1', username: envUsername, password: envPassword, role: 'admin', };
// export default NextAuth({
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
        // If we need to create new hashed password. 1. uncomment bcrypt.hash() method. 
        // 2. When we are in signIn page just simaply any username (don't have to be the correct one) then type desired password to passwrod <input> and submit the form.
        // 3. Go to Terminal (mac) or command line (windows) and check for console.log('Hashed Password:', hash); log, copy the log.
        // 4. Open .env.local file and paste the copied hash to ADMIN_PASSWORD value
        // 5. Comment back below method bcrypt.hash(), and we are done creating hashed password.
        // bcrypt.hash(credentials.password, 10, (err, hash) => {
        //   if (err) {
        //     console.error('Error hashing password:', err);
        //   } else {
        //     console.log('Hashed Password:', hash);
        //     // Store this hashed password in your .env file
        //     // Example: ADMIN_PASSWORD=<hashed_password>
        //   }
        // });        
        if (users.username !== inputUsername) {
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
    // maxAge: 30 * 24 * 60 * 60,  // 30 days session duration
    // updateAge: 24 * 60 * 60,    // JWT token will be updated every 24 hours    
  },
  callbacks: {
    // Assign  JSON Web Token (jwt)
    async jwt({ token, user, }) {
      if (user) {
        token.name = user.name ?? ''; // Add username to the token           
        token.id = user.id ?? ''; // Add id to the token
        token.role = users.role ?? ''; // Add user role to the token (optional)                    
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log('========token[..]', token)
      console.log('========user[..]', user)
      if (session.user) {
        // session.user.id = token.id as string; // Add id to session object if needed
        session.user.name = token.name as string;
        // session.user.role = token.role as string; // Add role to session object if needed

        // session.user.id = token.id as string;
        // session.user.name = token.name as string;
        // session.user.role = token.role as string;
      }
      return session;
    }
  }
};
export default NextAuth(authOptions);