// React
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
// Other Libraries
import MapBox, {
	MapView,
	Camera,
	LocationPuck,
	UserLocation,
	ShapeSource,
	SymbolLayer,
	Images,
} from "@rnmapbox/maps";
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent";
import * as ExpoLoc from "expo-location";
import { Platform, ActivityIndicator } from "react-native";
import { featureCollection, point } from "@turf/helpers";
import { FeatureCollection } from "geojson";
// Data / Config / Providers
import { storyService } from "~/src/api/services/storyService";
import { type StoryType } from "~/src/types/storyType";
import { useSelectedStory } from "~/src/providers/SelectedStoryProvider";
// Assets
import singleIcon from "~/src/assets/bookpin.png";
import smallClusterIcon from "~/src/assets/few-books.png";
import mediumClusterIcon from "~/src/assets/many-books.png";
import largeClusterIcon from "~/src/assets/bookcase.png";
import { useMapStories } from "../utils/caches/cacheMapStories";
import { useFocusEffect } from "@react-navigation/native";

const mapboxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
const mapboxStyle = process.env.EXPO_PUBLIC_MAPBOX_STYLE || "";

MapBox.setAccessToken(mapboxAccessToken);

export default function Map() {
	const camRef = useRef<Camera>(null);

	// Providers
	const { selectedStory, setSelectedStory } = useSelectedStory();

	// State
	const [follow, setFollow] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			// Android runtime permission
			if (Platform.OS === "android") {
				const ok = await MapBox.requestAndroidLocationPermissions();
				if (!ok) return;
			}
			// one-shot center, then enable follow
			const { status } =
				await ExpoLoc.requestForegroundPermissionsAsync();
			if (status === "granted") {
				const p = await ExpoLoc.getCurrentPositionAsync({});
				camRef.current?.setCamera({
					centerCoordinate: [p.coords.longitude, p.coords.latitude],
					zoomLevel: 15,
					animationDuration: 800,
				});
				setFollow(true);
			}
		})();
	}, []);

	// if (loading) {
	//     return <ActivityIndicator size="large" color="#0000ff" />;
	// }

	/////////////////////////////
	// #region Cache Map Stories

	const {
		data: mapStories,
		isLoading,
		refetch,
		isStale,
		isError,
	} = useMapStories();

	useFocusEffect(
		useCallback(() => {
			if (isStale) refetch();
		}, [isStale, refetch])
	);

	const features = useMemo<FeatureCollection>(() => {
		if (!mapStories) return { type: "FeatureCollection", features: [] };
		return featureCollection(
			mapStories.map((s) =>
				point([s.coord.lng, s.coord.lat], { story: s })
			)
		);
	}, [mapStories]);

	// #endregion
	/////////////

	const onPointPress = async (event: OnPressEvent) => {
		if (event.features[0].properties?.story) {
			setSelectedStory(event.features[0].properties.story);
		}
	};

	if (isLoading) return <ActivityIndicator />;
	if (isError || !mapStories) return null; // or an error UI

	return (
		<MapView style={{ flex: 1 }} styleURL={mapboxStyle}>
			<Camera followUserLocation followZoomLevel={15} />

			<LocationPuck puckBearingEnabled puckBearing="heading" />

			{/* <UserLocation
                visible={false}
                onUpdate={
                    (loc) => {
                        const { latitude, longitude } = loc.coords;
                       console.log('MAPBOX loc:', latitude, longitude, 't=', loc.timestamp);
                    }
                }
            /> */}

			<ShapeSource
				id="posts"
				shape={features}
				cluster
				clusterRadius={20}
				onPress={onPointPress}
			>
				<Images
					images={{
						singleIcon,
						smallClusterIcon,
						mediumClusterIcon,
						largeClusterIcon,
					}}
				/>

				{/* Single Icon */}
				<SymbolLayer
					id="posts-icons"
					existing
					filter={["!", ["has", "point_count"]]}
					style={{
						iconImage: "singleIcon",
						iconSize: 0.07,
						iconAnchor: "bottom",
						iconAllowOverlap: true,
					}}
				/>

				{/* Small Cluster Icon */}
				<SymbolLayer
					id="posts-small-cluster-icons"
					existing
					filter={[
						"all",
						["has", "point_count"],
						["<=", ["get", "point_count"], 10],
					]}
					style={{
						textField: ["get", "point_count"],
						iconImage: "smallClusterIcon",
						iconSize: 0.1,
						iconAnchor: "bottom",
						iconAllowOverlap: true,
					}}
				/>

				{/* Medium Cluster Icon */}
				<SymbolLayer
					id="posts-medium-cluster-icons"
					existing
					filter={[
						"all",
						["has", "point_count"],
						[">", ["get", "point_count"], 10],
						["<=", ["get", "point_count"], 20],
					]}
					style={{
						textField: ["get", "point_count"],
						iconImage: "mediumClusterIcon",
						iconSize: 0.11,
						iconAnchor: "bottom",
						iconAllowOverlap: true,
					}}
				/>

				{/* Large Cluster Icon */}
				<SymbolLayer
					id="posts-large-cluster-icons"
					existing
					filter={[
						"all",
						["has", "point_count"],
						[">", ["get", "point_count"], 20],
					]}
					style={{
						textField: ["get", "point_count"],
						iconImage: "largeClusterIcon",
						iconSize: 0.12,
						iconAnchor: "bottom",
						iconAllowOverlap: true,
					}}
				/>
			</ShapeSource>
		</MapView>
	);
}
