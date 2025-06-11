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
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {useIsFocused} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import UserListingSkeleton from '@/components/skeletons/userListingSkeleton';
import {ImageProgress} from '@/components/ImageProgress';
import UserProfileSkeleton from '@/components/skeletons/userProfileSkeleton';
import {SubmitButton} from '@/components/buttons/submitButton';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  cancelAccountDeletionApi,
  getAccountStatusApi,
  getProfilePicUrlApi,
  getUserProfileApi,
  updateProfilePicApi,
} from '@/services/apiMethods/authApis';
import {uploadImageApi} from '@/services/apiMethods/uploadImage';
import {setLoader, setUserDetail} from '@/redux/actions/UserActions';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import LoaderNew from '@/components/loaderNew';
import ReactNativeBlobUtil from 'react-native-blob-util';
import axios, {AxiosError} from 'axios';
import {AttachmentPopup} from '@/components/modal/attachmentPopup';
import {PickerPopup} from '@/components/modal/pickerPopup';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {BASE_URL_GJ} from '@/services/mainServices/config';
import * as Progress from 'react-native-progress';
import {ImageViewerPopup} from '@/components/modal/imageViewer';
import {ImageViewerEditProfile} from '@/components/modal/imageViewerEditProfile';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const UserProfile = props => {
  const isLoadingRedux = useSelector(state => state?.user?.loading);
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadingMark, setLoadingMark] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showThankyou, setShowThankyou] = useState(false);
  const [userData, setUserData] = useState({});
  const [showSelectAttachment, setShowSelectAttachment] = useState(false);
  const [updated, setUpdated] = useState(false);
  const userDatails = useSelector(state => state?.user?.userDetail);
  const [progress, setProgress] = useState(100);
  const [selectedImage, setSelectedImage] = useState('');
  const [showViewer, setShowViewer] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [thanksText, setThanksText] = useState('');
  const [apiResponnseErrors, setApiResponseMessageView] = useState('');
  useEffect(() => {
    dispatch(setLoader(false));
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    if (props?.route?.params?.from == 'notification') {
      getUserProfile();
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    requestPermission();
    getAccountStatus();
  }, [focused]);
  const requestPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
      }
    } catch (error) {}
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
        const granted = await PermissionsAndroid.request(permission);

        switch (granted) {
          case PermissionsAndroid.RESULTS.GRANTED:
            openCamera();
            break;
          case PermissionsAndroid.RESULTS.DENIED:
            Alert.alert(
              'GJ Properties',
              'Permission required you to allow camera for map user profile.',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
                {
                  text: 'Cancel',
                  onPress: () => {},
                },
              ],
            );
            break;
          case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
            Alert.alert(
              'GJ Properties',
              'Permission required you to allow camera for map user profile.',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
                {
                  text: 'Cancel',
                  onPress: () => {},
                },
              ],
            );
            break;
          default:
        }
      } else {
        const result = await check(PERMISSIONS.IOS.CAMERA);
        if (result == 'granted') {
          openCamera();
        } else if (result == 'unavailable') {
          openCamera();
        } else {
          Alert.alert(
            'GJ Properties',
            'Permission required you to allow camera for map user profile.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  Linking.openURL('app-settings:');
                },
              },
              {
                text: 'Cancel',
                onPress: () => {},
              },
            ],
          );
        }
      }
    } catch (error) {
      // console.error('Error requesting camera permission:', error);
    }
  };
  const requestGalleryPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        const granted = await PermissionsAndroid.request(permission);

        switch (granted) {
          case PermissionsAndroid.RESULTS.GRANTED:
            openGallery();
            break;
          case PermissionsAndroid.RESULTS.DENIED:
            Alert.alert(
              'GJ Properties',
              'Permission required you to allow camera for map user profile.',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
                {
                  text: 'Cancel',
                  onPress: () => {},
                },
              ],
            );
            break;
          case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
            Alert.alert(
              'GJ Properties',
              'Permission required you to allow camera for map user profile.',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
                {
                  text: 'Cancel',
                  onPress: () => {},
                },
              ],
            );
            break;
          default:
        }
      } else {
        const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (result == 'granted') {
          openGallery();
        } else {
          Alert.alert(
            'GJ Properties',
            'Permission required you to allow media for map user profile.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  Linking.openURL('app-settings:');
                },
              },
              {
                text: 'Cancel',
                onPress: () => {},
              },
            ],
          );
        }
      }
    } catch (error) {
      // console.error('Error requesting camera permission:', error);
    }
  };
  const openGallery = () => {
    try {
      ImagePicker.openPicker({
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      })
        .then(images => {
          setSelectedProfile(images);
          setUpdated(true);
        })
        .catch(err => {
          console.log('errerrerrerr', err);
          if (
            err?.message?.toString() == 'User did not grant library permission.'
          ) {
            requestGalleryPermission();
          }
        });
    } catch (error) {
      console.log('error,', error);
    }
  };
  const openCamera = () => {
    try {
      ImagePicker.openCamera({
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      })
        .then(images => {
          setSelectedProfile({...images, sourceURL: images?.path});
          setUpdated(true);
        })
        .catch(err => {
          if (
            err?.message?.toString() == 'User did not grant camera permission.'
          ) {
            requestCameraPermission();
          } else if (
            err?.message?.toString() == 'User did not grant library permission.'
          ) {
            const result = PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            if (result == 'never_ask_again') {
              Alert.alert(
                'GJ Properties',
                'Storage Permission required you to allow camera for map user profile.',
                [
                  {
                    text: 'Ok',
                    onPress: () => {
                      Linking.openSettings();
                    },
                  },
                  {
                    text: 'Cancel',
                    onPress: () => {},
                  },
                ],
              );
            } else if (result == 'granted') {
              openCamera();
            }
          } else {
            setShowSelectAttachment(false);
          }
        });
    } catch (error) {
      console.log('error,', error.toString());
    }
  };
  const handleUpdate = async () => {
    try {
      setProgress(0);
      dispatch(setLoader(true));
      let body = new FormData();
      body.append('file', {
        uri: selectedProfile?.path,
        type: selectedProfile?.mime,
        name:
          Platform.OS == 'android'
            ? 'file:///' + selectedProfile?.path.split('file:/').join('')
            : selectedProfile?.filename != undefined
            ? selectedProfile?.filename
            : 'cameraPic.jpg',
      });
      const upload = await axios.post(`${BASE_URL_GJ}/file/image`, body, {
        headers: {
          'Content-Type': 'multipart/form-data;',
          Authorization: 'Bearer ' + userDatails?.token?.access_token,
        },
        onUploadProgress: progressEvent => {
          const {loaded, total} = progressEvent;
          const progressPercent = Math.round((loaded / total) * 100);
          setProgress(progressPercent);
        },
      });
      if (upload?.status == 201) {
        updateProfile(upload?.data?.data?.name);
      }
    } catch (error) {
      dispatch(setLoader(false));
      const err = error as AxiosError;
      if (err?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      setApiResponseMessageView(error?.toString());
    }
  };
  const updateProfile = async name => {
    try {
      let body = {
        profileImage: name,
      };
      const update = await updateProfilePicApi(body);
      if (update) {
        setThanksText(`Profile picture updated.`);
        setLoading(false);
        dispatch(setLoader(false));
        setShowThankyou(true);
        setUpdated(false);
        getProfileUrl(update);
      }
    } catch (err) {
      dispatch(setLoader(false));
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      console.log('error,', error);
    }
  };
  const getProfileUrl = async data => {
    try {
      const profileImage = await getProfilePicUrlApi(
        data?.profileImage,
        userDatails?.token?.access_token,
      );
      if (profileImage) {
        const response = await ReactNativeBlobUtil.config({
          fileCache: true,
        }).fetch('GET', profileImage);
        const base64Data = await response.base64();
        setSelectedProfile(null);
        dispatch(
          setUserDetail({
            ...userDatails,
            profileImage: base64Data,
          }),
        );
      }
    } catch (err) {
      dispatch(setLoader(false));
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      console.log('error,', error);
    }
  };
  const getUserProfile = async () => {
    try {
      const userProfile = await getUserProfileApi();
      if (
        userProfile?.email != userDatails?.user?.email ||
        userProfile?.first_name != userDatails?.user?.first_name ||
        userProfile?.last_name != userDatails?.user?.last_name ||
        userProfile?.phone != userDatails?.user?.phone
      ) {
        dispatch(
          setUserDetail({
            ...userProfile,
            profileImage: userDatails?.profileImage,
          }),
        );
      } else {
        dispatch(
          setUserDetail({
            ...userDatails,
            profileImage: userDatails?.profileImage,
          }),
        );
      }

      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      console?.log('errorerrorerror', error);

      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      setLoading(false);
      dispatch(
        setUserDetail({
          ...userDatails,
          profileImage: null,
        }),
      );
    }
  };
  const getAccountStatus = async () => {
    try {
      const status = await getAccountStatusApi();
      setAccountStatus(status);
    } catch (error) {}
  };
  const cancelAccountDeletionRequest = async () => {
    try {
      dispatch(setLoader(true));
      const cancelRequest = await cancelAccountDeletionApi();
      if (cancelRequest?.statusCode == 200) {
        setThanksText(cancelRequest?.message);
        setAccountStatus(null);
        setTimeout(() => {
          dispatch(setLoader(false));
          setShowThankyou(true);
        }, 500);
      } else {
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log('cancelRequestcancelRequesterror', error);
      dispatch(setLoader(false));
      setShowThankyou(false);
      setThanksText('');
    }
  };
  return (
    <View
      style={{
        height: screenHeight,
        width: screenWidth,
        backgroundColor: theme?.white,
      }}>
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
        heading={'profile'}
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
        <UserProfileSkeleton />
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 40,
            alignItems: 'center',
          }}>
          <View>
            {selectedProfile != null ? (
              <>
                {progress < 100 ? (
                  <Progress.Circle
                    size={110}
                    // indeterminate={true}
                    progress={progress}
                    color={theme?.logoColor}
                    style={{justifyContent: 'center', alignItems: 'center'}}
                    showsText={true}
                  />
                ) : (
                  <Image
                    source={
                      Platform?.OS == 'ios'
                        ? {uri: selectedProfile?.sourceURL}
                        : {uri: selectedProfile?.path}
                    }
                    style={{height: 110, width: 110, borderRadius: 110 / 2}}
                    resizeMode="cover"
                  />
                )}
              </>
            ) : userDatails?.profileImage != null ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setShowViewer(true);
                  setSelectedImage(
                    `data:image/jpeg;base64,${userDatails?.profileImage}`,
                  );
                }}>
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${userDatails?.profileImage}`,
                  }}
                  style={{height: 110, width: 110, borderRadius: 110 / 2}}
                  resizeMode="cover"
                />

                {/* <ImageProgress
                  source={userDatails?.profileImage}
                  imageStyles={{height: 110, width: 110, borderRadius: 110 / 2}}
                  imageStyle={{borderRadius: 110 / 2, height: 110, width: 110}}
                  resizeMode={'cover'}
                  activityIndicatorSize={'small'}
                  activityIndicatorColor={theme?.logoColor}
                /> */}
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  height: 110,
                  width: 110,
                  borderRadius: 110 / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme?.logoColor,
                }}>
                <Image
                  source={require('@/assets/images/icons/user.png')}
                  style={{height: 45, width: 45, tintColor: theme?.logoColor}}
                  resizeMode="contain"
                />
              </View>
            )}
            <SubmitButton
              btnContainer={{
                height: 40,
                width: 100,
                backgroundColor: theme?.logoColor,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                alignSelf: 'center',
              }}
              btnText={updated == false ? 'Edit Picture' : 'Save'}
              btnTextStyle={{
                color: theme?.white,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}
              onPress={() => {
                if (updated == false) {
                  setShowSelectAttachment(true);
                } else {
                  handleUpdate();
                }
              }}
            />
          </View>
          <View>
            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme?.greyText,
                width: screenWidth * 0.9,
                paddingVertical: 20,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                  marginBottom: 2,
                }}>
                Full Name
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.black,
                }}>
                {userDatails?.user?.first_name +
                  ' ' +
                  userDatails?.user?.last_name}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme?.greyText,
                width: screenWidth * 0.9,
                paddingVertical: 20,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                  marginBottom: 2,
                }}>
                Email Address
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.black,
                }}>
                {userDatails?.user?.email}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme?.greyText,
                width: screenWidth * 0.9,
                paddingVertical: 20,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                  marginBottom: 2,
                }}>
                Mobile Number
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.black,
                }}>
                {userDatails?.user?.phone}
              </Text>
            </View>
          </View>
          <SubmitButton
            btnContainer={{
              height: 46,
              width: screenWidth * 0.9,
              backgroundColor: theme?.logoColor,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              alignSelf: 'center',
            }}
            btnText={
              accountStatus == null ? 'Delete Account' : 'Cancel Delete Account'
            }
            btnTextStyle={{
              color: theme?.white,
              fontSize: 14,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}
            onPress={() => {
              if (accountStatus == null) {
                props?.navigation?.navigate('DeleteAccount');
              } else {
                cancelAccountDeletionRequest();
              }
            }}
          />
        </View>
      )}
      <ImageViewerEditProfile
        show={showViewer}
        source={selectedImage}
        onClose={() => {
          setShowViewer(false);
          setSelectedImage('');
        }}
        onTouchOutside={() => {
          setShowViewer(false);
          setSelectedImage('');
        }}
      />
      <ThankYouPopup
        onTouchOutside={() => {
          setShowThankyou(false);
        }}
        onClose={() => {
          setShowThankyou(false);
        }}
        show={showThankyou}
        thankyouText={thanksText}
      />
      {<LoaderNew visible={isLoadingRedux} color={theme?.logoColor} />}
      <PickerPopup
        onTouchOutside={() => {
          setShowSelectAttachment(false);
        }}
        onClose={() => {
          setShowSelectAttachment(false);
        }}
        show={showSelectAttachment}
        clickPhoto={() => {
          setShowSelectAttachment(false);
          openGallery();
        }}
        clickDoc={() => {
          setShowSelectAttachment(false);
          openCamera();
        }}
      />
      <AlertPopupAuth
        show={apiResponnseErrors?.length > 0 ? true : false}
        onClose={() => {
          setApiResponseMessageView('');
        }}
        alertText={apiResponnseErrors}
        onTouchOutside={() => {
          setApiResponseMessageView('');
        }}
      />
    </View>
  );
};
export default UserProfile;
