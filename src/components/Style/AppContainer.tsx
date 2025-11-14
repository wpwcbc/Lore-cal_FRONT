import { View, ViewProps, ImageBackground } from "react-native";

export default function AppContainer({ style, ...props }: ViewProps) {
	return (
		<ImageBackground
			source={require("~/src/assets/background.png")}
			style={{ flex: 1 }}
			resizeMode="cover"
		>
			<View
				style={[
					{
						flex: 1,
						marginHorizontal: 24,
						marginVertical: 24,
						// backgroundColor: "#fff", // optional default
					},
					style,
				]}
				{...props}
			/>
		</ImageBackground>
	);
}
