// React
import {
	useRef,
	useEffect,
	useState,
	Children,
	Fragment,
	useMemo,
} from "react";
// Other Libraries
import BottomSheet, {
	BottomSheetScrollView,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Data / Config / Providers
import { useSelectedStory } from "~/src/providers/SelectedStoryProvider";
import { CloseBackdrop } from "../BottomSheet/CloseBackdrop";
// Components
import Title1Text from "../Style/Title1Text";
import ContentText from "../Style/ContentText";
import { storyLikeService } from "~/src/api/services/storyLikeService";
import Title2Text from "../Style/Title2Text";
import { ChainType, type CommentFromApiType } from "~/src/types/commentType";
import { commentService } from "~/src/api/services/commentService";
import { Divider } from "../Style/Divider";
import { CommentChain } from "./CommntChain";
import { CommentInputBox } from "./CommentInputBox";

export default function SelectedPostSheet() {
	const { selectedStory, setSelectedStory } = useSelectedStory();
	const bottomSheetRef = useRef<BottomSheet>(null);

	useEffect(() => {
		if (selectedStory) {
			bottomSheetRef.current?.snapToIndex(0);
		} else {
			bottomSheetRef.current?.close();
		}
	}, [selectedStory]);

	//////////////////////////
	// #region Like management
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [likeCount, setLikeCount] = useState<number>(0);
	const [likeProcessing, setLikeProcessing] = useState<boolean>(false);
	const onPressLike = async () => {
		if (!selectedStory) return;
		if (likeProcessing) return;

		// Update UI
		const next = !isLiked;
		const likeCountCache = likeCount;
		const increment = next ? 1 : -1;
		setIsLiked(next);
		setLikeCount(likeCountCache + increment);

		// Set is proccessing like to block UI
		setLikeProcessing(true);

		try {
			// Call API
			if (next === true) {
				storyLikeService.likeAStory(selectedStory.id);
			} else {
				storyLikeService.unlikeAStory(selectedStory.id);
			}

			// Sync provider copy
			setSelectedStory({
				...selectedStory,
				likedByMe: next,
				likeCount: likeCountCache + increment,
			});
		} catch (e) {
			setIsLiked(!next);
			setLikeCount(likeCountCache);
			console.error(e);
		} finally {
			setLikeProcessing(false);
		}
	};

	useEffect(() => {
		setIsLiked(!!selectedStory?.likedByMe); // keep local UI in sync
	}, [selectedStory?.id, selectedStory?.likedByMe]);

	useEffect(() => {
		setLikeCount(!!selectedStory ? selectedStory.likeCount : 0); // keep local UI in sync
	}, [selectedStory?.id, selectedStory?.likeCount]);
	// #endgion
	////////////

	/////////////////////////////
	// #region Comment management
	const [chains, setChains] = useState<ChainType[]>([]);

	const addComment = (newComment: CommentFromApiType): void => {
		setChains((prev) => {
			let updatedChain: ChainType;
			let next: ChainType[];

			if (newComment.chain) {
				const chainIndexToInsert: number = prev.findIndex(
					(chain) => chain.chainId === newComment.chain
				);

				if (chainIndexToInsert === -1) {
					// TODO: Thorw error on UI: "Your replying comment is no longer exist."
					return prev;
				}

				updatedChain = {
					...prev[chainIndexToInsert],
					items: [...prev[chainIndexToInsert].items, newComment],
				};

				next = [...prev];
				next[chainIndexToInsert] = updatedChain;
			} else {
				updatedChain = {
					chainId: newComment._id,
					items: [newComment],
				};

				next = [...prev, updatedChain];
			}

			return next;
		});
	};

	useEffect(() => {
		if (!selectedStory?.id) return;
		(async () => {
			const chains: ChainType[] =
				await commentService.getCommentChainsOfAStory(selectedStory.id);
			setChains(chains);
		})();
	}, [selectedStory?.id]);
	// #endregion
	/////////////

	const snapPoints = useMemo(() => ["62%", "100%"], []);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={-1}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			enablePanDownToClose
			backdropComponent={CloseBackdrop}
			backgroundStyle={{ backgroundColor: "#EED6B1" }} // whole sheet background
			// handleStyle={{ backgroundColor: "#6A5C47" }}
			handleStyle={{
				backgroundColor: "#6A5C47",
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
				overflow: "hidden",
			}}
			handleIndicatorStyle={{ backgroundColor: "#EED6B1" }} // the little handle
			keyboardBehavior="extend" // or "fillParent" if you prefer
			keyboardBlurBehavior="restore"
		>
			{selectedStory ? (
				<BottomSheetScrollView
					style={styles.content}
					key={selectedStory?.id /* forces remount when switching */}
					stickyHeaderIndices={[0]}
				>
					<View style={styles.header}>
						<Title1Text style={styles.headerTitle}>
							{selectedStory.title}
						</Title1Text>
					</View>

					<View style={styles.body}>
						{selectedStory.thumbnailUrl && (
							<Image
								source={{ uri: selectedStory.thumbnailUrl }}
								style={styles.thumbnail}
								resizeMode="cover"
							/>
						)}
						<ContentText>{selectedStory.content}</ContentText>

						{/* Action Bar */}
						<View style={styles.actionsBar}>
							<Pressable
								style={({ pressed }) => [
									styles.actionBtn,
									pressed && { opacity: 0.6 },
								]}
								onPress={onPressLike}
								disabled={likeProcessing}
							>
								{isLiked ? (
									<Ionicons
										name="heart"
										color="red"
										size={18}
									/>
								) : (
									<Ionicons name="heart-outline" size={18} />
								)}
								<ContentText>{likeCount}</ContentText>
							</Pressable>

							<Pressable
								style={({ pressed }) => [
									styles.actionBtn,
									pressed && { opacity: 0.6 },
								]}
								onPress={() => console.log("Comment")}
							>
								<Ionicons
									name="chatbubble-ellipses-outline"
									size={18}
								/>
							</Pressable>

							<Pressable
								style={({ pressed }) => [
									styles.actionBtn,
									pressed && { opacity: 0.6 },
								]}
								onPress={() => {
									console.log("Save");
								}}
							>
								{isLiked ? (
									<Ionicons name="bookmark" size={18} />
								) : (
									<Ionicons
										name="bookmark-outline"
										size={18}
									/>
								)}
							</Pressable>
						</View>

						{/* Comment Section */}
						<View>
							<Title2Text>Comments</Title2Text>
							<CommentInputBox
								storyId={selectedStory.id}
								addComment={addComment}
							/>
							{chains.map((chain, i) => (
								<Fragment key={chain.chainId}>
									<CommentChain
										key={chain.chainId}
										chain={chain}
										addComment={addComment}
										indent={indent}
									/>
									{i < chains.length - 1 && (
										<Divider
											key={`Divider ${chain.chainId} ${i}`}
											inset={indent}
										/>
									)}
								</Fragment>
							))}
						</View>

						<Pressable
							style={styles.closeButton}
							onPress={() => setSelectedStory(null)}
						>
							<Text style={styles.closeButtonText}>Close</Text>
						</Pressable>
					</View>
				</BottomSheetScrollView>
			) : (
				<Text>No item selected</Text>
			)}
		</BottomSheet>
	);
}

