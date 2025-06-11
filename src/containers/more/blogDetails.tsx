import theme from '@/assets/stylesheet/theme';
import React, {useEffect, useRef, useState} from 'react';
import {
  StatusBar,
  Dimensions,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import {FONT_FAMILY} from '@/constants/fontFamily';
import BlogDetailSkeleton from '@/components/skeletons/blogDetail';
import {GetBlogDetail} from '@/services/apiMethods/more';
import WebView from 'react-native-webview';
import crashlytics from '@react-native-firebase/crashlytics';
import Share from 'react-native-share';
import {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const BlogDetail = props => {
  const scrollRef = useRef();
  const [loading, setLoading] = useState(true);
  const [blogDetails, setBlogDetails] = useState({});
  const [apiCrash, setApiCrash] = useState(false);
  const userData = useSelector(state => state?.user?.userDetail);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    getBlogData(props?.route?.params?.id);
  }, []);
  const getBlogData = async id => {
    try {
      const blogData = await GetBlogDetail(id);

      setBlogDetails(blogData);
      setLoading(false);
      setApiCrash(false);
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        setLoading(false);
        setApiCrash(true);
      } else {
        setLoading(false);
      }

      crashlytics().log('Get Blog Data Api Blog Detail Screen');
      crashlytics().recordError(err);
    }
  };
  const shareOnMultipleApps = url => {
    const shareOptions = {
      url: url,
      social: Share.Social.WHATSAPP,
    };

    Share.open(shareOptions)
      .then(res => console.log(res))
      .catch(err => console.log(err));
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
        heading={'Blog'}
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
          if (
            props?.route?.params?.from == 'Home' &&
            userData?.role == 'guest'
          ) {
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
          {Object.keys(blogDetails).length > 0 ? (
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
                  color: theme?.logoColor,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                }}>
                {blogDetails?.title}
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
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  {blogDetails?.created_at}
                </Text>
                <View
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
                      shareOnMultipleApps(blogDetails?.socialUrls?.shareUrl);
                    }}
                    activeOpacity={1}>
                    <Image
                      source={require('@/assets/images/icons/share.png')}
                      style={{height: 15, width: 15, tintColor: theme?.white}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text
                  allowFontScaling={false}

                  style={{
                    fontSize: 12,
                    color: theme?.textGrey,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  {blogDetails?.created_at}
                </Text>
              </View> */}

              <RenderHtml
                contentWidth={screenWidth}
                source={blogDetails?.description}
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

                // renderersProps={renderersProps}
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  color: theme?.black,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                }}>
                Related Articles
              </Text>
              <ScrollView
                style={{
                  marginTop: 20,
                  marginBottom: 30,
                }}
                contentContainerStyle={{
                  flexDirection: 'row',
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}>
                {blogDetails?.related_articles?.map(item => {
                  return (
                    <TouchableOpacity
                      style={{
                        width: screenWidth * 0.43,
                        height: 190,
                        justifyContent: 'space-between',
                        marginRight: 10,
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        setLoading(true);
                        getBlogData(item?.id);
                      }}>
                      {item?.image ? (
                        <Image
                          source={{uri: item?.image}}
                          style={{height: 138, width: '100%', borderRadius: 6}}
                          resizeMode="cover"
                        />
                      ) : (
                        <Image
                          source={require('@/assets/images/icons/logo_PH.png')}
                          style={{height: 138, width: '100%', borderRadius: 6}}
                          resizeMode="cover"
                        />
                      )}
                      <Text
                        allowFontScaling={false}
                        style={{
                          color: theme?.black,
                          fontSize: 12,
                          flexWrap: 'wrap',

                          textAlign: 'left',
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          width: screenWidth * 0.43,
                          marginVertical: 5,
                        }}>
                        {item?.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
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
              {apiCrash ? (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.textGrey,
                    textAlign: 'center',
                  }}>
                  Unable to load data at the moment.
                </Text>
              ) : (
                <>
                  <Image
                    source={require('@/assets/images/icons/smallAlert_Icon.png')}
                    style={{
                      height: 50,
                      width: 50,
                      tintColor: theme?.textGrey,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      fontFamily: FONT_FAMILY?.IBMPlexBold,
                      color: theme?.textGrey,
                    }}>
                    Currently, there is no more blog detail available.
                  </Text>
                </>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};
export default BlogDetail;
