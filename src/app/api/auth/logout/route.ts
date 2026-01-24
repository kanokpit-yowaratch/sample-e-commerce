import { ApiError } from '@/lib/errors';
import { cookies } from 'next/headers';

export async function GET() {
	try {
		const cookieStore = await cookies();
		cookieStore.delete({ name: 'cooked_token' });

		return Response.json({ message: 'Cookie deleted successfully.' }, {
			status: 200,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
