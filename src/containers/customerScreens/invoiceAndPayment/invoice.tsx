import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import {WebView} from 'react-native-webview';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Headers} from '@/components/header/headers';
import {ImageProgress} from '@/components/ImageProgress';
import {SubmitButton} from '@/components/buttons/submitButton';
import PDFView from 'react-native-view-pdf';
import InvoiceDetailSkeleton from '@/components/skeletons/invoiceDetailSkeleton';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import {getProfilePicUrlApi} from '@/services/apiMethods/authApis';
import {useDispatch, useSelector} from 'react-redux';
import {setUserDetail} from '@/redux/actions/UserActions';
import {AxiosError} from 'axios';
import {DownloadButton} from '@/components/buttons/downloadButton';
let screenHeight = Math.round(Dimensions.get('window').height);
let screenWidth = Math.round(Dimensions.get('window').width);

export default function InvoiceViewer(props) {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const [url, setUrl] = useState('');
  const [serverError, setServerError] = useState(false);
  const userDatails = useSelector(state => state?.user?.userDetail);
  const [disableButton, setDisableButton] = useState(false);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    // getInvoiceUrl();
  }, []);
  const resources = {
    file:
      Platform.OS === 'ios'
        ? 'downloadedDocument.pdf'
        : '/sdcard/Download/downloadedDocument.pdf',
    url: props?.route?.params?.invoiceUrl,
    base64: 'JVBERi0xLjMKJcfs...',
  };
  const resourceType = 'url';
  const getInvoiceUrl = async () => {
    try {
      const pdfUrl = await getProfilePicUrlApi(
        props?.route?.params?.invoiceUrl,
        userDatails?.token?.access_token,
      );
      setUrl(pdfUrl);
      setLoader(false);
      setServerError(false);
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
        setServerError(false);
      } else if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setServerError(true);
      }
      setLoader(false);
      console.log('error,', error);
    }
  };
  function generateAlphanumericString(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  const downloadInvoice = async (source, name) => {
    let dirs = ReactNativeBlobUtil.fs.dirs;
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
      path: `${dirs.DocumentDir}/${name}_${generateAlphanumericString(10)}.pdf`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: `${name}_${generateAlphanumericString(10)}`,
        description: 'File downloaded by download manager.',
        mime: 'application/pdf',
        path: `${dirs.DownloadDir}/${name}_${generateAlphanumericString(
          10,
        )}.pdf`,
      },
    })
      .fetch('GET', source)
      .then(async res => {
        // const filePath = res.path();
        setDisableButton(false);
        if (Platform.OS === 'ios') {
          const filePath = res.path();
          let options = {
            type: 'application/pdf',
            url: filePath,
            // saveToFiles: true,
          };
          Share.open(options)
            .then(resp => console.log(resp))
            .catch(err => console.log(err));
        } else {
          const filePath = res.path();
          let options = {
            type: 'application/pdf',
            url: `file://${filePath}`,
            showAppsToView: true,

            failOnCancel: false,
            // saveToFiles: true,
          };
          Share.open(options)
            .then(resp => console.log(resp))
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.log('BLOB ERROR -> ', err);
        setDisableButton(false);
      });
  };
  // const downloadInvoice = async (source, name, project) => {
  //   // const pdfCheck = source?.includes('.pdf') ? '.pdf' : '';
  //   let dirs = ReactNativeBlobUtil.fs.dirs;
  //   ReactNativeBlobUtil.config({
  //     fileCache: true,
  //     appendExt: 'pdf',
  //     path: `${dirs.DocumentDir}/${project + ' ' + name}${pdfCheck}`,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       title: name,
  //       description: 'File downloaded by download manager.',
  //       mime: 'application/pdf',
  //       path: `${dirs.DownloadDir}/${project + ' ' + name}${pdfCheck}`,
  //     },
  //   })
  //     .fetch('GET', source)
  //     .then(async res => {
  //       // const filePath = res.path();
  //       if (Platform.OS === 'ios') {
  //         const filePath = res.path();
  //         let options = {
  //           type: 'application/pdf',
  //           url: filePath,
  //           // saveToFiles: true,
  //         };
  //         Share.open(options)
  //           .then(resp => console.log(resp))
  //           .catch(err => console.log(err));
  //       } else {
  //         const filePath = res.path();
  //         let options = {
  //           type: 'application/pdf',
  //           url: `file://${filePath}`,
  //           showAppsToView: true,

  //           failOnCancel: false,
  //           // saveToFiles: true,
  //         };
  //         Share.open(options)
  //           .then(resp => console.log(resp))
  //           .catch(err => console.log(err));
  //       }
  //     })
  //     .catch(err => console.log('BLOB ERROR -> ', err));
  // };
  return (
    <View
      style={{
        backgroundColor: theme?.white,
        flex: 1,
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
        heading={'Invoice'}
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
      {serverError ? (
        <View style={{justifyContent: 'space-between', flex: 0.95}}>
          <View
            style={{
              marginVertical: 20,
              paddingHorizontal: 20,
              height: '70%',
              // borderWidth: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
              }}>
              <Image
                source={require('@/assets/images/icons/smallAlert_Icon.png')}
                style={{
                  height: 60,
                  width: 60,
                  marginBottom: 30,
                  tintColor: theme?.brightRed,
                }}
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                  textAlign: 'center',
                }}>
                Unable to load invoice at the moment.
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={{justifyContent: 'space-between', flex: 0.95}}>
          {loader && <InvoiceDetailSkeleton />}
          <View
            style={{
              flex: 1,
              backgroundColor: theme?.white,
              alignItems: 'center',
              paddingTop: 10,
            }}>
            <PDFView
              fadeInDuration={150.0}
              style={{
                flex: 1,
                backgroundColor: theme?.white,
                width: screenWidth * 0.95,
              }}
              resource={resources[resourceType]}
              resourceType={resourceType}
              onLoad={() => {
                setLoader(false);
              }}
              onError={error => console.log('Cannot render PDF', error)}
            />
          </View>
          <DownloadButton
            btnContainer={{
              height: 50,
              width: '90%',
              backgroundColor: theme?.logoColor,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              alignSelf: 'center',
            }}
            btnText="Download"
            btnTextStyle={{
              color: theme?.white,
              fontSize: 14,
              fontWeight: '700',
            }}
            disabled={disableButton}
            onPress={() => {
              setDisableButton(true);
              downloadInvoice(
                props?.route?.params?.invoiceUrl,
                props?.route?.params?.name,
                '',
              );
            }}
          />
        </View>
      )}
    </View>
  );
}
