// tab3.tsx

import { Footprints } from "~/src/components/Footprints/Footprints";
import SelectedStoryProvider from "~/src/providers/SelectedStoryProvider";
import SelectedPostSheet from "~/src/components/SelectedPostSheet/SelectedPostSheet";

export default function Tab3() {
	return (
		<SelectedStoryProvider>
			<Footprints />
			<SelectedPostSheet />
		</SelectedStoryProvider>
	);
}
