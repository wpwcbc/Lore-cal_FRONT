// userService.ts

import { UserType } from "~/src/types/userType";
import {
	res_getMe,
	res_getUser,
	userRepository,
} from "../repositories/userRepository";

const userService = {
	getMe: async (): Promise<UserType> => {
		const { me }: res_getMe = await userRepository.getMe();
		return me;
	},
	getUser: async (userId: string): Promise<UserType> => {
		const { user }: res_getUser = await userRepository.getUser({
			userId: userId,
		});
		return user;
	},
};

export { userService };
