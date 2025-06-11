import {
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  ScrollView,
  FlatList,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';

import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {FONT_FAMILY} from '@/constants/fontFamily';
import theme from '@/assets/stylesheet/theme';
import {SubmitButton} from '../buttons/submitButton';
import {ULElementProps} from 'react-native-render-html/lib/typescript/elements/ULElement';
import CalendarSkeleton from '../skeletons/calendarSkelton';
import {color} from 'react-native-reanimated';
// import React from 'react';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  sheetRef?: any | null;
  snapPoints?: any | null;
  monthRef?: any | null;
  months?: any | null;
  renderCarouselMonth?: any | null;
  selectedMonth?: any | null;
  onSnapToItemMonth?: any | null;
  dayRef?: any | null;
  days?: any | null;
  renderCarouselDays?: any | null;
  onSnapToItemDay?: any | null;
  yearRef?: any | null;
  years?: any | null;
  renderCarouselYears?: any | null;
  onSnapToItemYear?: any | null;
  monthRefEndDate?: any | null;
  monthsEndDate?: any | null;
  renderCarouselMonthEndDate?: any | null;
  selectedMonthEndDate?: any | null;
  onSnapToItemMonthEndDate?: any | null;
  dayRefEndDate?: any | null;
  daysEndDate?: any | null;
  renderCarouselDaysEndDate?: any | null;
  onSnapToItemDayEndDate?: any | null;
  yearRefEndDate?: any | null;
  yearsEndDate?: any | null;
  renderCarouselYearsEndDate?: any | null;
  onSnapToItemYearEndDate?: any | null;
  onSubmit?: any | null;
  error?: any | null;
  skeleton?: any | null;
}
const FilterCalendarBottomSheet = (props: Props) => {
  const {
    sheetRef,
    snapPoints,
    monthRef,
    months,
    renderCarouselMonth,
    selectedMonth,
    onSnapToItemMonth,
    onSnapToItemDay,
    dayRef,
    days,
    renderCarouselDays,
    yearRef,
    years,
    renderCarouselYears,
    onSnapToItemYear,
    monthRefEndDate,
    monthsEndDate,
    renderCarouselMonthEndDate,
    selectedMonthEndDate,
    onSnapToItemMonthEndDate,
    onSnapToItemDayEndDate,
    dayRefEndDate,
    daysEndDate,
    renderCarouselDaysEndDate,
    yearRefEndDate,
    yearsEndDate,
    renderCarouselYearsEndDate,
    onSnapToItemYearEndDate,
    onSubmit,
    error,
    skeleton,
  } = props;

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
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
      {/* <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          paddingBottom: Platform.OS == 'ios' ? 30 : 50,
        }}
        style={{borderWidth: 0, flex: Platform?.OS == 'android' && 1}}>
      

        <Text
          allowFontScaling={false}
          style={{
            paddingHorizontal: 20,
            fontSize: 24,
            fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            color: theme?.black,
          }}>
          Start Date
        </Text>
        <NativeViewGestureHandler disallowInterruption={true}>
          <Carousel
            loop={true}
            ref={monthRef}
            // loopClonesPerSide={months.length}
            useScrollView={true}
            width={screenWidth}
            height={60}
            autoPlay={false}
            data={months}
            scrollAnimationDuration={1000}
            sliderWidth={screenWidth}
            itemWidth={70}
            renderItem={renderCarouselMonth}
            hasParallaxImages={true}
            scrollToIndex={selectedMonth}
            onSnapToItem={onSnapToItemMonth}
            enableMomentum={Platform.OS == 'android' ? true : false}
            decelerationRate={0.9}
            inactiveSlideOpacity={0.5}
          />
          
        </NativeViewGestureHandler>
        <NativeViewGestureHandler disallowInterruption={true}>
          <Carousel
            loop={true}
            // loopClonesPerSide={days.length}
            useScrollView={true}
            ref={dayRef}
            width={screenWidth}
            height={80}
            autoPlay={false}
            data={days}
            scrollAnimationDuration={1000}
            sliderWidth={screenWidth}
            itemWidth={70}
            renderItem={renderCarouselDays}
            decelerationRate={0.9}
            enableMomentum={Platform.OS == 'android' ? true : false}
            onSnapToItem={onSnapToItemDay}
            inactiveSlideOpacity={0.5}
          />
        </NativeViewGestureHandler>
        <NativeViewGestureHandler disallowInterruption={true}>
          <Carousel
            loop={true}
            loopClonesPerSide={years.length}
            // useScrollView={true}
            ref={yearRef}
            width={screenWidth}
            height={60}
            autoPlay={false}
            data={years}
            scrollAnimationDuration={1000}
            sliderWidth={screenWidth}
            itemWidth={70}
            renderItem={renderCarouselYears}
            hasParallaxImages={true}
            onSnapToItem={onSnapToItemYear}
            enableMomentum={Platform.OS == 'android' ? true : false}
            decelerationRate={0.9}
            inactiveSlideOpacity={0.5}
          />
        </NativeViewGestureHandler>
        <Text
          allowFontScaling={false}
          style={{
            paddingHorizontal: 20,
            fontSize: 24,
            fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            color: theme?.black,
          }}>
          End Date
        </Text>
        <View style={{height: 30}} />
        <NativeViewGestureHandler disallowInterruption={true}>
          <Carousel
            loop={true}
            ref={monthRefEndDate}
            width={screenWidth}
            useScrollView={true}
            height={60}
            autoPlay={false}
            data={monthsEndDate}
            scrollAnimationDuration={1000}
            sliderWidth={screenWidth}
            itemWidth={70}
            renderItem={renderCarouselMonthEndDate}
            hasParallaxImages={true}
            scrollToIndex={selectedMonthEndDate}
            onSnapToItem={onSnapToItemMonthEndDate}
            enableMomentum={Platform.OS == 'android' ? true : false}
            decelerationRate={0.9}
            inactiveSlideOpacity={0.5}
          />
        </NativeViewGestureHandler>
        <NativeViewGestureHandler disallowInterruption={true}>
          <Carousel
            loop={true}
            ref={dayRefEndDate}
            useScrollView={true}
            width={screenWidth}
            height={80}
            autoPlay={false}
            data={daysEndDate}
            scrollAnimationDuration={1000}
            sliderWidth={screenWidth}
            itemWidth={70}
            renderItem={renderCarouselDaysEndDate}
            decelerationRate={0.9}
            enableMomentum={Platform.OS == 'android' ? true : false}
            onSnapToItem={onSnapToItemDayEndDate}
            inactiveSlideOpacity={0.5}
          />
        </NativeViewGestureHandler>
        <NativeViewGestureHandler disallowInterruption={true}>
          <Carousel
            loop={true}
            loopClonesPerSide={yearsEndDate.length}
            ref={yearRefEndDate}
            // useScrollView={true}
            width={screenWidth}
            height={60}
            autoPlay={false}
            data={yearsEndDate}
            scrollAnimationDuration={1000}
            sliderWidth={screenWidth}
            itemWidth={70}
            renderItem={renderCarouselYearsEndDate}
            hasParallaxImages={true}
            onSnapToItem={onSnapToItemYearEndDate}
            enableMomentum={Platform.OS == 'android' ? true : false}
            decelerationRate={0.9}
            inactiveSlideOpacity={0.5}
          />
        </NativeViewGestureHandler>
        {error && (
          <Text
          allowFontScaling={false}
            style={{
              alignSelf: 'flex-end',
              paddingRight: 20,
              fontSize: 12,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.brightRed,
            }}>
            End date must be greater than start date.
          </Text>
        )}
        <SubmitButton
          btnContainer={{
            height: 58,
            width: '90%',
            backgroundColor: theme?.logoColor,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 25,
          }}
          btnText="Filter"
          btnTextStyle={{
            color: theme?.white,
            fontSize: 14,
            fontWeight: '700',
          }}
          onPress={onSubmit}
        />
      </BottomSheetScrollView> */}
    </BottomSheet>
  );
};

export default FilterCalendarBottomSheet;
