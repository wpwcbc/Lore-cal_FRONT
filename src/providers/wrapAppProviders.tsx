import { PropsWithChildren } from "react";
// Providers
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { FontProvider } from "./FontProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";

export default function WrapAppProviders({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<BottomSheetModalProvider>
					<FontProvider>
						<>{children}</>
					</FontProvider>
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
