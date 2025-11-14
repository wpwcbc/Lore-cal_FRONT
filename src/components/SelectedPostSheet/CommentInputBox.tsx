// CommentInputBox.tsx

import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { CommentReplyInputBox } from "./CommentReplyInputBox";
import { CommentFromApiType } from "~/src/types/commentType";
import { cacheMe } from "~/src/utils/caches/cacheMe";

interface propsType {
	storyId: string;
	addComment: (arg0: CommentFromApiType) => void;
}
export function CommentInputBox({ storyId, addComment }: propsType) {
	const { data: me, isLoading, isError } = cacheMe.useCache();

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<Image
					source={me?.avatarUrl ?? undefined}
					style={[
						styles.avatar,
						{
							width: 36,
							height: 36,
							borderRadius: 36 / 2,
						},
					]}
				/>
				<View style={styles.right}>
					<CommentReplyInputBox
						storyId={storyId}
						chain={null}
						onSwitchBox={null}
						addComment={addComment}
						isTop={true}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { paddingBottom: 6 + 10 }, // base
	replyIndent: { marginLeft: 0, paddingLeft: 36 }, // only for sub-comments
	row: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
	avatar: { backgroundColor: "#ccc" },
	right: { flex: 1 },
});
