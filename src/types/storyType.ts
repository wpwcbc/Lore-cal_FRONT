// Exactly the categories allowed by your Mongoose enum
export type Category = "Historic" | "Anecdotal" | "HiddenGem" | "Memorable";

export type coord = { lat: number; lng: number };

// Fields defined in your schema (without Mongo ids/timestamps)
export interface StoryBaseType {
	coord: coord;
	category: Category;
	title: string;
	thumbnailUrl: string | null; // default null on backend
	content: string;
	author: string;
}

// What your frontend prefers to work with (id instead of _id)
export interface StoryType extends StoryBaseType {
	id: string;
	createdAt: string; // ISO date strings from Mongoose timestamps
	updatedAt: string;
	likedByMe: boolean;
	likeCount: number;
	venue: {
		road: {
			main: string;
			en: string;
		};
		suburb: {
			main: string;
			en: string;
		};
		district: {
			main: string;
			en: string;
		};
	};
}

// What the backend typically returns straight from Mongo/Mongoose
export interface StoryFromApi extends StoryBaseType {
	_id: string;
	createdAt: string;
	updatedAt: string;
	likedByMe: boolean;
	likeCount: number;
	venue: {
		road: {
			main: string;
			en: string;
		};
		suburb: {
			main: string;
			en: string;
		};
		district: {
			main: string;
			en: string;
		};
	};
}

// Mapper: API → Frontend shape (use this right after fetch)
export function mapStory(api: StoryFromApi): StoryType {
	const { _id, ...rest } = api;
	return { id: _id, ...rest };
}
