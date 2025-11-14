// imageRepository.ts

import httpMethods from "../httpMethods";

interface imagePostOneResData {
	url: string;
	publicId: string;
	width: number;
	height: number;
	format: string;
}

type postOneParams = {
	localPath: string;
	name: string;
	mime: string;
};

const imageRepository = {
	postOne: async ({
		localPath,
		name,
		mime,
	}: postOneParams): Promise<imagePostOneResData> => {
		const formData = new FormData();
		formData.append(
			"image",
			{
				uri: localPath,
				name,
				type: mime,
			} as any // RN typing quirk
		);

		const res: imagePostOneResData = await httpMethods.post<
			FormData,
			imagePostOneResData
		>("/images", formData);
		return res;
	},
};

export default imageRepository;
export { imagePostOneResData };
