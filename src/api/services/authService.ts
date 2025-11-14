// authService.ts

import { clearToken, setToken } from "~/src/storage/tokenStorage";
import {
	authRepository,
	res_isLogged,
	res_login,
	res_signup,
} from "../repositories/authRepository";
import { Alert } from "react-native";
import { cacheMe } from "~/src/utils/caches/cacheMe";

const authService = {
	isLogged: async (): Promise<boolean> => {
		const { isLogged }: res_isLogged = await authRepository.isLogged();
		return isLogged ? isLogged : false;
	},

	login: async (email: string, password: string) => {
		const { token }: res_login = await authRepository.login({
			email: email,
			password,
		});

		await setToken(token);
		cacheMe.prefetch();
	},

	logout: () => {
		clearToken();
	},

	signup: async (
		username: string,
		email: string,
		password: string,
		passwordConfirm: string
	) => {
		const { token }: res_signup = await authRepository.signup({
			email: email,
			name: username,
			password: password,
			passwordConfirm: passwordConfirm,
		});

		console.log(token);

		await setToken(token);
	},
};

export { authService };
