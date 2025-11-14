import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
// Providers
import { useFont } from "~/src/providers/FontProvider";

export default function TabsLayout() {
	const tabTitles: string[] = ["Wander", "Chronicle", "Footprints"];
	const { lora } = useFont();

	if (!lora.loaded) return null;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				// bottom bar styling
				tabBarStyle: {
					backgroundColor: "#92663E", // bar background
					borderTopWidth: 1,
					height: 55,
				},
				tabBarActiveTintColor: "#f1ebe4", // active icon/text
				tabBarInactiveTintColor: "#f1ebe4", // inactive icon/text
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: tabTitles[0],
					tabBarIcon: ({ focused, color, size }) => (
						<Ionicons
							name={focused ? "map" : "map-outline"}
							color={color}
							size={size}
						/>
					),
					tabBarLabel: ({ focused, color }) => (
						<Text
							style={{
								fontFamily: focused
									? lora.italic.bold
									: lora.italic.medium,
								fontSize: 11,
								color,
							}}
						>
							{tabTitles[0]}
						</Text>
					),
				}}
			/>

			<Tabs.Screen
				name="tab2"
				options={{
					title: tabTitles[1],
					tabBarIcon: ({ focused, color, size }) => (
						<Ionicons
							name={focused ? "brush" : "brush-outline"}
							color={color}
							size={size}
						/>
					),
					tabBarLabel: ({ focused, color }) => (
						<Text
							style={{
								fontFamily: focused
									? lora.italic.bold
									: lora.italic.medium,
								fontSize: 11,
								color,
							}}
						>
							{tabTitles[1]}
						</Text>
					),
				}}
			/>

			<Tabs.Screen
				name="tab3"
				options={{
					title: tabTitles[2],
					tabBarIcon: ({ focused, color, size }) => (
						<Ionicons
							name={focused ? "footsteps" : "footsteps-outline"}
							color={color}
							size={size}
						/>
					),
					tabBarLabel: ({ focused, color }) => (
						<Text
							style={{
								fontFamily: focused
									? lora.italic.bold
									: lora.italic.medium,
								fontSize: 11,
								color,
							}}
						>
							{tabTitles[2]}
						</Text>
					),
				}}
			/>
		</Tabs>
	);
}
