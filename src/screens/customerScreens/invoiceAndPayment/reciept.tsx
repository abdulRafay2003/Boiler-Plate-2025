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
import {setUserDetail} from '@/redux/slice/UserSlice/userSlice';
import {AxiosError} from 'axios';
import {DownloadButton} from '@/components/buttons/downloadButton';
import { RootState } from '@/redux/store';
let screenHeight = Math.round(Dimensions.get('window').height);
let screenWidth = Math.round(Dimensions.get('window').width);

export default function RecieptViewer(props) {
  const [loader, setLoader] = useState(true);
  const [url, setUrl] = useState('');
  const [serverError, setServerError] = useState(false);
  const userDatails = useSelector((state: RootState) => state?.user?.userDetail);
  const [disableButton, setDisableButton] = useState(false);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);
  const resources = {
    file:
      Platform.OS === 'ios'
        ? 'downloadedDocument.pdf'
        : '/sdcard/Download/downloadedDocument.pdf',
    url: props?.route?.params?.paymentRecieptUrl,
    base64: 'JVBERi0xLjMKJcfs...',
  };
  const resourceType = 'url';
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
        setDisableButton(false);

        // const filePath = res.path();
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
        heading={'Reciept'}
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
      <View style={{justifyContent: 'space-between', flex: 0.95}}>
        {loader && <InvoiceDetailSkeleton />}
        <View
          style={{
            flex: 1,
            backgroundColor: theme?.white,
            alignItems: 'center',
            paddingTop: 10,
          }}>
          {serverError ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.textGrey,
                }}>
                Unable to load reciept at the moment.
              </Text>
            </View>
          ) : (
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
                setServerError(false);
              }}
              onError={error => {
                setLoader(false);
                setServerError(true);
                console.log('Cannot render PDF', error);
              }}
            />
          )}
        </View>

        {/* <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderTopWidth: 30,
          borderTopColor: theme?.bottomTab,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomWidth: 30,
          borderBottomColor: theme?.bottomTab,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          width: screenWidth * 0.9,
          alignSelf: 'center',
          marginTop: 30,
        }}>
          
       
      </View> */}
        {!serverError && (
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
              // console.log('======>', props?.route?.params?.name);
              downloadInvoice(
                props?.route?.params?.paymentRecieptUrl,
                props?.route?.params?.name,
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
