import { createContext, useContext, PropsWithChildren, useState } from "react";
import type { StoryType } from "../types/storyType";

type PostContextType = {
	selectedStory: StoryType | null;
	setSelectedStory: (story: StoryType | null) => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export default function PostProvider({ children }: PropsWithChildren) {
	const [selectedStory, setSelectedStory] = useState<StoryType | null>(null);

	return (
		<PostContext.Provider value={{ selectedStory, setSelectedStory }}>
			{children}
		</PostContext.Provider>
	);
}

export const useSelectedStory = () => {
	const context = useContext(PostContext);
	if (!context) {
		throw new Error("usePost must be used within a PostProvider");
	}
	return context;
};
