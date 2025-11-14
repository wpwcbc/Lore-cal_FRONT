// httpMethods.ts

const isDebugging = false;

const host = process.env.EXPO_PUBLIC_API_BASE_URL!;
// Utils
import isPlainObject from "~/src/utils/isPlainObject";
import { getToken } from "../storage/tokenStorage";

interface ApiResponse<T> {
	status: string;
	results?: number;
	data: T;
}

// Log Helpers

function summarizeBody(body: BodyInit | undefined) {
	if (body == null) return undefined;
	if (typeof body === "string") {
		return body.length > 200 ? body.slice(0, 200) + "…[truncated]" : body;
	}
	if (body instanceof FormData) {
		const fields: string[] = [];
		body.forEach((_, key) => {
			if (!fields.includes(key)) fields.push(key); // avoid duplicates
		});
		return { type: "FormData", fields };
	}
	return { type: (body as any)?.constructor?.name ?? "UnknownBody" };
}

// A fetch() takes a path and a RequestInit object
// RequestInit object:
// - method: string
// - headers: Record<string, string>
// - body: BodyInit
// - ...options: RequestInit // other options

const request = async <T>(
	path: string,
	requestInit?: RequestInit
): Promise<T> => {
	// Method
	let method: string = (requestInit?.method ?? "GET").toUpperCase();

	let isGetHead: boolean = method === "GET" || method === "HEAD";
	let isFormData: boolean = requestInit?.body instanceof FormData;
	let hasJsonBody: boolean = false;

	// Body
	let body: BodyInit | any = undefined;
	if (isGetHead) {
		body = undefined;
	} else if (isFormData) {
		body = requestInit?.body;
	} else if (isPlainObject(requestInit?.body)) {
		body = JSON.stringify(requestInit?.body);
		hasJsonBody = true;
	} else {
		body = requestInit?.body;
	}

	// Headers
	const headers = new Headers(requestInit?.headers ?? {});

	if (hasJsonBody && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	// Why: multipart needs a boundary; clients add it. Manually setting the header often breaks uploads. MDN + community threads back this.
	// if (body instanceof FormData && !headers.has("Content-Type")) {
	// 	headers.set("Content-Type", "multipart/form-data");
	// }

	const jwt: string | null = await getToken();
	if (jwt) {
		headers.set("Authorization", `Bearer ${jwt}`);
	}

	if (isDebugging) {
		console.log("[httpMethods] request:", {
			method,
			url: host + path,
			headers,
			body: summarizeBody(body),
		});
	}

	const res = await fetch(host + path, {
		...requestInit,
		method,
		headers,
		body,
	});

	const contentType = res.headers.get("Content-Type") ?? "";

	const isJson = contentType.includes("application/json");
	const payload = isJson ? await res.json() : await res.text();

	if (isDebugging) {
		if (!res.ok) {
			console.error(`HTTP error!! status: ${payload}`);
			throw new Error(`HTTP error!! status: ${payload}`);
		}
	}

	// console.log("[httpMethod] payload", payload);

	const apiRes = payload as ApiResponse<T>;
	// console.log("[httpMethod] apiRes", apiRes.data);
	return apiRes.data;
};

const httpMethods = {
	get: <resT>(path: string): Promise<resT> => {
		return request<resT>(path, { method: "GET" });
	},
	post: <reqT, resT>(path: string, reqBody?: reqT): Promise<resT> => {
		if (reqBody !== undefined)
			if (isDebugging) {
				console.log(
					"[httpMethod] post",
					JSON.stringify(reqBody, null, 4)
				);
			}
		return request<resT>(path, {
			method: "POST",
			body: reqBody as unknown as BodyInit | undefined,
		});
	},
	delete: <reqT, resT>(path: string, reqBody?: reqT): Promise<resT> => {
		if (reqBody !== undefined)
			if (isDebugging) {
				console.log(
					"[httpMethod] delete",
					JSON.stringify(reqBody, null, 4)
				);
			}
		return request<resT>(path, {
			method: "DELETE",
			body: reqBody as unknown as BodyInit | undefined,
		});
	},
};

export default httpMethods;
