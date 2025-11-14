// userType.ts

// The intersection of all User use case
interface UserBaseType {
	name: string;
	email: string;
}

// The minimal input fields of a user, used when a create a User
interface UserInitType extends UserBaseType {
	password: string;
}

// Full User document defined in model
interface UserType extends UserInitType {
	_id: string;
	avatarUrl: string;
	role: string;
	bio: string;
	turf: [
		{
			main: string | null;
			en: string | null;
			count: number | null;
		},
	];
	favPlace: string | null;
	createdAt: string;
	updatedAt: string;
}

// interface CommentFromApiType extends CommentInitType {
// 	_id: string;
// 	author: {
// 		_id: string;
// 		name: string;
// 		avatarUrl: string;
// 	};
// 	likeCount: number;
// 	createdAt: string;
// 	updatedAt: string;
// 	likedByMe: boolean;
// }

export type { UserBaseType, UserInitType, UserType };
