// utils/caches/cacheCreatedStory.ts

import { queryClient } from "../queryClient";
import { StoryType } from "~/src/types/storyType";
import { mapStoriesKey } from "./cacheMapStories";
import { userStoriesKey } from "./cacheUserStories";
import { cacheMe } from "./cacheMe";

const cacheCretedStoryAndMarkStale = (newStory: StoryType) => {
	// Map sotries
	queryClient.setQueryData(mapStoriesKey, (old?: StoryType[]) =>
		old ? [newStory, ...old] : [newStory]
	);
	queryClient.invalidateQueries({ queryKey: mapStoriesKey });

	// My stories
	const me = queryClient.getQueryData<{ _id: string }>(cacheMe.key);

	if (!me) return;

	queryClient.setQueryData([userStoriesKey, me._id], (old?: StoryType[]) =>
		old ? [newStory, ...old] : [newStory]
	);
	queryClient.invalidateQueries({ queryKey: [userStoriesKey, me._id] });
};

export { cacheCretedStoryAndMarkStale };
