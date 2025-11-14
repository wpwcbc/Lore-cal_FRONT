// React
import { useRef, useMemo } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
// Other Libraries
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { type coord as coordType } from "~/src/types/storyType";
import MapBox, { MapView, Camera, PointAnnotation } from "@rnmapbox/maps";
import { Feature, Geometry, GeoJsonProperties, Point } from "geojson";
//import AppText from "../Style/AppText";

// Mapbox
const mapboxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
const mapboxStyle = process.env.EXPO_PUBLIC_MAPBOX_STYLE || "";

MapBox.setAccessToken(mapboxAccessToken);

type coord = coordType | null;

type Props = {
	onChange: (coord: coord) => void;
	pendingCoord: coord;
	setPendingCoord: (coord: coord) => void;
	closeSheet: () => void;
	bottomSheetRef: React.RefObject<BottomSheetModal | null>;
	previewCenter: coord;
};

export default function LocationInputBottomSheet({
	onChange,
	pendingCoord,
	setPendingCoord,
	closeSheet,
	bottomSheetRef,
	previewCenter,
}: Props) {
	const snapPoints = useMemo(() => ["90%"], []);

	// handlers
	const handleMapPress = (feature: Feature<Geometry, GeoJsonProperties>) => {
		const geom = feature.geometry;

		if (geom.type === "Point") {
			// Mapbox arrays are [lng, lat]
			const [lng, lat] = (geom as Point).coordinates;
			setPendingCoord({ lat, lng });
			return;
		}
	};

	const handleConfirm = () => {
		onChange(pendingCoord ?? null);
		closeSheet();
	};

	return (
		<>
			<BottomSheetModal
				ref={bottomSheetRef}
				snapPoints={snapPoints}
				enableContentPanningGesture={false} // 👈 map receives swipes; drag sheet via handle only
				enableHandlePanningGesture={true} // default true; keep the handle draggable
				enablePanDownToClose={true} // optional UX
			>
				<BottomSheetView style={{ flex: 1 }}>
					<View style={{ flex: 1, minHeight: 400 }}>
						<MapView
							style={{ flex: 1 }}
							styleURL={mapboxStyle}
							onPress={handleMapPress}
							surfaceView={false}
						>
							<Camera
								centerCoordinate={
									previewCenter
										? [previewCenter.lng, previewCenter.lat]
										: [0, 0]
								}
								zoomLevel={15}
							/>
							{pendingCoord && (
								<PointAnnotation
									id="pending"
									coordinate={[
										pendingCoord.lng,
										pendingCoord.lat,
									]}
								>
									<></>
								</PointAnnotation>
							)}
						</MapView>
					</View>

					{/* Simple actions row — replace with your own Button components */}
					<View style={styles.actionRow}>
						<Pressable
							onPress={closeSheet}
							style={[styles.btn, styles.secondary]}
						>
							<Text>Cancel</Text>
						</Pressable>
						<Pressable
							onPress={handleConfirm}
							style={[styles.btn, styles.primary]}
						>
							<Text>Confirm</Text>
						</Pressable>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
}

const styles = StyleSheet.create({
	actionRow: {
		flexDirection: "row",
		gap: 12,
		padding: 16,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderColor: "#ddd",
		backgroundColor: "#fff",
	},
	btn: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	primary: { backgroundColor: "#ffb246" },
	secondary: { backgroundColor: "#eee" },
});
