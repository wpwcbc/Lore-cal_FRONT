import { Text, TextProps } from "react-native";
import { useFont } from "~/src/providers/FontProvider";

export default function Title2Text({ style, ...props }: TextProps) {
	const { imFellEnglish } = useFont();

	if (!imFellEnglish.loaded) return null;

	return (
		<Text
			style={[
				{
					fontFamily: imFellEnglish.regular,
					fontSize: 22,
					color: "#67533c",
					paddingBottom: 10,
				},
				style,
			]}
			{...props}
		/>
	);
}
