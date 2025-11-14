import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

export function CloseBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      pressBehavior="close"
      appearsOnIndex={0}
      disappearsOnIndex={-1}
    />
  );
}
