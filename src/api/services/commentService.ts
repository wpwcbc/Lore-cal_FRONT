// commentService.ts

import { ChainType, CommentFromApiType } from "~/src/types/commentType";
import {
	commentRepository,
	res_getCommentChainsOfAStory,
	res_postComment,
} from "../repositories/commentRepository";

const commentService = {
	getCommentChainsOfAStory: async (storyId: string): Promise<ChainType[]> => {
		const { result }: res_getCommentChainsOfAStory =
			await commentRepository.getCommentChainsOfAStory({
				storyId: storyId,
			});
		return result;
	},
	createComment: async (
		storyId: string,
		chain: string | null,
		content: string
	): Promise<CommentFromApiType> => {
		const { comment }: res_postComment =
			await commentRepository.postComment(
				{ storyId },
				{ chain, content }
			);
		return comment;
	},
};

export { commentService };
