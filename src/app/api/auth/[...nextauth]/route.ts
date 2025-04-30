import NextAuth, { AuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
