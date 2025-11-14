import { TextInput, TextInputProps } from "react-native";
import { useFont } from "~/src/providers/FontProvider";

export default function AppTextInput({ style, ...props }: TextInputProps) {
	const { lora } = useFont();
	if (!lora.loaded) return null;

	return (
		<TextInput
			style={[
				{
					fontFamily: lora.regular,
					borderWidth: 0,
					paddingHorizontal: 5,
					paddingTop: 2,
					paddingBottom: 0,
					margin: 0,
					marginBottom: 3,
					textAlignVertical: "top",
					height: 24,
				},
				style,
			]}
			placeholderTextColor="#777777"
			{...props}
		/>
	);
}
