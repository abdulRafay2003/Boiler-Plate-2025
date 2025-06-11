import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Dimensions,
  ImageBackground,
  FlatList,
  Platform,
  StyleSheet,
  BackHandler,
} from 'react-native';
import Dialog, {DialogContent, SlideAnimation} from 'react-native-popup-dialog';
import {FONT_FAMILY} from '@/constants/fontFamily';
import theme from '@/assets/stylesheet/theme';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setUserDetail} from '@/redux/slice/UserSlice/userSlice';
import VersionCheck from 'react-native-version-check';
import {getProfilePicUrlApi} from '@/services/apiMethods/authApis';
import {ImageProgress} from '@/components/ImageProgress';
import { RootState } from '@/redux/store';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

interface Props {
  visible: boolean | null;
  onClose: any | null;
  onNavigate?: any | null;
  signIn?: any | null;
  signUp?: any | null;
  subUsers?: any | null;
  onPressProfile?: any | null;
}

const MoreModal = (props: Props) => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const [versionNum, setVersionNum] = useState(0);
  const userData = useSelector((state: RootState) => state?.user?.userDetail);

  const {
    visible,
    onClose,
    onNavigate,
    signIn,
    signUp,
    subUsers,
    onPressProfile,
  } = props;
  const items = [
    {title: 'About Us', parentStack: 'Menu', route: 'About'},
    {title: 'Blog', parentStack: 'Menu', route: 'BlogListing'},
    {title: 'Contact Us', parentStack: 'Menu', route: 'ContactUs'},
    {title: 'Notifications', parentStack: 'Menu', route: 'Notification'},
    // {title: 'Account', parentStack: 'Menu', route: 'DeleteAccount'},
    {title: 'Logout', parentStack: 'Dashboard', route: 'Home'},
  ];
  const guestRoute = [
    {title: 'About Us', parentStack: 'Menu', route: 'About'},
    {title: 'Blog', parentStack: 'Menu', route: 'BlogListing'},
    {title: 'Contact Us', parentStack: 'Menu', route: 'ContactUs'},
    {title: 'Notifications', parentStack: 'Menu', route: 'Notification'},
  ];
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      backHandler.remove();
    };
  }, []);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    checkVersion();
  }, []);

  const handleBackButtonClick = () => {
    onClose();
    return true;
  };

  const checkVersion = async () => {
    try {
      let currentVersion = await VersionCheck.getCurrentVersion();
      setVersionNum(currentVersion);
    } catch (error) {
      console.log('checkVersionerror', error);
    }
  };
  const renderItems = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme?.textGrey,
          height: userData?.role == 'guest' ? 86 : 66,
          justifyContent: 'center',
        }}
        activeOpacity={1}
        onPress={onNavigate?.bind(this, {item})}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 22,
            color: theme?.white,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
          }}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <Dialog
      visible={visible}
      coverScreen={true}
      dialogAnimation={
        new SlideAnimation({
          slideFrom: 'right',
        })
      }
      statusBarTranslucent={true}
      dialogStyle={{backgroundColor: theme?.transparent}}>
      <DialogContent>
        <View
          style={{
            height: screenHeight * 1.1,

            // height: Platform.OS == 'ios' ? screenHeight : screenHeight * 1.1,
            width: screenWidth,
          }}>
          <ImageBackground
            source={require('@/assets/images/background/more_bg.png')}
            style={{flex: 1, paddingHorizontal: 20}}
            resizeMode="cover">
            <View
              style={{top: 90, flex: userData?.role == 'guest' ? 0.93 : 0.93}}>
              <View
                style={
                  userData?.role == 'guest' || userData?.role == undefined
                    ? {
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'flex-end',
                      }
                    : {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                      }
                }>
                {(userData?.user?.type == 'customer' ||
                  userData?.user?.type == 'agent') && (
                  <TouchableOpacity
                    style={{
                      height: 60,
                      width: screenWidth * 0.8,
                      borderRadius: 60 / 2,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.9}
                    onPress={onPressProfile?.bind(this, userData)}>
                    {userData?.profileImage != null ? (
                      <Image
                        source={{
                          uri: `data:image/jpeg;base64,${userData?.profileImage}`,
                        }}
                        style={{height: 41, width: 41, borderRadius: 41 / 2}}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          height: 41,
                          width: 41,
                          borderRadius: 41 / 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: theme?.logoColor,
                        }}>
                        <Image
                          source={require('@/assets/images/icons/user.png')}
                          style={{
                            height: 20,
                            width: 20,
                            tintColor: theme?.logoColor,
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                    <View
                      style={{
                        left: 10,
                        width: screenWidth * 0.6,
                      }}>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 20,
                          left: 10,
                          fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          color: theme?.white,
                        }}>
                        {userData?.user?.first_name +
                          ' ' +
                          userData?.user?.last_name}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 15,
                          left: 10,
                          fontFamily: FONT_FAMILY?.IBMPlexRegular,
                          color: theme?.white,
                        }}>
                        View Profile
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: theme?.transparentWhite,
                    height: 47,
                    width: 47,
                    borderRadius: 47 / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // alignSelf: 'flex-end',
                  }}
                  activeOpacity={1}
                  onPress={() => {
                    onClose();
                  }}>
                  <Image
                    source={require('@/assets/images/icons/white_cross.png')}
                    style={{height: 10, width: 10}}
                  />
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 30, flex: 1}}>
                <View
                  style={{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: theme?.textGrey,
                    paddingBottom: 40,
                  }}>
                  {userData?.user?.type == 'guest' ||
                    (userData?.user?.type == undefined && (
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 30,
                          fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          color: theme?.white,
                        }}>
                        Nice to meet you
                      </Text>
                    ))}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: screenWidth * 0.6,
                      alignSelf: 'center',
                      marginTop: 20,
                      marginBottom: 20,
                    }}>
                    <TouchableOpacity
                      style={{
                        height: 80,
                        width: 80,
                      }}
                      onPress={signIn?.bind(
                        this,
                        userData?.user?.type == 'guest' ||
                          userData?.user?.type == undefined
                          ? 'signin'
                          : userData?.user?.type == 'customer'
                          ? 'portfolio'
                          : 'leads',
                      )}
                      activeOpacity={1}>
                      <View
                        style={{
                          height: 80,
                          width: 80,
                          borderRadius: 80 / 2,
                          backgroundColor: theme?.white,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={
                            userData?.user?.type == 'guest' ||
                            userData?.user?.type == undefined
                              ? require('@/assets/images/icons/user.png')
                              : require('@/assets/images/icons/leads.png')
                          }
                          style={{height: 36, width: 41}}
                          resizeMode="contain"
                        />
                      </View>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 17,
                          fontFamily: FONT_FAMILY?.IBMPlexRegular,
                          textAlign: 'center',
                          color: theme?.white,
                          top: 5,
                        }}>
                        {userData?.user?.type == 'guest' ||
                        userData?.user?.type == undefined
                          ? 'Sign in'
                          : userData?.user?.type == 'customer'
                          ? 'Portfolio'
                          : 'Leads'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        height: 80,
                        width: 80,
                      }}
                      activeOpacity={1}
                      onPress={signUp?.bind(
                        this,
                        userData?.user?.type == 'guest' ||
                          userData?.user?.type == undefined
                          ? 'signup'
                          : userData?.user?.type == 'customer'
                          ? 'financials'
                          : 'activities',
                      )}>
                      <View
                        style={{
                          height: 80,
                          width: 80,
                          borderRadius: 80 / 2,
                          backgroundColor: theme?.white,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={
                            userData?.user?.type == 'guest' ||
                            userData?.user?.type == undefined
                              ? require('@/assets/images/icons/register_user.png')
                              : userData?.user?.type == 'customer'
                              ? require('@/assets/images/icons/Financials.png')
                              : require('@/assets/images/icons/activitiesMore.png')
                          }
                          style={{height: 36, width: 41}}
                          resizeMode="contain"
                        />
                      </View>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 17,
                          fontFamily: FONT_FAMILY?.IBMPlexRegular,
                          textAlign: 'center',
                          color: theme?.white,
                          top: 5,
                        }}>
                        {userData?.user?.type == 'guest' ||
                        userData?.user?.type == undefined
                          ? 'Register'
                          : userData?.user?.type == 'customer'
                          ? 'Financials'
                          : 'Activities'}
                      </Text>
                    </TouchableOpacity>
                    {/* {userData?.role == 'customer' && (
                      <TouchableOpacity
                        style={{
                          height: 80,
                          width: 80,
                        }}
                        onPress={subUsers}
                        activeOpacity={1}>
                        <View
                          style={{
                            height: 80,
                            width: 80,
                            borderRadius: 80 / 2,
                            backgroundColor: theme?.white,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={
                              userData?.role == 'guest' ||
                              userData?.role == undefined
                                ? require('@/assets/images/icons/user.png')
                                : userData?.role == 'customer'
                                ? require('@/assets/images/icons/register_user.png')
                                : require('@/assets/images/icons/leads.png')
                            }
                            style={{height: 36, width: 41}}
                            resizeMode="contain"
                          />
                        </View>
                        <Text
                  allowFontScaling={false}

                          style={{
                            fontSize: 17,
                            fontFamily: FONT_FAMILY?.IBMPlexRegular,
                            textAlign: 'center',
                            color: theme?.white,
                            top: 5,
                          }}>
                          Sub Users
                        </Text>
                      </TouchableOpacity>
                    )} */}
                  </View>
                </View>
                <View style={{height: screenHeight * 0.51}}>
                  <FlatList
                    bounces={false}
                    contentContainerStyle={{
                      paddingBottom: 30,
                    }}
                    data={
                      userData?.user?.type == 'guest' ||
                      userData?.user?.type == undefined
                        ? guestRoute
                        : items
                    }
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItems}
                  />
                </View>
                <View
                  style={{
                    marginTop: 20,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.white,
                    }}>
                    v{versionNum}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </DialogContent>
    </Dialog>
  );
};
export default MoreModal;
