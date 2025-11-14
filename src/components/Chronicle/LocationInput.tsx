// React
import { useState, useRef, useMemo, useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
// Other Libraries
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
// My components / types
import { type coord as coordType } from "~/src/types/storyType";
import MapBox, { MapView, Camera, PointAnnotation } from "@rnmapbox/maps";
import LocationInputBottomSheet from "./LocationInputBottomSheet";

const mapboxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
const mapboxStyle = process.env.EXPO_PUBLIC_MAPBOX_STYLE || "";

MapBox.setAccessToken(mapboxAccessToken);

type coord = coordType | null;

type Props = {
	value: coord;
	onChange: (value: coord) => void;
	height?: number;
};

export default function LocationInput({
	value,
	onChange,
	height = 100,
}: Props) {
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const DEFAULT_CENTER: coord = {
		lat: 22.282757349999997,
		lng: 114.18952088581014,
	}; // Hong Kong

	// States
	const [pendingCoord, setPendingCoord] = useState<coord>(null);
	const [center, setCenter] = useState<coord>(DEFAULT_CENTER);
	const [userLoc, setUserLoc] = useState<coord>(null);

	// Helpers
	const openSheet = () => {
		setPendingCoord(value);
		bottomSheetRef.current?.present();
	};
	const closeSheet = () => {
		setPendingCoord(null);
		bottomSheetRef.current?.close();
	};

	// Effects
	useEffect(() => {
		// IIFE
		(async () => {
			try {
				const { status } =
					await Location.requestForegroundPermissionsAsync();
				if (status === "granted") {
					const pos = await Location.getCurrentPositionAsync({});
					setCenter({
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					});
					setUserLoc({
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					});
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	// Preview window
	const previewCenter = value ?? pendingCoord ?? userLoc ?? DEFAULT_CENTER;

	return (
		<>
			<Pressable
				onPress={openSheet}
				style={{
					height,
					borderRadius: 12,
					overflow: "hidden",
					borderWidth: 1,
					borderColor: "#ddd",
				}}
			>
				<MapView style={{ flex: 1 }} styleURL={mapboxStyle}>
					<Camera
						centerCoordinate={[
							previewCenter.lng,
							previewCenter.lat,
						]}
						zoomLevel={12}
						animationMode="none"
					/>
					{value && (
						<PointAnnotation
							id="chosen-location"
							coordinate={[value.lng, value.lat]}
						>
							<></>
						</PointAnnotation>
					)}
				</MapView>
			</Pressable>

			<LocationInputBottomSheet
				bottomSheetRef={bottomSheetRef}
				onChange={onChange}
				pendingCoord={pendingCoord}
				setPendingCoord={setPendingCoord}
				closeSheet={closeSheet}
				previewCenter={previewCenter}
			/>
		</>
	);
}
