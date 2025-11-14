import { PropsWithChildren, createContext, useContext } from "react";
import { useFonts as useLoraFonts } from "@expo-google-fonts/lora/useFonts";
import {
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    Lora_700Bold,
    Lora_400Regular_Italic,
    Lora_500Medium_Italic,
    Lora_600SemiBold_Italic,
    Lora_700Bold_Italic,
} from "@expo-google-fonts/lora";
import { useFonts as useIMFellEnglishFonts } from "@expo-google-fonts/im-fell-english/useFonts";
import { IMFellEnglish_400Regular } from "@expo-google-fonts/im-fell-english/400Regular";

type FontContextType = {
    lora: {
        loaded: boolean;
        regular: string;
        medium: string;
        semiBold: string;
        bold: string;
        italic: {
            regular: string;
            medium: string;
            semiBold: string;
            bold: string;
        };
    };
    imFellEnglish: {
        loaded: boolean;
        regular: string;
    };
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: PropsWithChildren) {
    const [loraFontsLoaded] = useLoraFonts({
        Lora_400Regular,
        Lora_500Medium,
        Lora_600SemiBold,
        Lora_700Bold,
        Lora_400Regular_Italic,
        Lora_500Medium_Italic,
        Lora_600SemiBold_Italic,
        Lora_700Bold_Italic,
    });

    const [imFellEnglishFontsLoaded] = useIMFellEnglishFonts({
        IMFellEnglish_400Regular,
    });

    const value: FontContextType = {
        lora: {
            loaded: loraFontsLoaded,
            regular: "Lora_400Regular",
            medium: "Lora_500Medium",
            semiBold: "Lora_600SemiBold",
            bold: "Lora_700Bold",
            italic: {
                regular: "Lora_400Regular_Italic",
                medium: "Lora_500Medium_Italic",
                semiBold: "Lora_600SemiBold_Italic",
                bold: "Lora_700Bold_Italic",
            },
        },
        imFellEnglish: {
            loaded: imFellEnglishFontsLoaded,
            regular: "IMFellEnglish_400Regular",
        },
    };

    return (
        <FontContext.Provider value={value}>{children}</FontContext.Provider>
    );
}

export const useFont = () => {
    const ctx = useContext(FontContext);
    if (!ctx) throw new Error("useFont must be used within FontProvider");
    return ctx;
};
