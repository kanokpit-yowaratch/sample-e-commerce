import { clearSession } from '@/lib/auth';

export async function GET() {
	try {
		await clearSession();
		return Response.json(
			{ message: 'Session cleared successfully.' },
			{
				status: 200,
			},
		);
	} catch {
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
