// ToggleRepliesButton.tsx

import { Pressable, StyleSheet, Text, View } from "react-native";

export function ToggleRepliesButton({
	replyCount,
	isShown,
	onToggle,
	indent,
}: {
	replyCount: number;
	isShown: boolean;
	onToggle: () => void;
	indent: number;
}) {
	return (
		<View>
			<Pressable
				onPress={() => onToggle()}
				style={[styles.toggle, { paddingLeft: indent }]}
			>
				<Text
					style={{ opacity: 0.6 }}
				>{`----- ${isShown ? "Hide replies" : `Show (${replyCount}) replies`}`}</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	toggle: {
		paddingBottom: 10,
	},
});
