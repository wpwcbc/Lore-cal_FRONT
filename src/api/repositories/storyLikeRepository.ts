// storyLikeRepository.ts

import httpMethods from "../httpMethods";

interface params_postALike {
	storyId: string;
}
interface res_postALike {
	updateResult: any; // If exist means success
}

interface params_deleteALike {
	storyId: string;
}
interface res_deleteALike {
	acknowledged: boolean;
	deletedCount: number; // If === 1 means success
}

const storyLikeRepository = {
	postALike: async (params: params_postALike): Promise<res_postALike> => {
		try {
			const data = await httpMethods.post<undefined, res_postALike>(
				`/stories/${params.storyId}/likes`
			);

			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	deleteALike: async (
		params: params_deleteALike
	): Promise<res_deleteALike> => {
		try {
			const data = await httpMethods.delete<undefined, res_deleteALike>(
				`/stories/${params.storyId}/likes`
			);

			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

export { storyLikeRepository };
export type { res_postALike, res_deleteALike };
