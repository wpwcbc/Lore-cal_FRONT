// Divider.tsx

import { View, StyleSheet } from "react-native";

export const Divider = ({ inset = 0 }: { inset?: number }) => (
	<View style={[styles.line, { marginHorizontal: inset }]} />
);

const styles = StyleSheet.create({
	line: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: "#000000",
		opacity: 0.6,
		marginTop: 4,
		marginBottom: 10,
	},
});
