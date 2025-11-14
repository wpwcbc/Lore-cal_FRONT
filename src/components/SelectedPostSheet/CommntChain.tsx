// CommentChain.tsx

import { View } from "react-native";
import Comment from "./Comment";
import { ChainType, CommentFromApiType } from "~/src/types/commentType";
import { useState } from "react";
import { ToggleRepliesButton } from "./ToggleRepliesButton";

export function CommentChain({
	chain,
	addComment,
	indent,
}: {
	chain: ChainType;
	addComment: (arg0: CommentFromApiType) => void;
	indent: number;
}) {
	const [isShownReplies, setIsShownReplies] = useState<boolean>(false);
	const onToggleReplies = (): void => {
		setIsShownReplies((b) => !b);
	};
	const onSwitchReplies = (action: boolean): void => {
		setIsShownReplies(action);
	};
	return (
		<>
			<View key={chain.chainId}>
				{/* head */}
				{chain.items[0] && (
					<Comment
						key={chain.items[0]._id}
						comment={chain.items[0]}
						isHead={true}
						addComment={addComment}
						onSwitchReplies={onSwitchReplies}
					/>
				)}
				{/* Show/Hide replies */}
				{chain.items.length > 1 && (
					<ToggleRepliesButton
						replyCount={chain.items.length - 1}
						isShown={isShownReplies}
						onToggle={onToggleReplies}
						indent={indent}
					/>
				)}

				{/* replies */}
				{isShownReplies &&
					chain.items
						.slice(1)
						.map((c) => (
							<Comment
								key={c._id}
								comment={c}
								addComment={addComment}
							/>
						))}
			</View>
		</>
	);
}
