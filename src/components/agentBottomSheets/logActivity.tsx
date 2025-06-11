import {View, Text, Platform, FlatList} from 'react-native';
import React from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
interface Props {
  sheetRef?: any | null;
  snapPoints?: any | null;
  logListingData?: any | null;
  renderLogListing?: any | null;
  outsideTouch?: any | null;
}
const LogActivityBottomSheet = (props: Props) => {
  const {
    sheetRef,
    snapPoints,
    logListingData,
    renderLogListing,
    outsideTouch,
  } = props;
  return (
    <BottomSheet
      onClose={outsideTouch}
      enablePanDownToClose={true}
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: theme?.textGrey}}
      handleStyle={{
        height: 30,
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
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
          allowFontScaling={false}
            style={{
              fontSize: 20,
              color: theme?.black,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
            }}>
            Log Activity
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
          }}>
          <FlatList
            data={logListingData}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={renderLogListing}
            bounces={false}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default LogActivityBottomSheet;
