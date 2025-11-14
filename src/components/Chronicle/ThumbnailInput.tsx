import { useState } from "react";
import { View, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import ContentText from "../Style/ContentText";
import { ThumbnailType } from "./Chronicle";

type Props = {
    value: ThumbnailType | null;
    onChange: (thumbnail: ThumbnailType | null) => void;
    aspect?: [number, number]; // e.g. [16, 9] or [1, 1]
    height?: number; // preview box height
};

export function ThumbnailInput({
    value,
    onChange,
    aspect = [16, 9],
    height = 160,
}: Props) {
    async function pickImage() {
        // 1) Ask for permission (iOS requires it; Android auto prompts)
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission denied",
                "Please allow access to your photos to select an image."
            );
            return;
        }

        // 2) Open gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: aspect,
            quality: 0.8,
            exif: false, //
        });

        if (result.canceled) {
            return;
        }

        // 3) Get the first selected asset
        const asset = result.assets?.[0];
        if (asset?.uri) {
            onChange({
                localPath: asset.uri,
                name: asset.fileName || "",
                mime: asset.mimeType || "",
            });
        }
    }

    return (
        <View style={{ gap: 8 }}>
            <Pressable
                onPress={pickImage}
                style={{
                    height: height,
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                {value ? (
                    <Image
                        source={{ uri: value.localPath }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                    />
                ) : (
                    <ContentText>Add a thumbnail</ContentText>
                )}
            </Pressable>

            {value && (
                <Pressable
                    onPress={() => onChange(null)}
                    style={{
                        alignSelf: "flex-start",
                        paddingVertical: 0,
                        paddingHorizontal: 5,
                        backgroundColor: "#6A5C47",
                        borderRadius: 12,
                    }}
                >
                    <ContentText>Remove thumbnail</ContentText>
                </Pressable>
            )}
        </View>
    );
}
