// storyCard.tsx
import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import AppText from "../Style/AppText";
import { StoryType } from "~/src/types/storyType";
import Title2Text from "../Style/Title2Text";
import Title3Text from "../Style/Title3Text";

type Props = {
	story: StoryType;
	onPress?: (s: StoryType) => void;
	style?: object;
};

export function StoryCard({ story, onPress, style }: Props) {
	return (
		<Pressable
			onPress={() => onPress?.(story)}
			accessibilityRole="button"
			accessibilityLabel={`Open story: ${story.title}`}
			style={({ pressed }) => [
				styles.cardShadow,
				pressed && { opacity: 0.95 },
				style,
			]}
		>
			{/* Rounded container that clips children */}
			<View style={styles.cardSurface}>
				<View style={styles.media}>
					<Image
						source={story.thumbnailUrl || undefined}
						style={StyleSheet.absoluteFill}
						contentFit="cover"
						transition={200} // subtle fade-in
					/>
					{!story.thumbnailUrl && (
						<View style={styles.mediaFallback} />
					)}

					{/* Optional category badge overlay */}
					<View style={styles.badge}>
						<AppText style={styles.badgeText}>
							{story.category}
						</AppText>
					</View>
				</View>
				<View style={styles.body}>
					<Title3Text numberOfLines={2} style={styles.title}>
						{story.title ?? ""}
					</Title3Text>
					<AppText numberOfLines={1} style={styles.venue}>
						{`${story.venue.road.en}, ${story.venue.suburb.en}, ${story.venue.district.en}`}
					</AppText>
				</View>
			</View>
		</Pressable>
	);
}

const RADIUS = 12;

const styles = StyleSheet.create({
	// Layer 1: shadow holder, keeps shadow visible on iOS and Android
	cardShadow: {
		borderRadius: RADIUS,
		backgroundColor: "#fff",
		// Android
		elevation: 2,
		// iOS
		shadowColor: "#000",
		shadowOpacity: 0.12,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
	},
	// Layer 2: actual surface that clips children
	cardSurface: {
		borderRadius: RADIUS,
		overflow: "hidden",
		backgroundColor: "#fff",
	},
	media: {
		width: "100%",
		aspectRatio: 16 / 9, // safe default for news/blog cards
		backgroundColor: "#eee",
	},
	mediaFallback: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#e0e0e0",
	},
	badge: {
		position: "absolute",
		top: 8,
		left: 8,
		backgroundColor: "rgba(0,0,0,0.55)",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	badgeText: { color: "#fff", fontSize: 12 },
	body: { padding: 10, gap: 4 },
	title: { fontWeight: "600" },
	venue: { color: "#999", fontSize: 12 },
});
