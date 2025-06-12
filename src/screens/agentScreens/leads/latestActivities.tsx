import React, {useEffect, useState, useRef, useMemo} from 'react';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  ScrollView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view';
import List from '@/components/skeletons/list';
import {useIsFocused} from '@react-navigation/native';
import ProjectSkeleton from '@/components/skeletons/projectsSkeleton';
import {Headers} from '@/components/header/headers';
import CalendarBottomSheet from '@/components/agentBottomSheets/calender';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const LatestActivities = props => {
  const focused = useIsFocused();
  const [selected, setSelected] = useState('');
  const [endDate, setEndDate] = useState('');
  const sheetRef = useRef(null);
  // const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '1%', '65%'], []);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, [focused]);
  const [latestActivities, setLatestActivities] = useState([
    {
      id: 1,
      head: 'Follow up:',
      info: '3BHK already forwarded the details to him by WhatsApp.',
      date: '2:00 PM - 21/04/2023',
      status: 'Notes',
    },
    {
      id: 2,
      head: 'Property detail request:',
      info: 'I hope this message finds you well. Please find attached the property details requested regarding...',
      date: '2:00 PM - 21/04/2023',
      status: 'Email',
    },
    {
      id: 3,
      head: 'Lead created:',
      info: 'This lead was created from Direct Traffic from www.gjproperty.ae',
      date: '2:00 PM - 21/04/2023',
      status: 'Leads',
    },
  ]);

  const openBottomSheet = () => {
    if (sheetRef?.current) {
      sheetRef?.current.expand();
    }
  };
  const renderLatestActivities = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingRight: 15,
        }}
        activeOpacity={1}
        onPress={() => {
          // props?.navigation?.navigate(item?.route, {id: item?.projectId});
        }}>
        <View
          style={{
            width: screenWidth * 0.9,
            paddingHorizontal: 15,
            borderBottomWidth: StyleSheet?.hairlineWidth,
            paddingVertical: 10,
          }}>
          <View>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                fontSize: 19,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}>
              {item?.head}
            </Text>
          </View>
          <View style={{marginTop: 5}}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                color: theme?.logoColor,
                fontSize: 15,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                flexWrap: 'wrap',
              }}>
              {item?.info}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View
              style={{
                width: screenWidth * 0.13,
                height: 28,
                borderWidth: 1,
                borderColor: theme?.logoColor,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.logoColor,
                  fontSize: 13,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {item?.status}
              </Text>
            </View>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.black,
                fontSize: 13,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                flexWrap: 'wrap',
                // width: screenWidth*0.53,
              }}>
              {item?.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: theme?.white}}>
      <Headers
        bgStyles={{
          backgroundColor: theme?.logoColor,
          height: 100,
          width: screenWidth,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          justifyContent: 'center',
        }}
        internalViewStyles={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingHorizontal: 10,
          height: 80,
        }}
        backArrowStyles={{
          height: 17,
          width: 10,
          tintColor: theme?.white,
          transform: [{rotate: '180 deg'}],
        }}
        backArrowViewStyles={{
          width: 47,
          height: 47,
          borderRadius: 47 / 2,
          backgroundColor: theme?.transparentWhite,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        heading={'Latest Activities'}
        headingViewStyles={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 10,
          paddingLeft: 20,
        }}
        headingStyles={{
          color: theme?.white,
          fontSize: 20,
          fontFamily: FONT_FAMILY?.IBMPlexBold,
          marginLeft: 10,
        }}
        onBackArrowPress={() => {
          if (props?.route?.params?.from == 'More') {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          } else {
            props.navigation.goBack();
          }
        }}
        notificationIcon={false}
      />
      <View style={{width: screenWidth, paddingHorizontal: 20}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            openBottomSheet();
          }}
          style={{
            backgroundColor: theme?.filterBoxColor,
            width: screenWidth * 0.2,
            height: 30,
            borderRadius: 5,
            alignSelf: 'flex-end',
            marginTop: 15,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            allowFontScaling={false}
            style={{
              color: theme?.logoColor,
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            Filter
          </Text>
          <Image
            source={require('@/assets/images/icons/filter.png')}
            style={{height: 18, width: 16, left: 5}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <FlatList
          bounces={false}
          style={{}}
          data={latestActivities}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderLatestActivities}
        />
      </View>
      <CalendarBottomSheet
        sheetRef={sheetRef}
        snapPoints={snapPoints}></CalendarBottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 13,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: theme.greyRGB,
  },
  activePaginationDot: {
    width: 25,
    height: 8,
    borderRadius: 10 / 2,
    backgroundColor: theme?.bulletGrey,
  },
  // ==========================
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

export default LatestActivities;
