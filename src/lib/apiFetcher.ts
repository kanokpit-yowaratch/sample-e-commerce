export async function retrieve<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(url, options);

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		throw new Error(errorBody?.message ?? `${response.status}: ${response.statusText}`);
	}

	return response.json();
}

export async function read<T>(url: string): Promise<T> {
	return retrieve<T>(url);
}

export async function create<T>(url: string, data: unknown): Promise<T> {
	const options: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	return retrieve<T>(url, options);
}

export async function update<T>(url: string, data: unknown): Promise<T> {
	const options: RequestInit = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	return retrieve<T>(url, options);
}

export async function patch<T>(url: string, data: unknown): Promise<T> {
	const options: RequestInit = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	return retrieve<T>(url, options);
}

export async function remove<T>(url: string): Promise<T> {
	const options: RequestInit = {
		method: 'DELETE',
	};
	return retrieve<T>(url, options);
}

export async function upload<T>(url: string, data: FormData): Promise<T> {
	const options: RequestInit = {
		method: 'POST',
		body: data,
	};
	return retrieve<T>(url, options);
}
