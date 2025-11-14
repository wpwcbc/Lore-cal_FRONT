import { StrictMode } from "react";
import { Slot } from "expo-router";
import WrapAppProviders from "~/src/providers/wrapAppProviders";

export default function Layout() {
	return (
		<StrictMode>
			<WrapAppProviders>
				<Slot />
			</WrapAppProviders>
		</StrictMode>
	);
}
