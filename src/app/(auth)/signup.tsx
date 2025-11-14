import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	ActivityIndicator,
	Button,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { authService } from "~/src/api/services/authService";
import AppText from "~/src/components/Style/AppText";
import AppTextInput from "~/src/components/Style/AppTextInput";
import Title1Text from "~/src/components/Style/Title1Text";
import Title2Text from "~/src/components/Style/Title2Text";

// Form Types
type FormValues = {
	name: string;
	email: string;
	password: string;
	passwordConfirm: string;
};

// app/(auth)/signup.tsx
export default function Signup() {
	///////////////
	// #region Form
	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors, isValid, isSubmitting },
		reset,
	} = useForm<FormValues>({
		mode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			password: "",
			passwordConfirm: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		console.log(data);

		setPhase("loading");
		setStatusMsg("");

		try {
			await authService.signup(
				data.name,
				data.email,
				data.password,
				data.passwordConfirm
			);

			setStatusMsg(
				`Congratdulations, ${data.name}!\r\n
				Your account is created!\r\n
				Ready to exp-lore~`
			);
			setPhase("success");
		} catch (e) {
			setStatusMsg(`${e}`);
			setPhase("error");
		}
	};

	// #endregion
	/////////////

	///////////////////////////
	// #region Submission State
	const [phase, setPhase] = useState<
		"form" | "loading" | "success" | "error"
	>("form");
	const [statusMsg, setStatusMsg] = useState<string>("");
	// #endregion
	/////////////

	///////////////////////////
	// #region Reset management

	const onSuccessPageButtonPressed = () => {
		router.push("/login");
		reset(); // back to defaultValues
		setStatusMsg(""); // clear banner text
		setPhase("form"); // show the form again
	};

	// #endregion
	/////////////

	///////////////////////
	// #region Phase return

	if (phase === "success") {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					paddingHorizontal: 16,
					backgroundColor: "#edd5b0",
				}}
			>
				<Title2Text>{statusMsg}</Title2Text>
				{/* Add actions */}
				<Button
					color="#ffb246"
					title="Go to login"
					onPress={onSuccessPageButtonPressed}
				/>
				{/* <Button color="#ffb246" title="Go to map" onPress={() => router.replace('/map')} /> */}
			</View>
		);
	}

	// #endregion
	/////////////

	return (
		<View style={s.formView}>
			<Title1Text>Sign Up</Title1Text>

			<View style={s.fieldBox}>
				<AppText>Username</AppText>
				<Controller
					control={control}
					name="name"
					rules={{ required: true }}
					render={({ field }) => (
						<AppTextInput
							placeholder="Please enter your user name here."
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
				{errors.name && <AppText>This field is required.</AppText>}
			</View>

			<View style={s.fieldBox}>
				<AppText>Email</AppText>
				<Controller
					control={control}
					name="email"
					rules={{
						required: "Email is required",
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: "Invalid email",
						},
					}}
					render={({ field }) => (
						<AppTextInput
							placeholder="Please enter your email here."
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

			<View style={s.fieldBox}>
				<AppText>Confirm Password</AppText>
				<Controller
					control={control}
					name="passwordConfirm"
					rules={{
						required: "Confirm your password",
						validate: (v) =>
							v === getValues("password") ||
							"Passwords do not match",
					}}
					render={({ field }) => (
						<AppTextInput
							placeholder="Please re-enter your password here."
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
				{errors.passwordConfirm && (
					<AppText>This field is required.</AppText>
				)}
			</View>

			<Button
				title="Sign Up"
				color={s.button.color}
				onPress={handleSubmit(onSubmit)}
				disabled={!isValid || isSubmitting}
			/>

			{phase === "loading" && <ActivityIndicator size="large" />}

			<Text>{statusMsg}</Text>
		</View>
	);
}

const s = StyleSheet.create({
	formView: {
		padding: 16,
		backgroundColor: "#edd5b0",
		height: "100%",
	},
	fieldBox: {
		paddingBottom: 10,
	},
	input: {
		borderBottomWidth: 1,
		backgroundColor: "#edd5b0",
	},
	button: {
		color: "#ffb246",
	},
});
