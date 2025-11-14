// authRepository.ts

import { UserType } from "~/src/types/userType";
import httpMethods from "../httpMethods";

interface res_isLogged {
	isLogged: boolean;
	message: string;
}

interface body_login {
	email: string;
	password: string;
}
interface res_login {
	token: string;
}

interface body_signup {
	name: string;
	email: string;
	password: string;
	passwordConfirm: string;
}
interface res_signup {
	token: string;
	user: UserType;
}

const authRepository = {
	isLogged: async (): Promise<res_isLogged> => {
		const res: res_isLogged = await httpMethods.get("/auth/is-logged");
		return res;
	},

	login: async (body: body_login): Promise<res_login> => {
		const res: res_login = await httpMethods.post<body_login, res_login>(
			"/auth/login",
			body
		);
		return res;
	},

	signup: async (body: body_signup): Promise<res_signup> => {
		console.log(`[authRepository] signup`);
		const res: res_signup = await httpMethods.post<body_signup, res_signup>(
			"/auth/signup",
			body
		);
		return res;
	},
};

export { authRepository };
export type { res_isLogged, body_login, res_login, body_signup, res_signup };
