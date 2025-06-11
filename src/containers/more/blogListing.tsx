import React, {useEffect, useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import {
  StatusBar,
  Dimensions,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import {FONT_FAMILY} from '@/constants/fontFamily';
import BlogListingSkeleton from '@/components/skeletons/blogListing';
import {GetBlogListing} from '@/services/apiMethods/more';
import {ImageProgress} from '@/components/ImageProgress';
import crashlytics from '@react-native-firebase/crashlytics';
import {useSelector} from 'react-redux';
import {AxiosError} from 'axios';
import { RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const BlogListing = props => {
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const [blogList, setBlogList] = useState([]);
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [apiCrash, setApiCrash] = useState(false);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    getBlogListData(page);
  }, []);
  const getBlogListData = async page => {
    try {
      setPage(page);
      const blogLists = await GetBlogListing(page);

      setLength(blogLists?.blog_posts?.length);
      if (page > 1) {
        const newArray = [...blogLists?.blog_posts];
        let mergeArray = [...blogList, ...newArray];
        setBlogList(mergeArray);
        setLoading(false);
      } else {
        setBlogList(blogLists?.blog_posts);
        setLoading(false);
      }
      setApiCrash(false);
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        // setErrorMsg('Unable to login at the moment.');
        setApiCrash(true);
        setLoading(false);
      } else {
        setApiCrash(false);
        setBlogList([]);
        setLoading(false);
      }
      crashlytics().log('Get Blog List Api Blog List Screen');
      crashlytics().recordError(err);
    }
  };
  const renderBlogListing = ({item}) => {
    return (
      <TouchableOpacity
        style={{padding: 20, flexDirection: 'row'}}
        activeOpacity={1}
        onPress={() => {
          props?.navigation?.navigate('BlogDetail', {id: item?.id});
        }}>
        {item?.image ? (
          <ImageProgress
            source={item?.image}
            imageStyles={{height: 140, width: 140, borderRadius: 10}}
            imageStyle={{borderRadius: 10}}
            resizeMode={'contain'}
            activityIndicatorSize={'small'}
            activityIndicatorColor={theme?.logoColor}
          />
        ) : (
          //  <Image
          //   source={{uri: item?.image}}
          //   style={{height: 140, width: 140, borderRadius: 10}}
          //   resizeMode="contain"
          // />
          <Image
            source={require('@/assets/images/icons/logo_PH.png')}
            style={{height: 140, width: 140, borderRadius: 10}}
            resizeMode="contain"
          />
        )}
        <View
          style={{
            marginLeft: 20,
            justifyContent: 'center',
            width: screenWidth,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              color: theme?.black,
              fontSize: 14,
              flexWrap: 'wrap',
              width: screenWidth == 838 ? '100%' : '50%',
              marginBottom: 5,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            {item?.title}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              color: theme?.textGrey,
              fontSize: 12,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
            }}>
            {item?.created_at}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{backgroundColor: theme?.white, height: screenHeight}}>
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
          if (userData?.role == 'customer') {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DashboardCustomer'}],
            });
          } else if (userData?.role == 'agent') {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DashboardAgent'}],
            });
          } else {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          }
        }}
        notificationIcon={false}
        onNotificationPress={() => {
          props?.navigation?.navigate('Notification');
        }}
      />
      {loading ? (
        <BlogListingSkeleton />
      ) : (
        <>
          {apiCrash ? (
            <View
              style={{
                flex: 0.8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
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
            </View>
          ) : (
            <View style={{flex: 1, paddingTop: 20}}>
              <FlatList
                bounces={false}
                data={blogList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderBlogListing}
                contentContainerStyle={{paddingBottom: 100}}
                onEndReached={() => {
                  if (length >= 10) {
                    getBlogListData(page + 1);
                  }
                }}
                onEndReachedThreshold={0}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: screenHeight * 0.7,

                        width: screenWidth * 0.99,
                        alignSelf: 'center',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 18,
                          fontFamily: FONT_FAMILY?.IBMPlexBold,
                          color: theme?.textGrey,
                        }}>
                        Currently, there are no blogs available.
                      </Text>
                    </View>
                  );
                }}
                ListFooterComponent={() => {
                  return (
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      {length >= 10 ? (
                        <ActivityIndicator
                          size={'large'}
                          color={theme?.logoColor}
                        />
                      ) : (
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 14,
                            fontFamily: FONT_FAMILY?.IBMPlexBold,
                            color: theme?.textGrey,
                          }}>
                          {blogList?.length > 0
                            ? 'Currently, there are no more blogs available.'
                            : ''}
                        </Text>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};
export default BlogListing;
