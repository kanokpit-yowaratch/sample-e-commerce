import bcrypt from 'bcrypt';
import prisma from './prisma';

// Helper function to get user by Id
export async function getUserById(id: string) {
	const user = await prisma.user.findUnique({
		where: { id },
	});
	return user;
}

export async function checkUserExists(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
	});
	return user;
}

export async function hashPassword(password: string): Promise<string> {
	const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;
	const hashed = await bcrypt.hash(password, saltRounds);
	return hashed;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
	const result = await bcrypt.compare(password, hashedPassword);
	return result;
}
