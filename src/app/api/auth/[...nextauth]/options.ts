import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import contants from '@/app/utils/contants.json';

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId:
        process.env.ENVIRONMENT ===
        (contants['ENVIRONMENT_DEVELOPMENT'] as string)
          ? (process.env.GITHUB_ID_DEV as string)
          : (process.env.GITHUB_ID as string) || '',
      clientSecret:
        process.env.ENVIRONMENT ===
        (contants['ENVIRONMENT_DEVELOPMENT'] as string)
          ? (process.env.GITHUB_SECRET_DEV as string)
          : (process.env.GITHUB_SECRET as string) || '',
    }),
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID as string) || '',
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string) || '',
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET as string) || '',
  // session: {
  //   jwt: true,
  //   maxAge: 60 * 60, // Adjust maxAge as needed (in seconds)
  // },\
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24,
  },
};

export default authOptions;
