// Comment.tsx

import ContentText from "../Style/ContentText";
import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { Text } from "react-native-gesture-handler";
import { type CommentFromApiType } from "~/src/types/commentType";
import { mongooseTimeToInfo } from "~/src/utils/mongooseTimeToInfo";
import { Ionicons } from "@expo/vector-icons";
import { CommentReplyInputBox } from "./CommentReplyInputBox";
import { useState } from "react";

type CommentProps = {
	comment: CommentFromApiType;
	onLike?: (id: string) => void;
	onReply?: (id: string) => void;
	isHead?: boolean;
	addComment: (arg0: CommentFromApiType) => void;
	onSwitchReplies?: ((arg0: boolean) => void) | null;
};

export default function Comment({
	comment /*, onLike, onReply*/,
	isHead = false,
	addComment,
	onSwitchReplies = null,
}: CommentProps) {
	const [isBoxOpened, setIsBoxOpened] = useState<boolean>(false);
	const onSwitchBox = (action: boolean): void => {
		setIsBoxOpened(action);
	};

	return (
		<View style={[styles.container, !isHead && styles.replyIndent]}>
			<View style={styles.row}>
				<Image
					source={
						comment.author.avatarUrl
							? { uri: comment.author.avatarUrl }
							: undefined
					}
					style={[
						styles.avatar,
						{
							width: isHead ? 36 : 30,
							height: isHead ? 36 : 30,
							borderRadius: (isHead ? 36 : 30) / 2,
						},
					]}
				/>
				<View style={styles.right}>
					{/* author + (optional) time */}
					<View style={styles.topLine}>
						<Text style={styles.author}>{comment.author.name}</Text>
						<Text>·</Text>
						<Text style={styles.time}>
							{mongooseTimeToInfo(comment.createdAt)}
						</Text>
					</View>

					{/* content in the same column */}
					<Text style={styles.body}>{comment.content}</Text>

					{/* actions (reuse your actionBtn later) */}
					<View style={styles.actionsRow}>
						<Pressable
							style={({ pressed }) => [
								styles.actionBtn,
								pressed && { opacity: 0.6 },
							]}
							// onPress={onPressLike}
							// disabled={likeProcessing}
						>
							<Ionicons name="heart-outline" size={18} />
							{/* {isLiked ? (
								<Ionicons name="heart" color="red" size={18} />
							) : (
								<Ionicons name="heart-outline" size={18} />
							)} */}
							{/* <ContentText>{likeCount}</ContentText> */}
						</Pressable>

						<Pressable
							style={({ pressed }) => [
								styles.actionBtn,
								pressed && { opacity: 0.6 },
							]}
							onPress={() => onSwitchBox(true)}
						>
							<Ionicons
								name="chatbubble-ellipses-outline"
								size={18}
							/>
						</Pressable>
					</View>

					{/* Input Box */}
					{isBoxOpened && (
						<CommentReplyInputBox
							storyId={comment.story}
							chain={comment.chain}
							onSwitchBox={onSwitchBox}
							addComment={addComment}
							onSwitchReplies={isHead ? onSwitchReplies : null}
						/>
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { paddingBottom: 6 }, // base
	replyIndent: { marginLeft: 0, paddingLeft: 36 }, // only for sub-comments
	row: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
	avatar: { backgroundColor: "#ccc" },
	right: { flex: 1 },
	topLine: { flexDirection: "row", alignItems: "baseline", gap: 6 },
	author: { fontWeight: "600", fontSize: 15 },
	time: { fontSize: 12, opacity: 0.6 },
	body: { marginTop: 4, lineHeight: 20 },
	actionsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginTop: 6,
	},
	actionBtn: {
		flexDirection: "row", // icon + text in a row
		alignItems: "center", // vertically center them
		gap: 6, // space between icon and text (RN 0.71+)
		paddingVertical: 0, // touch target height
		paddingHorizontal: 0, // comfy sides
		borderRadius: 6,
	},
});