const indent = 45;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EED6B1",
	},
	content: {
		paddingBottom: 24,
	},
	header: {
		backgroundColor: "#6A5C47",
		paddingHorizontal: 24,
		paddingTop: 8,
		paddingBottom: 8,
		zIndex: 1, // helps on Android sticky layering
		elevation: 1,
	},
	headerTitle: {
		color: "#fff",
		fontSize: 28,
		paddingBottom: 0,
		// (optional) fontFamily if you want the same as Title1Text
		includeFontPadding: false, // Android: tighter vertical alignment
	},
	body: { padding: 24 },
	thumbnail: {
		width: "100%",
		height: 180,
		borderRadius: 8,
		marginBottom: 12,
	},
	actionsBar: {
		// Flexbox layout (horizontal row + spacing)
		flexDirection: "row", // children side-by-side
		alignItems: "center", // vertical alignment within the row
		justifyContent: "space-between", // push ends apart (Like ⟷ Comment)

		// Box model
		paddingHorizontal: 16,
		paddingVertical: 10,
		margin: 12,

		// Subtle separators + background
		backgroundColor: "rgba(0,0,0,0.03)",
		borderTopWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "rgba(0,0,0,0.12)",

		// (optional) rounded bar feel
		// borderRadius: 8,
	},
	actionBtn: {
		flexDirection: "row", // icon + text in a row
		alignItems: "center", // vertically center them
		gap: 6, // space between icon and text (RN 0.71+)
		paddingVertical: 8, // touch target height
		paddingHorizontal: 12, // comfy sides
		borderRadius: 6,
	},
	actionBtnPressed: {
		color: "red",
	},
	closeButton: {
		alignSelf: "center",
		backgroundColor: "#6A5C47",
		borderRadius: 6,
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	closeButtonText: {
		color: "#FFF",
		fontSize: 16,
	},
});
