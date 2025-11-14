import Map from "~/src/components/Map";
import SelectedPostSheet from "~/src/components/SelectedPostSheet/SelectedPostSheet";
import AppText from "~/src/components/Style/AppText";
import SelectedStoryProvider from "~/src/providers/SelectedStoryProvider";

export default function Wander() {
	return (
		<SelectedStoryProvider>
			<Map />
			<SelectedPostSheet />
		</SelectedStoryProvider>
	);
}
