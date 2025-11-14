// commentRepository.ts

import { ChainType, CommentFromApiType } from "~/src/types/commentType";
import httpMethods from "../httpMethods";

interface params_getCommentChainsOfAStory {
	storyId: string;
}
interface res_getCommentChainsOfAStory {
	result: ChainType[];
}

interface params_postComment {
	storyId: string;
}
interface body_postComment {
	chain: string | null;
	content: string;
}
interface res_postComment {
	comment: CommentFromApiType;
}

const commentRepository = {
	getCommentChainsOfAStory: async (
		params: params_getCommentChainsOfAStory
	): Promise<res_getCommentChainsOfAStory> => {
		try {
			const data = await httpMethods.get<res_getCommentChainsOfAStory>(
				`/stories/${params.storyId}/comments/chains`
			);

			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	postComment: async (
		params: params_postComment,
		body: body_postComment
	): Promise<res_postComment> => {
		try {
			const data = await httpMethods.post<
				body_postComment,
				res_postComment
			>(`/stories/${params.storyId}/comments`, body);

			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

export { commentRepository };
export type {
	params_getCommentChainsOfAStory,
	res_getCommentChainsOfAStory,
	params_postComment,
	body_postComment,
	res_postComment,
};
