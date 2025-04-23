import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import { globalStyles } from "../theme/globalStyles";

const CustumBottomSheet = ({children, parentBottomSheetIndex, onClose, headerText, balance}: any) => {
  const snapPoints = useMemo(() => ["85%"], []);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number | undefined>(parentBottomSheetIndex);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const openBottomSheet = () => {
    setBottomSheetIndex(1);
  };

  const closeBottomSheet = () => {
    setBottomSheetIndex(-1);
    onClose()
  };

  return (
      <BottomSheet
        onClose={() => {
          closeBottomSheet();
        }}
        ref={bottomSheetRef}
        index={parentBottomSheetIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        style={{
          borderWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.00,

          elevation: 24,
      }}
      >
        <View style={styles.contentContainer}>
          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={globalStyles.MobH2}>
              {headerText}
            </Text>
            {balance && <Text style={globalStyles.MobH3}>
              {balance} B
            </Text>}
          </View>
          <BottomSheetScrollView style={{flex: 1}}>
            {children}
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
  );
};

export default CustumBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,

  },
  mapContainer: {
    borderWidth: 1,
    borderColor: "white",
    height: "100%",
    width: "100%",
  },
});
