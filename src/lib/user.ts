import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
	const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;
	const hashed = await bcrypt.hash(password, saltRounds);
	return hashed;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
	const result = await bcrypt.compare(password, hashedPassword);
	return result;
}
