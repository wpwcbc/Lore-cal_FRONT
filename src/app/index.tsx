// app/index.tsx

import { Redirect } from "expo-router";
import { authService } from "../api/services/authService";
import { useEffect, useState } from "react";
import AppText from "../components/Style/AppText";
import { cacheMe } from "../utils/caches/cacheMe";
import { ActivityIndicator, View } from "react-native";
import Title2Text from "../components/Style/Title2Text";

export default function Index() {
	const [isLogged, setIsLogged] = useState<boolean | null>(null);

	useEffect(() => {
		(async () => {
			const result: boolean = await authService.isLogged();
			setIsLogged(result);

			if (result) {
				cacheMe.prefetch();
			}
		})();
	}, []);

	return isLogged === null ? (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				paddingHorizontal: 16,
			}}
		>
			<Title2Text>Readying...</Title2Text>
			<ActivityIndicator size="large" />
		</View>
	) : (
		<Redirect href={isLogged ? "/(tabs)" : "/(auth)/login"} />
	);
}
