import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  LogBox,
  I18nManager,
  AppState,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import applyConfigSettings from './config/index';
import DataHandler from './services/mainServices/dataHandler.service';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import configureStore from './redux/Store';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import Video from 'react-native-video';
import MainNavigator from './routes/app/MainNavigator';
import crashlytics from '@react-native-firebase/crashlytics';
import theme from './assets/stylesheet/theme';
import {FONT_FAMILY} from './constants/fontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';

let screenWidth = Math.round(Dimensions.get('window').width);

const {store, persistor} = configureStore();
DataHandler.setStore(store);

applyConfigSettings();

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message

LogBox.ignoreAllLogs(); //Ignore all log notifications

const Main = props => {
  const refVideo = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isMounted, setIsMounted] = useState(true);
  const [gap, setGap] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setGap(false);
    }, 3000);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
    // Enable on runtime
    crashlytics().setCrashlyticsCollectionEnabled(false);
  }, []);
  if (isLoading) {
    return (
      <View style={{width: screenWidth, height: '100%'}}>
       {gap == false && <TouchableOpacity
          style={{
            position: 'absolute',
            zIndex: 1,
            right: 20,
            top: 40,
            // backgroundColor: theme?.logoColor,
            padding: 5,
            borderRadius: 5,
          }}
          activeOpacity={1}
          onPress={() => {
            setIsLoading(false)
          }}>
          <Text
          allowFontScaling={false}
            style={{
              color: theme?.white,
              fontSize: 14,
              fontFamily: FONT_FAMILY?.IBMPlexBold,
            }}>
            Skip Intro
          </Text>
        </TouchableOpacity>}
        <Video
          ref={refVideo}
          source={require('./assets/splashVideo/splash.mp4')} // Can be a URL or a local file.
          resizeMode={'cover'}
          onBuffer={() => {}}
          playInBackground={true}
          onError={() => {}} // Callback when video cannot be loaded
          style={{
            width: screenWidth,
            height: '100%',
          }}
        />
      </View>
    );
  } else {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={{flex: 1}}>
            <InternetConnectionAlert
              onChange={connectionState => {
                console.log('Internet connection state',connectionState);
              }}>
              <MainNavigator />
            </InternetConnectionAlert>
          </View>
        </PersistGate>
      </Provider>
    );
  }
};

export default Main;
