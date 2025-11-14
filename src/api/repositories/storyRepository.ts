// storyRepository.ts

import {
	type StoryFromApi,
	type StoryType,
	type StoryBaseType,
	mapStory,
} from "~/src/types/storyType";
import httpMethods from "../httpMethods";

interface res_getAll {
	stories: StoryFromApi[];
}

interface params_getAllByUserId {
	userId: string;
}
interface res_getAllByUserId {
	stories: StoryFromApi[];
}

interface res_getAllByMe {
	stories: StoryFromApi[];
}

const storyRepository = {
	getAll: async () => {
		const resData = await httpMethods.get<res_getAll>("/stories");
		const storyFromApis = resData.stories;
		const fetchedStories = storyFromApis.map(mapStory);
		return fetchedStories;
	},
	getAllByUserId: async (params: params_getAllByUserId) => {
		const resData = await httpMethods.get<res_getAllByUserId>(
			`/users/${params.userId}/stories`
		);
		const storyFromApis = resData.stories;
		const fetchedStories = storyFromApis.map(mapStory);
		return fetchedStories;
	},
	getAllByMe: async () => {
		const resData =
			await httpMethods.get<res_getAllByMe>(`/users/me/stories`);
		const storyFromApis = resData.stories;
		const fetchedStories = storyFromApis.map(mapStory);
		return fetchedStories;
	},
	postOne: async (postingStory: StoryBaseType) => {
		try {
			const storyFromApi = await httpMethods.post<
				StoryBaseType,
				StoryFromApi
			>("/stories", postingStory);
			const postedStory = mapStory(storyFromApi);
			return postedStory;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

export { storyRepository };
