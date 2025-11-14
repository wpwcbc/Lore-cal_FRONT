// userRepository.ts

import { UserType } from "~/src/types/userType";
import httpMethods from "../httpMethods";

interface res_getMe {
	me: UserType;
}

interface params_getUser {
	userId: string;
}
interface res_getUser {
	user: UserType;
}

const userRepository = {
	getMe: async (): Promise<res_getMe> => {
		const res: res_getMe = await httpMethods.get("/users/me");
		return res;
	},

	getUser: async (params: params_getUser): Promise<res_getUser> => {
		const res: res_getUser = await httpMethods.get(
			`/users/${params.userId}`
		);
		return res;
	},
};

export { userRepository };
export type { res_getMe, res_getUser };
