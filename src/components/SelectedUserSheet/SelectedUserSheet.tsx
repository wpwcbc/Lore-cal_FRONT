// SelectedUserSheet.tsx

import BottomSheet, {
	BottomSheetScrollView,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
	View,
	Text,
	StyleSheet,
	Button,
	ActivityIndicator,
} from "react-native";
import { useRef, useMemo, useEffect, useState } from "react";
import { ProfileHandle } from "./ProfileHandle";
import AppText from "../Style/AppText";
// Assets
import QuoteOpen from "~/src/assets/quotes.png";
import { Image } from "expo-image";
import Title3Text from "../Style/Title3Text";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "../Style/Divider";
import { UserType } from "~/src/types/userType";
import { StoryType } from "~/src/types/storyType";
import { StoryCard } from "../General/StoryCard";
import { useSelectedStory } from "~/src/providers/SelectedStoryProvider";
import { useUserStories } from "~/src/utils/caches/cacheUserStories";

type props = {
	user: UserType;
	isMe: boolean;
};

export function SelectedUserSheet({ user, isMe }: props) {
	const sheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ["4%", "45%", "100%"], []);
	const [isOpen, setIsOpen] = useState(true);

	// Open selected story sheet
	const { selectedStory, setSelectedStory } = useSelectedStory();

	const onCardPress = (story: StoryType) => {
		setSelectedStory(story);
	};

	const turfList = useMemo(
		() =>
			Array.isArray(user.turf)
				? user.turf.filter((x) => x?.en).map((x) => x.en as string)
				: [],
		[user.turf]
	);

	/////////////////////////////
	// #region Fetch User Stories
	const { data: userStories, isLoading: isLoadingUserStories } =
		useUserStories(user._id, isOpen);

	// #endregion
	/////////////

	return (
		<BottomSheet
			ref={sheetRef}
			index={1}
			snapPoints={snapPoints}
			onChange={(idx) => setIsOpen(idx >= 1)}
			enableDynamicSizing={false}
			animateOnMount
			enablePanDownToClose={false}
			backgroundStyle={{ backgroundColor: "#EED6B1" }} // whole sheet background
			handleIndicatorStyle={{ backgroundColor: "#EED6B1" }} // the little handle
			handleComponent={(p) => (
				<ProfileHandle
					name={user.name}
					avatarUrl={user.avatarUrl}
					{...p}
				/>
			)}
			handleStyle={{
				backgroundColor: "#6A5C47",
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
				overflow: "hidden",
			}}
			keyboardBehavior="extend" // or "fillParent" if you prefer
			keyboardBlurBehavior="restore"
		>
			<BottomSheetScrollView style={styles.sheet}>
				{/* User Info */}
				<View style={styles.header}>
					<View style={styles.usernameContainer}>
						<Title3Text style={styles.username}>
							{user.name}
						</Title3Text>
					</View>

					<View style={styles.quoteContainer}>
						<Image
							source={QuoteOpen}
							style={styles.quoteTL}
							contentFit="contain"
							pointerEvents="none"
						/>
						<Image
							source={QuoteOpen}
							style={styles.quoteBR}
							contentFit="contain"
							pointerEvents="none"
						/>
						{/* your text */}
						<AppText>
							{user.bio !== ""
								? user.bio
								: `(This user is still thinking... Wait for it!)`}
						</AppText>
					</View>
					<View style={styles.statsContainer}>
						<View style={styles.statsRow}>
							<View style={styles.statCell}>
								<Ionicons
									name="receipt"
									size={18}
									color="#dccdbc"
								/>
								<AppText style={{ color: "#dccdbc" }}>
									999
								</AppText>
							</View>
							<View style={styles.statCell}>
								<Ionicons
									name="fitness"
									size={18}
									color="#dccdbc"
								/>
								<AppText style={{ color: "#dccdbc" }}>
									999
								</AppText>
							</View>
							<View style={styles.statCellLong}>
								<Ionicons
									name="golf"
									size={18}
									color="#dccdbc"
								/>
								<AppText style={{ color: "#dccdbc" }}>
									{turfList.length
										? turfList.join(", ")
										: "/"}
									{/* TODO: Handle both language */}
								</AppText>
							</View>
						</View>

						<View style={styles.statsRow}>
							<View style={styles.statCell}>
								<Ionicons
									name="color-palette"
									size={18}
									color="#dccdbc"
								/>
								<AppText style={{ color: "#dccdbc" }}>
									999
								</AppText>
							</View>
							<View style={styles.statCell}>
								<Ionicons
									name="people"
									size={18}
									color="#dccdbc"
								/>
								<AppText style={{ color: "#dccdbc" }}>
									999
								</AppText>
							</View>

							<View style={styles.statCellLong}>
								<Ionicons
									name="heart"
									size={18}
									color="#dccdbc"
								/>
								<AppText style={{ color: "#dccdbc" }}>
									{user.favPlace ?? "/"}
								</AppText>
							</View>
						</View>
					</View>
					<View>
						{isMe ? (
							<Button
								color="#ffb246"
								disabled={true}
								title="Edit Info (Coming Soon)"
							/>
						) : (
							<Button color="#ffb246" title="Follow" />
						)}
					</View>
				</View>
				<Divider />
				{/* User Posts */}
				<View style={styles.postList}>
					<Title3Text style={{ marginBottom: 8 }}>Stories</Title3Text>

					{userStories?.length === 0 ? (
						<AppText style={{ opacity: 0.6 }}>
							No stories yet
						</AppText>
					) : (
						userStories?.map((s) => (
							<View key={s.id} style={styles.postItem}>
								<StoryCard
									story={s}
									onPress={() => {
										onCardPress(s);
									}}
								/>
							</View>
						))
					)}
				</View>
			</BottomSheetScrollView>
		</BottomSheet>
	);
}

const styles = StyleSheet.create({
	sheet: {},
	header: {
		backgroundColor: "#92663d",
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 16,
	},
	usernameContainer: {
		color: "#dccdbc",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: 10,
	},
	username: {
		color: "#dccdbc",
		borderRadius: 16,
		padding: 10,
		backgroundColor: "#92663d",
	},
	quoteContainer: {
		height: 150,
		backgroundColor: "#ffb347",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 18,
		padding: 20,
		position: "relative",
	},
	quoteTL: {
		position: "absolute",
		top: -6,
		left: -6, // tuck slightly outside, tweak to taste
		width: 28,
		height: 28,
		// pointerEvents so they don't block drags/taps
		// (set on the component below)
	},
	quoteBR: {
		position: "absolute",
		bottom: -6,
		right: -6,
		width: 28,
		height: 28,
		transform: [{ rotate: "180deg" }], // mirror to look like a closing quote
	},
	statsContainer: {
		flexDirection: "column",
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	statsRow: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
	},
	statCell: {
		width: `30%`,
		height: 44,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 5,
	},
	statCellLong: {
		width: `40%`,
		height: 44,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 5,
	},
	statCellEmpty: {
		width: `25%`,
		height: 44,
	},
	postList: {
		paddingHorizontal: 20,
		paddingVertical: 8,
	},
	postItem: { marginBottom: 22 },
});
