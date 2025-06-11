import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Loader} from '@/components/loader';
import {useIsFocused} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import UserListingSkeleton from '@/components/skeletons/userListingSkeleton';
import {ImageProgress} from '@/components/ImageProgress';
import {ConfirmationPopup} from '@/components/modal/confirmationPopup';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const UserListing = props => {
  const focused = useIsFocused();
  const [itemId, setItemId] = useState(-1);
  const [userList, setUserList] = useState([
    {
      id: 1,
      image: '',
      firstName: 'Sheikh',
      lastName: 'Salman',
      email: 'SheikhSalman@gmail.com',
      mobile: '11111111111',
      code: '+971',
      permission: 'Full Access',
      status: 0,
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    },
    {
      id: 2,
      image: '',
      firstName: 'Saeed',
      lastName: 'Ali',
      email: 'SaeedAli@gmail.com',
      mobile: '11111111111',
      code: '+92',
      permission: 'Payment Access',
      status: 1,
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    },
    {
      id: 3,
      image: '',
      firstName: 'Muhammad',
      lastName: 'Ali',
      email: 'MuhammadAli@gmail.com',
      mobile: '11111111111',
      code: '+91',
      permission: 'No Payment Access',
      status: 0,
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [loadingMark, setLoadingMark] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setItemId(-1);
    getUserList();
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, [focused]);
  useLayoutEffect(() => {}, []);

  const getUserList = async () => {
    try {
      setLoading(false);
    } catch (error) {
      setLoading(false);
      crashlytics().log('GetNotifications Api Notifications Screen');
      crashlytics().recordError(error);
    }
  };

  const renderUserListing = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={{
            height: 80,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme?.greyText,
          }}
          activeOpacity={1}
          onPress={() => {
            // setItemId(-1);
            // props?.navigation?.navigate('SubUserProfile', {
            //   item: item,
            // });
          }}>
          {item?.image != '' ? (
            // <ImageProgress
            //   // source={item?.image}
            //   imageSource={item?.image}
            //   imageStyles={{height: 50, width: 50, borderRadius: 50 / 2}}
            //   imageStyle={{borderRadius: 50 / 2, height: 50, width: 50}}
            //   resizeMode={'cover'}
            //   activityIndicatorSize={'small'}
            //   activityIndicatorColor={theme?.logoColor}
            // />
            <Image
              source={item?.image}
              style={{height: 50, width: 50, borderRadius: 50 / 2}}
            />
          ) : (
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 50 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: item?.backgroundColor,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.white,
                }}>
                {item?.firstName?.charAt(0)}
              </Text>
            </View>
          )}
          <View style={{width: '60%'}}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.black,
              }}>
              {item?.firstName} {item?.lastName}
            </Text>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}>
              {item?.email}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              // if (itemId == item?.id) {
              //   setItemId(-1);
              // } else {
              //   setItemId(item?.id);
              // }
              props?.navigation?.navigate('UpdateSubUser', {
                from: 'Edit',
                item: item,
              });
            }}
            style={{
              backgroundColor: theme?.logoColor,
              height: 34,
              width: 56,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.white,
              }}>
              Edit
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {/* {itemId == item?.id && (
          <ImageBackground
            source={require('@/assets/images/background/Popup.png')}
            style={{
              height: 80,
              width: 130,
              position: 'absolute',
              alignSelf: 'flex-end',
              top: 20,
              right: 70,
              zIndex: 999,
              justifyContent: 'space-around',
              borderRadius: 10,
            }}
            imageStyle={{
              height: 80,
              width: 130,
            }}
            resizeMode="contain">
            <View
              style={{
                zIndex: 999,
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme?.white,
                  padding: 5,
                }}
                onPress={() => {
                  setItemId(-1);
                  props?.navigation?.navigate('UpdateSubUser', {
                    from: 'Edit',
                    item: item,
                  });
                }}>
                <Text
                  allowFontScaling={false}

                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.white,
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  padding: 5,
                }}
                onPress={() => {
                  setItemId(-1);
                  setShow(true);
                }}>
                <Text
                  allowFontScaling={false}

                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.white,
                  }}>
                  Disable
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )} */}
      </>
    );
  };
  return (
    <>
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
        heading={'USER MANAGMEnt'}
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
          if (props?.route?.params?.from == 'More') {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          } else {
            props.navigation.goBack();
          }
        }}
        onNotificationPress={() => {
          props?.navigation?.navigate('Notification');
        }}
        notificationIcon={false}
      />
      {loading ? (
        <UserListingSkeleton />
      ) : (
        <>
          {userList?.length > 0 ? (
            <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
              <FlatList
                data={userList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderUserListing}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: theme?.logoColor,
                  height: 50,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  flexDirection: 'row',
                }}
                activeOpacity={1}
                onPress={() => {
                  props?.navigation?.navigate('UpdateSubUser');
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 16,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.white,
                    }}>
                    Add New User
                  </Text>
                  <Image
                    source={require('@/assets/images/icons/plus_icon.png')}
                    style={{height: 12, width: 12, marginLeft: 5}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: screenHeight * 0.7,

                width: screenWidth * 0.99,
                alignSelf: 'center',
              }}>
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
                No user at the moment.
              </Text>
            </View>
          )}
        </>
      )}
      <ConfirmationPopup
        show={show}
        onClose={() => {
          setShow(false);
        }}
        confirmationHeading={'Are you sure you want to disable this user?'}
        confirmationText={'The user can no longer manage the properties'}
        onTouchOutside={() => {
          setShow(false);
        }}
        onPressNo={() => {
          setShow(false);
        }}
        onPressYes={() => {
          setShow(false);
        }}
      />
      {loadingMark && <Loader />}
    </>
  );
};
export default UserListing;
