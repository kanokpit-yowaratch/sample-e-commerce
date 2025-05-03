import NextAuth, { AuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import GitHub from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';

const authOptions: AuthOptions = {
	providers: [
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
