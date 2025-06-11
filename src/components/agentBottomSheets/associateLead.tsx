import {
  View,
  Text,
  Platform,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import theme from '@/assets/stylesheet/theme';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {SubmitButton} from '../buttons/submitButton';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SearchBar} from '../searchBar';
import AgentAllLeadsSkeleton from '../skeletons/allLeads';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

interface Props {
  sheetRef?: any | null;
  snapPoints?: any | null;
  onSubmit?: any | null;
  onPressLog?: any | null;
  leadData?: any | null;
  renderLeadData?: any | null;
  filterData?: any | null;
  searchValue?: any | null;
  onChangeText?: any | null;
  onEndReachedData?: any | null;
  threshold?: any | null;
  footerCompo?: any | null;
  emptyCompo?: any | null;
  allSkeleton?: any | null;
}
const AssociateLeadBottomSheet = (props: Props) => {
  const {
    sheetRef,
    snapPoints,
    onSubmit,
    onPressLog,
    leadData,
    renderLeadData,
    filterData,
    searchValue,
    onChangeText,
    onEndReachedData,
    threshold,
    footerCompo,
    emptyCompo,
    allSkeleton,
  } = props;

  return (
    <BottomSheet
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
          Associate with Lead
        </Text>
      </View>
      <View style={{width: screenWidth, marginTop: 20}}>
        <SearchBar
          showFilter={false}
          value={searchValue}
          filterData={filterData}
          placeHolder={'Search'}
          onChangeTexts={onChangeText}
        />
      </View>
      <BottomSheetScrollView
        bounces={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
          flex: 1,
        }}>
        {allSkeleton ? (
          <View
            style={{
              left: 12,
            }}>
            <AgentAllLeadsSkeleton />
          </View>
        ) : leadData?.length > 0 ? (
          <BottomSheetFlatList
            style={{
              maxHeight: 320,
            }}
            data={leadData}
            bounces={leadData?.length > 0 ? true : false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={renderLeadData}
            onEndReached={onEndReachedData}
            onEndReachedThreshold={threshold}
            ListFooterComponent={footerCompo}
            ListEmptyComponent={emptyCompo}
          />
        ) : (
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.textGrey,
              alignSelf: 'center',
              marginTop: 40,
            }}>
            {'No Lead found related to your query.'}
          </Text>
        )}
      </BottomSheetScrollView>
      <SubmitButton
        btnContainer={{
          height: 58,
          width: '90%',
          backgroundColor: theme?.logoColor,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
          marginBottom: 10,
        }}
        btnText="Save"
        btnTextStyle={{
          color: theme?.white,
          fontSize: 14,
          fontWeight: '700',
        }}
        onPress={onSubmit}
      />
    </BottomSheet>
  );
};

export default AssociateLeadBottomSheet;
