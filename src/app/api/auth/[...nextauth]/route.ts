import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import GitHub from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { comparePassword } from '@/lib/user';

const authOptions: AuthOptions = {
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
					name: `${profile.given_name} ${profile.family_name}`,
					email: profile.email,
					image: profile.picture,
					role: profile.role,
				};
			},
		}),
		Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
		}),
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID ?? '',
			clientSecret: process.env.AUTH_GITHUB_SECRET ?? '',
		}),
	],
	callbacks: {
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
