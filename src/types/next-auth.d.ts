import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			role: string;
			image?: string;
		} & DefaultSession['user'];
	}

	interface User extends DefaultUser {
		id: string;
		role: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		role: string;
		picture?: string;
	}
}
