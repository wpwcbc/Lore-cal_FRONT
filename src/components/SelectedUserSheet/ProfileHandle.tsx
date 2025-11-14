// ProfileHandle.tsx
import { BottomSheetHandleProps } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { Pressable, View, StyleSheet } from "react-native";
import { Text } from "react-native-gesture-handler";

type Props = BottomSheetHandleProps & {
	name: string;
	atHandle: string;
	avatarUrl?: string;
	onPress?: () => void; // tap-to-expand
};

export function ProfileHandle({ name, atHandle, avatarUrl, onPress }: Props) {
	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={`Open profile of ${name}`}
			hitSlop={8}
			style={{ paddingTop: 8, paddingHorizontal: 16 }}
		>
			{/* grabber bar */}
			<View style={styles.grabber} />

			{/* avatar + name/handle */}
			<View style={styles.centerRow}>
				<Image
					source={avatarUrl ? { uri: avatarUrl } : undefined}
					style={styles.avatar}
					contentFit="cover"
				/>
				{/* <View style={{ marginLeft: 12 }}>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.handle}>@{atHandle}</Text>
				</View> */}
			</View>
		</Pressable>
	);
}

const AVATAR = 100; // tweak later

const styles = StyleSheet.create({
	grabber: {
		alignSelf: "center",
		width: 36,
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(0,0,0,0.15)",
		marginBottom: 6,
	},
	centerRow: {
		width: "100%",
		alignItems: "center",
	},
	avatar: {
		width: AVATAR,
		height: AVATAR,
		borderRadius: 999,
		marginTop: -130, // slight “float” above sheet edge
		// subtle shadow for the float effect (Android uses elevation)
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 50,
		backgroundColor: "#bbb",
	},
	name: { fontSize: 18, fontWeight: "700" },
	handle: { fontSize: 14, opacity: 0.7 },
});
