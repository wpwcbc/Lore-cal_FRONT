import { Text, TextProps } from "react-native";
import { useFont } from "~/src/providers/FontProvider";

export default function AppText({ style, ...props }: TextProps) {
	const { lora } = useFont();
	const { imFellEnglish } = useFont();

	if (!lora.loaded) return null;
	if (!imFellEnglish.loaded) return null;

	return (
		<Text
			style={[
				{
					fontFamily: lora.medium,
					// letterSpacing: 0.25,
					// paddingBottom: 10,
				},
				style,
			]}
			{...props}
		/>
	);
}
