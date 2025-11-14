// Libraries
import {
	ScrollView,
	StyleSheet,
	Alert,
	Button,
	View,
	ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
// My Components
import type { coord, StoryType, StoryBaseType } from "~/src/types/storyType";
import AppText from "~/src/components/Style/AppText";
import AppTextInput from "~/src/components/Style/AppTextInput";
import Title1Text from "~/src/components/Style/Title1Text";
import { useFont } from "~/src/providers/FontProvider";
import AppContainer from "../Style/AppContainer";
import { ThumbnailInput } from "./ThumbnailInput";
import LocationInput from "./LocationInput";
// My api
import { storyService } from "~/src/api/services/storyService";
import { imagePostOneResData } from "~/src/api/repositories/imageRepository";
import imageService from "~/src/api/services/imageService";
import * as ExpoFS from "expo-file-system";
import { cacheCretedStoryAndMarkStale } from "~/src/utils/caches/cacheMapStories";
import { useState } from "react";

// Form Types
type FormValues = {
	title: string;
	content: string;
	thumbnail: ThumbnailType | null;
	coord: coord | null;
};

export type ThumbnailType = {
	localPath: string;
	name: string;
	mime: string;
};

export default function Chronicle() {
	// --- form ---
	const {
		control,
		handleSubmit,
		formState: { isValid, isSubmitting },
		reset,
		setError,
	} = useForm<FormValues>({
		defaultValues: {
			title: "",
			content: "",
			thumbnail: null,
			coord: null,
		},
		mode: "onChange",
	});

	///////////////////////////
	// #region Submission State
	const [phase, setPhase] = useState<
		"form" | "loading" | "success" | "error"
	>("form");
	const [statusMsg, setStatusMsg] = useState<string>("");
	// #endregion
	/////////////

	async function onSubmit(data: FormValues) {
		setPhase("loading");

		console.log("Submitted", JSON.stringify(data));

		try {
			let thumbnailUrl: string | null = null;

			if (data.thumbnail) {
				// you fetch file info but never use it; drop the call unless you need a size check
				const res: imagePostOneResData = await imageService.uploadOne({
					localPath: data.thumbnail.localPath,
					name: data.thumbnail.name,
					mime: data.thumbnail.mime,
				});
				thumbnailUrl = res.url;
			}

			const story: StoryBaseType = {
				title: data.title,
				category: "Historic",
				content: data.content,
				thumbnailUrl,
				coord: data.coord as coord,
				author: "System Seeder",
			};

			const postedStory: StoryType = await storyService.create(story);
			cacheCretedStoryAndMarkStale(postedStory);

			setStatusMsg("Your Story is created!");
			setPhase("success");

			// Reset form so back-to-form is clean
			reset();
		} catch (e: any) {
			setStatusMsg(e?.message ?? "Failed to create story.");
			setPhase("error");

			setError("root", { message: statusMsg });
		}
	}

	///////////////////////////
	// #region Reset management

	const onReset = () => {
		reset(); // back to defaultValues
		setStatusMsg(""); // clear banner text
		setPhase("form"); // show the form again
	};

	// #endregion
	/////////////

	// --- from providers ---
	const { lora } = useFont();
	if (!lora.loaded) return null;

	///////////////////////
	// #region Phase return

	if (phase === "loading") {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<ActivityIndicator size="large" />
				<AppText style={{ marginTop: 12 }}>
					Creating your story…
				</AppText>
			</View>
		);
	}

	if (phase === "success") {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Title1Text>{statusMsg}</Title1Text>
				{/* Add actions */}
				<Button
					color="#ffb246"
					title="Create another"
					onPress={onReset}
				/>
				{/* <Button color="#ffb246" title="Go to map" onPress={() => router.replace('/map')} /> */}
			</View>
		);
	}

	if (phase === "error") {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Title1Text>{statusMsg}</Title1Text>
				<Button
					color="#ffb246"
					title="Back to form"
					onPress={onReset}
				/>{" "}
			</View>
		);
	}

	// #endregion
	/////////////

	//////////////
	// #region Form return

	return (
		<ScrollView>
			<AppContainer>
				<Title1Text>Tell a story...</Title1Text>

				<View style={s.fieldBox}>
					<AppText>Title</AppText>
					<Controller
						control={control}
						name="title"
						rules={{
							required: "Title required",
							// setValueAs: (v: string) =>
							// 	typeof v === "string" ? v.trim() : v,
							validate: (v) => v.length > 0 || "Title required",
						}}
						render={({ field }) => (
							<AppTextInput
								placeholder="Title"
								style={s.input}
								onChangeText={field.onChange}
								onBlur={field.onBlur}
								value={field.value}
							/>
						)}
					/>
				</View>

				<View style={s.fieldBox}>
					<AppText>Content</AppText>
					<Controller
						control={control}
						name="content"
						rules={{
							required: "Content required",
							// setValueAs: (v: string) =>
							// 	typeof v === "string" ? v.trim() : v,
							validate: (v) => v.length > 0 || "Content required",
						}}
						render={({ field }) => (
							<AppTextInput
								placeholder="Tell a story..."
								onChangeText={field.onChange}
								onBlur={field.onBlur}
								value={field.value}
								style={[{ height: 240 }, s.input]}
								multiline={true}
								numberOfLines={100}
							/>
						)}
					/>
				</View>

				<View style={s.fieldBox}>
					<AppText>Thumbnail</AppText>
					<Controller
						control={control}
						name="thumbnail"
						rules={{
							validate: (v) =>
								(!!v && !!v.localPath) || "Thumbnail required",
						}}
						render={({ field }) => {
							return (
								<ThumbnailInput
									value={field.value}
									onChange={field.onChange}
								/>
							);
						}}
					/>
				</View>

				<View style={s.fieldBox}>
					<AppText>Location</AppText>
					<Controller
						control={control}
						name="coord"
						rules={{
							validate: (v) =>
								(!!v &&
									typeof v.lat === "number" &&
									typeof v.lng === "number") ||
								"Location required",
						}}
						render={({ field }) => (
							<LocationInput
								value={field.value}
								onChange={field.onChange}
								height={200}
							/>
						)}
					/>
				</View>

				<Button
					color="#ffb246"
					title="Submit"
					onPress={handleSubmit(onSubmit)}
					disabled={!isValid || isSubmitting}
				/>
			</AppContainer>
		</ScrollView>
	);

	// #endregion
	/////////////
}

const s = StyleSheet.create({
	fieldBox: {
		paddingBottom: 10,
	},
	input: {
		borderBottomWidth: 1,
		backgroundColor: "#f0f0f0",
	},
	button: {
		color: "#ffb246",
	},
});
