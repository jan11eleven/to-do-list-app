import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: (process.env.GITHUB_ID as string) || '',
      clientSecret: (process.env.GITHUB_SECRET as string) || '',
    }),
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID as string) || '',
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string) || '',
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET as string) || '',
  //   session: {
  //     jwt: true,
  //     maxAge: 60 * 60, // Adjust maxAge as needed (in seconds)
  //   },
};

export default authOptions;
