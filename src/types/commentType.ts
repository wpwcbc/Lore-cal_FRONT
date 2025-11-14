// commentType.ts

// The minimal input fields of a comment, used when a user wanna post a comment
interface CommentInitType {
	story: string;
	chain: string;
	content: string;
}

// Full comment document defined in model
interface CommentType extends CommentInitType {
	_id: string;
	author: string;
	likeCount: number;
	createdAt: string;
	updatedAt: string;
	likedByMe: boolean;
}

interface CommentFromApiType extends CommentInitType {
	_id: string;
	author: {
		_id: string;
		name: string;
		avatarUrl: string;
	};
	likeCount: number;
	createdAt: string;
	updatedAt: string;
	likedByMe: boolean;
}

interface ChainType {
	chainId: string;
	items: CommentFromApiType[];
}

export type { CommentInitType, CommentType, CommentFromApiType, ChainType };
