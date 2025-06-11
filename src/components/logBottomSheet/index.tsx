import { View, Text,Platform } from 'react-native'
import React from 'react'
import BottomSheet, {
    BottomSheetScrollView,
  } from '@gorhom/bottom-sheet';
  interface Props {
    sheetRef?: any | null;
    snapPoints?: any | null;
  }
const LogsBottomSheet = (props: Props) => {
    const {sheetRef,snapPoints } = props;
  return (
    <BottomSheet
    ref={sheetRef}
    index={1}
    snapPoints={snapPoints}
    handleIndicatorStyle={{backgroundColor: theme?.textGrey}}
    handleStyle={{
      paddingTop: 10,
      height: 40,
    }}
    backgroundStyle={{
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    }}>
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      nestedScrollEnabled={true}
      contentContainerStyle={{
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingBottom: Platform.OS == 'ios' ? 30 : 50,
      }}
      style={{borderWidth: 0}}>
    <View>
      <Text 
          allowFontScaling={false}
      >LogsBottomSheet</Text>
    </View>
    </BottomSheetScrollView>
    </BottomSheet>
  )
}

export default LogsBottomSheet