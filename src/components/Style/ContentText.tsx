import { Text, TextProps } from "react-native";
import { useFont } from "~/src/providers/FontProvider";

export default function ContentText({ style, ...props }: TextProps) {
	const { lora } = useFont();

	if (!lora.loaded) return null;

	return (
		<Text
			style={[
				{
					fontFamily: lora.medium,
					fontSize: 14,
					color: "#000",
					letterSpacing: 0.25,
					paddingBottom: 10,
				},
				style,
			]}
			{...props}
		/>
	);
}
