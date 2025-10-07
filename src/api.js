const API_URL = '/api';

export const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
	const options = {
		method,
		headers: {},
	};
	if (token) {
		options.headers['Authorization'] = `Bearer ${token}`;
	}
	if (body instanceof FormData) {
		options.body = body;
	} else if (body) {
		options.headers['Content-Type'] = 'application/json';
		options.body = JSON.stringify(body);
	}

	try {
		const response = await fetch(`${API_URL}${endpoint}`, options);
		if (!response.ok) {
			const data = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
			throw new Error(data.error || `[HTTP Error] status: ${response.status}`);
		}
		return response.json();
	} catch (error) {
		console.error(`[API ERROR] ${endpoint} failed:`, error);
		throw error;
	}
};
