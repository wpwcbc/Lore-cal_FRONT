// utils/caches/cacheMapStories.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { storyService } from "~/src/api/services/storyService";
import { StoryType } from "~/src/types/storyType";

const mapStoriesKey = ["mapStories"];
const fetchMapStories = () => storyService.readAll();

const prefetchMapStories = async (): Promise<void> => {
	await queryClient.prefetchQuery({
		queryKey: mapStoriesKey,
		queryFn: fetchMapStories,
	});
};

const useMapStories = (): UseQueryResult<StoryType[], unknown> => {
	const query = useQuery({
		queryKey: mapStoriesKey,
		queryFn: fetchMapStories,
		staleTime: 30_000, // profile changes rarely
	});

	return query;
};

const cacheCretedStoryAndMarkStale = (newStory: StoryType) => {
	queryClient.setQueryData(mapStoriesKey, (old?: StoryType[]) =>
		old ? [newStory, ...old] : [newStory]
	);
	queryClient.invalidateQueries({ queryKey: mapStoriesKey });
};

export {
	mapStoriesKey,
	useMapStories,
	prefetchMapStories,
	cacheCretedStoryAndMarkStale,
};
