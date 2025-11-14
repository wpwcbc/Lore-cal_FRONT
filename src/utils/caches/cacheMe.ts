// utils/caches/cacheMe.ts

import { userService } from "../../api/services/userService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { UserType } from "../../types/userType";

const cacheMe = {
	key: ["me"] as const,

	fetchFn: () => userService.getMe(),

	prefetch: async (): Promise<void> => {
		await queryClient.prefetchQuery({
			queryKey: cacheMe.key,
			queryFn: cacheMe.fetchFn,
		});
	},

	useCache: (): UseQueryResult<UserType, unknown> => {
		const query = useQuery({
			queryKey: cacheMe.key,
			queryFn: cacheMe.fetchFn,
			staleTime: 5 * 60 * 1000, // profile changes rarely
		});

		return query;
	},

	markInvalidate: () =>
		queryClient.invalidateQueries({ queryKey: cacheMe.key }),

	remove: () => queryClient.removeQueries({ queryKey: cacheMe.key }),
};

export { cacheMe };
