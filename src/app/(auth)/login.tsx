// (auth)/login.tsx

import AppText from "~/src/components/Style/AppText";
import { useForm, Controller } from "react-hook-form";
import {
	ActivityIndicator,
	Button,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Title1Text from "~/src/components/Style/Title1Text";
import AppTextInput from "~/src/components/Style/AppTextInput";
import { authService } from "~/src/api/services/authService";
import { useRouter } from "expo-router";
import { useState } from "react";

// Form Types
type FormValues = {
	email: string;
	password: string;
};

export default function Login() {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
		reset,
	} = useForm<FormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		console.log(data);
		setPhase("loading");
		setStatusMsg("");

		try {
			await authService.login(data.email, data.password);
			setPhase("success");

			// Clear Form
			reset(); // back to defaultValues
			setStatusMsg(""); // clear banner text
			setPhase("form"); // show the form again

			// Redirect
			router.replace("/");
		} catch (e) {
			setStatusMsg(`${e}`);
			setPhase("error");
		}
	};

	///////////////////////////
	// #region Submission State
	const [phase, setPhase] = useState<
		"form" | "loading" | "success" | "error"
	>("form");
	const [statusMsg, setStatusMsg] = useState<string>("");
	// #endregion
	/////////////

	//////////////////
	// #region Go to signup / Main

	const router = useRouter();

	// #endregion
	/////////////

	return (
		<View style={s.formView}>
			<Title1Text>Login</Title1Text>

			<View style={s.fieldBox}>
				<AppText>Email</AppText>
				<Controller
					control={control}
					name="email"
					rules={{ required: true }}
					render={({ field }) => (
						<AppTextInput
							placeholder="Please enter your user email here."
							onChangeText={field.onChange}
							onBlur={field.onBlur}
							value={field.value}
							style={{
								borderBottomWidth: 1,
								backgroundColor: "#f0f0f0",
							}}
						/>
					)}
				/>
				{errors.email && <AppText>This field is required.</AppText>}
			</View>

			<View style={s.fieldBox}>
				<AppText>Password</AppText>
				<Controller
					control={control}
					name="password"
					rules={{ required: true }}
					render={({ field }) => (
						<AppTextInput
							placeholder="Please enter your password here."
							onChangeText={field.onChange}
							onBlur={field.onBlur}
							value={field.value}
							style={{
								borderBottomWidth: 1,
								backgroundColor: "#f0f0f0",
							}}
							// Password config
							secureTextEntry
							autoCapitalize="none"
							autoCorrect={false}
							textContentType="newPassword" // signup
							autoComplete="password" // safe cross-platform
						/>
					)}
				/>
				{errors.password && <AppText>This field is required.</AppText>}
			</View>

			<Button
				title="Log In"
				color={s.button.color}
				onPress={handleSubmit(onSubmit)}
				disabled={!isValid || isSubmitting}
			/>

			{phase === "loading" && <ActivityIndicator size="large" />}

			<Text>{statusMsg}</Text>

			<AppText>No account?</AppText>
			<Pressable onPress={() => router.push("/signup")}>
				<AppText>Sign up</AppText>
			</Pressable>
		</View>
	);
}

const s = StyleSheet.create({
	formView: {
		paddingHorizontal: 16,
	},
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
