import { ApiError } from '@/lib/errors';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const cookieStore = await cookies();
		cookieStore.delete({ name: 'cooked_token' });

		return NextResponse.json({ message: 'Cookie deleted successfully.' }, {
			status: 200,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
