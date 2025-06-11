import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import theme from '@/assets/stylesheet/theme';
let screenHeight = Math.round(Dimensions.get('window').height);

export default function WebViews(props) {
  const url = props?.route?.params?.url;
  const projecName = props?.route?.params?.name;
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <StatusBar barStyle={'dark-content'} translucent={true} />

      {loading ? (
        <View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={theme?.logoColor} />
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={{
              height: 195,
              backgroundColor: theme?.logoColor,
              width: 27,
              position: 'absolute',
              zIndex: 1,
              top: screenHeight * 0.38,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}
            onPress={() => {
              props?.navigation?.goBack();
            }}>
            <TouchableOpacity
              onPress={() => {
                props?.navigation?.goBack();
              }}>
              <Image
                style={{
                  width: 16,
                  height: 20,
                  tintColor: theme.white,
                  transform: [{rotate: '180deg'}],
                }}
                source={require('@/assets/images/icons/arrow.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <WebView
            source={{uri: url}}
            style={{top: 0, height: '100%'}}
            onTouchStart={() => {
              setHeaderVisible(!headerVisible);
            }}
          />
        </>
      )}
    </>
  );
}
