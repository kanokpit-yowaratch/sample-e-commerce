import { AuthOptions, getServerSession, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { comparePassword } from '@/lib/user';
import { Role } from '@prisma/client';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findFirst({
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              password: true,
            },
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            return null;
          }

          const isMatch = await comparePassword(credentials.password, user.password ?? '');

          if (!isMatch) {
            return null;
          }

          return {
            id: user.id,
            email: credentials.email,
            name: user.name ?? '',
            role: user.role,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.name}`,
          email: profile.email,
          image: profile.picture,
          role: Role.customer,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          role: Role.customer,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID ?? '',
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? '',
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: Role.customer,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 1, // 1 hour (3600 seconds)
  },
  callbacks: {
    async signIn({ account, profile }) {
      try {
        // register to customer user for oauth only
        if (account?.type !== 'oauth') {
          return true;
        }
        if (profile?.email) {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: profile.email,
            },
          });
          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: `${profile?.name}`,
                email: profile?.email ?? '',
                createdAt: new Date(),
                updatedAt: new Date(),
                role: Role.customer,
              },
            });
          }
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect: async ({ baseUrl }) => {
      return `${baseUrl}/`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// If need to use in the future
// export const { handler, auth, signIn, signOut } = NextAuth(authOptions);

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export function isSessionExpired(session: { expires?: string | Date } | null | undefined): boolean {
  if (!session?.expires) return true
  return new Date() > new Date(session.expires)
}
