import theme from '@/assets/stylesheet/theme';
import React, {useEffect, useRef, useState} from 'react';
import {
  StatusBar,
  Dimensions,
  View,
  Image,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import {FONT_FAMILY} from '@/constants/fontFamily';
import BlogDetailSkeleton from '@/components/skeletons/blogDetail';
import crashlytics from '@react-native-firebase/crashlytics';
import Share from 'react-native-share';
import {ConstructionDetailApi} from '@/services/apiMethods/construction';
import {AxiosError} from 'axios';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const ConstructionUpdateDetail = props => {
  const scrollRef = useRef();
  const [loading, setLoading] = useState(true);
  const [constructionUpdateDetails, setConstructionUpdateDetails] = useState(
    {},
  );
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    getConstructionUpdateData(props?.route?.params?.id);
  }, []);
  const getConstructionUpdateData = async id => {
    try {
      const constructionData = await ConstructionDetailApi(id);

      setConstructionUpdateDetails(constructionData);
      setLoading(false);
      setServerError(false);
    } catch (err) {
      setConstructionUpdateDetails({});
      const error = err as AxiosError;
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        setServerError(true);
      }

      setLoading(false);
      crashlytics().log(
        'Get Construction Update Data Api Construction Update Screen',
      );
      crashlytics().recordError(err);
    }
  };
  return (
    <View style={{backgroundColor: theme?.white, flex: 1}}>
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
        backArrowViewStyles={{
          width: 47,
          height: 47,
          borderRadius: 47 / 2,
          backgroundColor: theme?.transparentWhite,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        notificationViewStyles={{
          width: 47,
          height: 47,
          borderRadius: 47 / 2,
          backgroundColor: theme?.transparentWhite,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        notificationIconStyles={{height: 17, width: 17}}
        backArrowStyles={{
          height: 17,
          width: 10,
          tintColor: theme?.white,
          transform: [{rotate: '180 deg'}],
        }}
        heading={'Construction updates'}
        headingViewStyles={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
        headingStyles={{
          color: theme?.white,
          fontSize: 20,
          fontFamily: FONT_FAMILY?.IBMPlexBold,
          marginLeft: 10,
        }}
        onBackArrowPress={() => {
          if (props?.route?.params?.from == 'Home') {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          } else {
            props.navigation.goBack();
          }
        }}
        notificationIcon={false}
        onNotificationPress={() => {
          props?.navigation?.navigate('Notification');
        }}
      />
      {loading ? (
        <BlogDetailSkeleton />
      ) : (
        <>
          {Object.keys(constructionUpdateDetails).length > 0 ? (
            <ScrollView
              ref={scrollRef}
              style={{paddingHorizontal: 20}}
              contentContainerStyle={{paddingBottom: 0, paddingTop: 10}}
              showsVerticalScrollIndicator={false}
              bounces={false}
              nestedScrollEnabled={true}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  color: theme?.black,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                }}>
                {constructionUpdateDetails?.title}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                  alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 12,
                    color: theme?.textGrey,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  }}>
                  Last Update: {constructionUpdateDetails?.updated_at}
                </Text>
                {/* <View
                  style={{
                    backgroundColor: 'rgba(190, 161, 121, 0.6)',
                    height: 40,
                    width: 40,
                    borderRadius: 40 / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor:theme?.transparentWhite
                    }}
                    onPress={() => {
                      shareOnMultipleApps(
                        constructionUpdateDetails?.socialUrls?.shareUrl,
                      );
                    }}
                    activeOpacity={1}>
                    <Image
                      source={require('@/assets/images/icons/share.png')}
                      style={{height: 15, width: 15, tintColor: theme?.white}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View> */}
              </View>

              <RenderHtml
                contentWidth={screenWidth}
                source={constructionUpdateDetails?.description}
                tagsStyles={{
                  p: {
                    color: theme?.black,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  },
                  h1: {
                    color: theme?.logoColor,
                  },
                  h2: {
                    color: theme?.logoColor,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    fontSize: 30,
                  },
                  h3: {
                    marginTop: 0,
                    color: theme?.logoColor,
                  },
                  h4: {
                    marginTop: 10,
                    marginBottom: -5,
                    color: theme?.logoColor,
                  },

                  h5: {
                    color: theme?.logoColor,
                  },
                  h6: {
                    color: theme?.logoColor,
                  },
                }}
                systemFonts={[
                  ...defaultSystemFonts,
                  FONT_FAMILY?.IBMPlexBold,
                  FONT_FAMILY?.IBMPlexMedium,
                  FONT_FAMILY?.IBMPlexRegular,
                  FONT_FAMILY?.IBMPlexSemiBold,
                ]}
              />
            </ScrollView>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: screenHeight * 0.7,

                width: screenWidth * 0.99,
                alignSelf: 'center',
              }}>
              {serverError ? (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.textGrey,
                  }}>
                  Unable to load data at the moment.
                </Text>
              ) : (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexBold,
                    color: theme?.textGrey,
                  }}>
                  No construction update detail available.
                </Text>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};
export default ConstructionUpdateDetail;
