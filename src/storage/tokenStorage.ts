// tokenStorage.ts

import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

const setToken = (token: string): Promise<void> => {
	return SecureStore.setItemAsync(TOKEN_KEY, token);
};

const getToken = (): Promise<string | null> => {
	return SecureStore.getItemAsync(TOKEN_KEY);
};

const clearToken = (): Promise<void> => {
	return SecureStore.deleteItemAsync(TOKEN_KEY);
};

export { setToken, getToken, clearToken };
