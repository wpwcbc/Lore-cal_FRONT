// utils/caches/cacheUserStories.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { StoryType } from "~/src/types/storyType";
import { storyService } from "~/src/api/services/storyService";

const userStoriesKey = "userStories";
const fetchUserStories = (userId: string) =>
	storyService.readAllFromUser(userId);

const prefetchUserStories = async (userId: string): Promise<void> => {
	await queryClient.prefetchQuery({
		queryKey: [userStoriesKey, userId],
		queryFn: () => fetchUserStories(userId),
	});
};

const useUserStories = (
	userId: string | undefined,
	enabled: boolean
): UseQueryResult<StoryType[], unknown> => {
	const query = useQuery({
		queryKey: [userStoriesKey, userId],
		queryFn: () => fetchUserStories(userId!),
		enabled: enabled && !!userId,
		staleTime: 30_000, // profile changes rarely
		gcTime: 5 * 60_000, // keep in cache for quick re-open
	});

	return query;
};

export { userStoriesKey, useUserStories, prefetchUserStories };
