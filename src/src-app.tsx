import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  LogBox,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './redux/store';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import Video from 'react-native-video';
import MainNavigator from './routes/app/MainNavigator';
import crashlytics from '@react-native-firebase/crashlytics';
import {FONT_FAMILY} from './constants/fontFamily';
import CustomText from './components/CustomText';
import {Colors} from './config';

let screenWidth = Math.round(Dimensions.get('window').width);

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs(true); //Ignore all log notifications

const Main = props => {
  const refVideo = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
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
    crashlytics().setCrashlyticsCollectionEnabled(false); 
  }, []);

  if (isLoading) {
    return (
      <View style={styles.fullScreenStyle}>
        {gap == false && (
          <TouchableOpacity
            style={styles.skipIntroCOntainer}
            activeOpacity={1}
            onPress={() => setIsLoading(false)}>
            <CustomText.RegularText
              customStyle={{
                color: Colors.white,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
              }}>
              Skip Intro
            </CustomText.RegularText>
          </TouchableOpacity>
        )}
        <Video
          ref={refVideo}
          source={require('./assets/splashVideo/splash.mp4')}
          resizeMode={'cover'}
          onBuffer={() => {}}
          playInBackground={true}
          onError={() => {}}
          style={styles.fullScreenStyle}
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
                console.log('Internet connection state', connectionState);
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

const styles = StyleSheet.create({
  fullScreenStyle: {width: screenWidth, height: '100%'},
  skipIntroCOntainer: {
    position: 'absolute',
    zIndex: 1,
    right: 20,
    top: 40,
    padding: 5,
    borderRadius: 5,
  },
});
