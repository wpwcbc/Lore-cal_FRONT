// storyLikeService.ts

import {
	res_deleteALike,
	res_postALike,
	storyLikeRepository,
} from "../repositories/storyLikeRepository";

const storyLikeService = {
	likeAStory: async (storyId: string): Promise<boolean> => {
		const data: res_postALike = await storyLikeRepository.postALike({
			storyId: storyId,
		});
		return data ? true : false;
	},

	unlikeAStory: async (storyId: string): Promise<boolean> => {
		const { deletedCount }: res_deleteALike =
			await storyLikeRepository.deleteALike({
				storyId: storyId,
			});
		return deletedCount === 1 ? true : false;
	},
};

export { storyLikeService };
