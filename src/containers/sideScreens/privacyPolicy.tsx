import React, {useEffect, useState} from 'react';
import {StatusBar, Dimensions, Text, View, Platform} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import {ScrollView} from 'react-native-gesture-handler';
import {
  RequestPrivacyPolicy,
  RequestTermsAndCondition,
} from '@/services/apiMethods/privPolTC';
import axios, {AxiosError} from 'axios';
import {BASE_PATH_WP, BASE_URL} from '@/services/mainServices/config';
import PPSkeleton from '@/components/skeletons/ppskeleton';
import crashlytics from '@react-native-firebase/crashlytics';

let screenWidth = Math.round(Dimensions.get('window').width);
const PrivacyScreen = props => {
  const [privacyPolicyData, setPrivacyPolicy] = useState('');
  const [termsandCondition, setTermsandCondition] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiCrash, setApiCrash] = useState(false);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if(Platform.OS == 'android'){

      StatusBar.setTranslucent(true);
    }
    getPrivacyPolicy();
  }, []);
  const getPrivacyPolicy = async () => {
    try {
      const privacyPolicy = await axios.get(
        BASE_URL + BASE_PATH_WP + '/pages/v1/privacy-policy',
        {
          headers: {
            'Content-Type': 'application/json',
            // Authorization: 'Basic ' + 'admin:admin123' ,
            Authorization: 'Basic YWRtaW46WGIkJVB4Xm0qcllIazhwWWxvUk54ZDFS',
          },
        },
      );
      // const termsAndCondition = await axios.get(BASE_URL+'/pages/v1/terms-conditions',{headers:{

      //   'Content-Type': 'application/json',
      //   // Authorization: 'Basic ' + 'admin:admin123' ,
      //   Authorization: 'Basic YWRtaW46WGIkJVB4Xm0qcllIazhwWWxvUk54ZDFS',

      //     }})

      setPrivacyPolicy(
        privacyPolicy?.data?.data?.pages?.['privacy-policy']?.data
          ?.privacy_content_Editor,
      );
      setApiCrash(false);

      setLoading(false);
      // setTermsandCondition(privacyPolicy?.data?.data?.pages?.['terms-of-use']?.data?.privacy_content_Editor)
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        setApiCrash(true);
      }
      crashlytics().log('Get Privacy Policy Api in Privacy Policy Screen.');
      crashlytics().recordError(err);
    }
  };
  return (
    <>
      {/* <StatusBar barStyle={'light-content'} translucent={true}  /> */}
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
        heading={'Privacy Policy'}
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
          props.navigation.goBack();
        }}
        onNotificationPress={() => {
          props?.navigation?.navigate('Notification');
        }}
        notificationIcon={false}
      />
      {loading ? (
        <PPSkeleton />
      ) : (
        <>
          {apiCrash ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: screenWidth * 0.99,
                alignSelf: 'center',
              }}>
              {/* <Image
            source={require('@/assets/images/icons/smallAlert_Icon.png')}
            style={{
              height: 50,
              width: 50,
              tintColor: theme?.textGrey,
            }}
            resizeMode="contain"
          /> */}
              <Text
                  allowFontScaling={false}

                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.textGrey,
                }}>
                Unable to load data at the moment.
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{marginTop: 20, paddingHorizontal: 20}}
              contentContainerStyle={{paddingBottom: 20}}>
              {/* <RenderHtml
          contentWidth={screenWidth}
          source={data}
          tagsStyles={{
            p: {
              color: theme?.black,
              fontSize: 18,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
            },
          }}
          systemFonts={[
            ...defaultSystemFonts,
            FONT_FAMILY?.IBMPlexBold,
            FONT_FAMILY?.IBMPlexMedium,
            FONT_FAMILY?.IBMPlexRegular,
            FONT_FAMILY?.IBMPlexSemiBold,
          ]}
        /> */}
              <RenderHtml
                contentWidth={screenWidth}
                source={{html: privacyPolicyData}}
                tagsStyles={{
                  p: {
                    color: theme?.black,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  },
                  li: {
                    color: theme?.black,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  },
                  h4: {
                    marginTop: 10,
                    marginBottom: -5,
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
              {/* <Text
                  allowFontScaling={false}

            style={{
              color: theme?.black,
              fontSize: 18,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              textAlign:'justify'
            }}>
            {privacyPolicyData}
          </Text> */}
            </ScrollView>
          )}
        </>
      )}
    </>
  );
};
export default PrivacyScreen;
