import {View, Text, Dimensions} from 'react-native';
import React, {useRef, useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Headers} from '@/components/header/headers';
import {SubmitButton} from '@/components/buttons/submitButton';
import {WebView} from 'react-native-webview';
import PaymentSkeleton from '@/components/skeletons/payment';
import axios from 'axios';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const PaymentScreen = props => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef();
  const [state, setState] = useState(false);
  const [message, setMessage] = useState({
    title: '',
    text: '',
  });
  const handleWebViewNavigationStateChange = state => {
    // console.log('state?.url',state?.url)
    // if (state?.url?.includes('success=false')) {
    //   setState(true);
    //   setMessage({
    //     title: 'Payment declined',
    //     text: 'Unfortunately your transaction has been declined!',
    //   });
    // } else if (state?.url?.includes('success=true')) {
    //   setState(true);
    // }
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
        heading={'Payment'}
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
          if (state == true) {
            // if (props?.route?.params?.from == 'paymentPlan') {
            //   props?.navigation?.goBack();
            // } else {
              props?.navigation?.reset({
                index: 0,
                routes: [{name: 'CDashboard'}],
              });
            // }
          } else {
            props?.navigation?.goBack();
          }
        }}
        onNotificationPress={() => {
          props?.navigation?.navigate('Notification');
        }}
        notificationIcon={false}
      />
      {loading && <PaymentSkeleton />}
      {state && (
        <View
          style={{
            // justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            position: 'absolute',
            backgroundColor: theme?.white,
            zIndex: 1,
            bottom: 0,
            height: screenHeight * 0.9,
            top: 100,
            width: screenWidth,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme?.white,
              height: '90%',
              width: screenWidth,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 26,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.logoColor,
              }}>
              {message?.title}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                width: '65%',
                textAlign: 'center',
                marginTop: 10,
              }}>
              {message?.text}
            </Text>
            <SubmitButton
              btnContainer={{
                height: 50,
                width: '90%',
                backgroundColor: theme?.logoColor,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 25,
              }}
              btnText="Goto Dashboard"
              btnTextStyle={{
                color: theme?.white,
                fontSize: 14,
                fontWeight: '700',
              }}
              onPress={() => {
                if (state == true) {
                  // if (props?.route?.params?.from == 'paymentPlan') {
                  //   props?.navigation?.goBack();
                  // } else {
                  props?.navigation?.reset({
                    index: 0,
                    routes: [{name: 'CDashboard'}],
                  });
                  // }
                } else {
                  props?.navigation?.goBack();
                }
              }}
            />
          </View>
        </View>
      )}

      <WebView
        ref={webViewRef}
        onLoadEnd={() => {
          setLoading(false);
        }}
        originWhitelist={['*']}
        source={{uri: props?.route?.params?.url}}
        domStorageEnabled
        javaScriptEnabled
        allowUniversalAccessFromFileURLs
        onError={e => {
          console.log('Webview Error', e);
          setState(true);
          setMessage({
            title: 'Oops! Connection Lost.',
            text: `It looks like your internet connection is down. Please check your connection and try again.`,
          });
        }}
        injectedJavaScript={
          `
        (function() {
          const preText = document.querySelector('pre').innerText;
          window.ReactNativeWebView.postMessage(preText);
        })();
        `
          //  `  (function() {
          //     var html = document.documentElement.innerHTML;
          //     window.ReactNativeWebView.postMessage(html);
          //   })();`
        }
        mixedContentMode="always"
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onMessage={event => {
          const message = event?.nativeEvent.data;
          console.log('xdfcghvbjnm,', message);
          if (message != undefined) {
            let text = JSON.parse(message);
            setState(true);
            setMessage({
              title: text?.title,
              text: text?.message,
            });
          }
          return;
          const referenceNumberRegex = /No is : (\d+)/;
          const match = message.match(referenceNumberRegex);
          if (match && match.length > 1) {
            setMessage({
              title: 'Thank you for the Payment',
              text: `Your transaction is being processed with refrence no: ${match[1]}, We will notify once updated.`,
            });
          }
        }}
      />
    </View>
  );
};

export default PaymentScreen;
