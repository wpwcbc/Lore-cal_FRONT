// storyService.ts

import { use } from "react";
import { storyRepository } from "../repositories/storyRepository";
import { type StoryBaseType, type StoryType } from "~/src/types/storyType";

const storyService = {
	readAll: async (): Promise<StoryType[]> => {
		try {
			const stories = await storyRepository.getAll();
			return stories;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	readAllFromUser: async (userId: string): Promise<StoryType[]> => {
		try {
			const stories = await storyRepository.getAllByUserId({
				userId: userId,
			});
			return stories;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	readAllFromMe: async (): Promise<StoryType[]> => {
		try {
			const stories = await storyRepository.getAllByMe();
			return stories;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	create: async (story: StoryBaseType): Promise<StoryType> => {
		try {
			const postedStory = await storyRepository.postOne(story);
			return postedStory;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

export { storyService };
