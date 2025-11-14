// imageService.ts

import imageRepository, {
	imagePostOneResData,
} from "../repositories/imageRepository";

type uploadOneParams = {
	localPath: string;
	name: string;
	mime: string;
};

const imageService = {
	uploadOne: async (
		params: uploadOneParams
	): Promise<imagePostOneResData> => {
		const res: imagePostOneResData = await imageRepository.postOne(params);
		return res;
	},
};

export default imageService;
