// CommentReplyInputBox.tsx

import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useLayoutEffect } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { InteractionManager } from "react-native";
import { commentService } from "~/src/api/services/commentService";
import { CommentFromApiType } from "~/src/types/commentType";
// Form Types
type FormValues = {
	content: string;
};

interface propsType {
	storyId: string;
	chain: string | null;
	onSwitchBox: ((arg0: boolean) => void) | null; // For top level comment box will not be switch off
	addComment: (arg0: CommentFromApiType) => void;
	onSwitchReplies?: ((arg0: boolean) => void) | null;
	isTop?: boolean;
}

export function CommentReplyInputBox({
	storyId,
	chain,
	onSwitchBox = null,
	addComment,
	onSwitchReplies = null,
	isTop = false,
}: propsType) {
	///////////////////////////
	// #region Form management
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			content: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const comment: CommentFromApiType = await commentService.createComment(
			storyId,
			chain,
			data.content
		);
		addComment(comment);

		inputRef.current?.clear();
		if (onSwitchBox) onSwitchBox(false);

		// For replying a head must open the replies.
		if (onSwitchReplies) onSwitchReplies(true);
	};
	// #endregion
	/////////////

	//////////////////////
	// #region Focus Input
	const inputRef = useRef<React.ComponentRef<
		typeof BottomSheetTextInput
	> | null>(null);

	useLayoutEffect(() => {
		if (!isTop) {
			const task = InteractionManager.runAfterInteractions(() => {
				requestAnimationFrame(() => inputRef.current?.focus?.());
			});
			return () => task.cancel();
		}
	}, []);
	// #endreggion
	//////////////

	return (
		<View style={styles.container}>
			<Controller
				control={control}
				name="content"
				render={({ field }) => (
					<BottomSheetTextInput
						ref={inputRef}
						placeholder="Your comment..."
						onChangeText={field.onChange}
						onBlur={field.onBlur}
						value={field.value ?? ""}
						style={styles.inputBox}
					/>
				)}
			/>
			<Pressable
				style={({ pressed }) => [pressed && { opacity: 0.6 }]}
				onPress={() => {
					if (onSwitchBox) return onSwitchBox(false);
				}}
			>
				<Ionicons name="close-circle-outline" size={20} />
			</Pressable>
			<Pressable
				style={({ pressed }) => [pressed && { opacity: 0.6 }]}
				onPress={handleSubmit(onSubmit)}
			>
				<Ionicons name="paper-plane-outline" size={18} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
	inputBox: {
		minHeight: 40,
		paddingVertical: 8,
		width: "75%",
		borderBottomWidth: 1,
		// backgroundColor: "#EED6B1",
		color: "#000",
		opacity: 0.6,
	},
});
