// Footprints.tsx

import Mapbox, {
	Camera,
	Images,
	LocationPuck,
	MapView,
	ShapeSource,
	SymbolLayer,
} from "@rnmapbox/maps";
import { featureCollection, point } from "@turf/helpers";
import { FeatureCollection } from "geojson";
// Assets
import singleIcon from "~/src/assets/bookpin.png";
import smallClusterIcon from "~/src/assets/few-books.png";
import mediumClusterIcon from "~/src/assets/many-books.png";
import largeClusterIcon from "~/src/assets/bookcase.png";
import { SelectedUserSheet } from "../SelectedUserSheet/SelectedUserSheet";
import { cacheMe } from "~/src/utils/caches/cacheMe";
import { ActivityIndicator, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import {
	prefetchUserStories,
	useUserStories,
} from "~/src/utils/caches/cacheUserStories";
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent";
import { useSelectedStory } from "~/src/providers/SelectedStoryProvider";
import { router } from "expo-router";
import { authService } from "~/src/api/services/authService";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "");
const mapboxStyle =
	process.env.EXPO_PUBLIC_MAPBOX_STYLE ||
	"mapbox://styles/mapbox/streets-v12";

export function Footprints() {
	const INITIAL_CENTER: [number, number] = [114.1132929, 22.102952]; // HK example
	const INITIAL_ZOOM = 8.5;

	// Providers
	const { selectedStory, setSelectedStory } = useSelectedStory();

	// Part A: read
	const {
		data: me,
		isLoading: isLoadingUseMe,
		isError: isErrorUseMe,
	} = cacheMe.useCache();

	useFocusEffect(
		useCallback(() => {
			if (!me) return;
			cacheMe.prefetch();
			prefetchUserStories(me._id);
			console.log(`useFocusEffect: ${me.name}`);
		}, [me?._id])
	);

	/////////////////////////////
	// #region Fetch My Stories
	const { data: userStories, isLoading: isLoadingUserStories } =
		useUserStories(me?._id, !!me?._id);

	const features = useMemo<FeatureCollection>(() => {
		if (!userStories) return { type: "FeatureCollection", features: [] };
		return featureCollection(
			userStories.map((s) =>
				point([s.coord.lng, s.coord.lat], { story: s })
			)
		);
	}, [userStories]);

	// #endregion
	/////////////

	// Part B: gate
	if (isLoadingUseMe || isLoadingUserStories) return <ActivityIndicator />;
	if (isErrorUseMe || isLoadingUserStories || !me || !userStories)
		return null; // or an error UI

	const onPointPress = async (event: OnPressEvent) => {
		if (event.features[0].properties?.story) {
			setSelectedStory(event.features[0].properties.story);
		}
	};

	////////////////////////
	// #region Logout (temp)

	const onLogoutPressed = () => {
		authService.logout();
		cacheMe.remove();
		router.replace("/login");
	};

	// #endregion
	//////////////

	return (
		<>
			<Button
				title="Log out (temp placed)"
				onPress={onLogoutPressed}
				color="#ff0000"
			/>
			<MapView style={{ flex: 1 }} styleURL={mapboxStyle}>
				<Camera
					centerCoordinate={INITIAL_CENTER}
					zoomLevel={INITIAL_ZOOM}
					animationDuration={0}
				/>

				<Images images={{ singleIcon }} />

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
			<SelectedUserSheet user={me!} isMe={true} />
		</>
	);
}
