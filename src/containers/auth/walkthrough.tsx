import React, {useEffect, useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Image,
  Dimensions,
  Platform,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {setOnBoardingComplete} from '@/redux/actions/UserActions';
import styles from '@/assets/stylesheet/walkthrough.styles';
import PushNotification from 'react-native-push-notification';
import FastImage from 'react-native-fast-image';
import {FONT_FAMILY} from '@/constants/fontFamily';

let screenWidth = Math.round(Dimensions.get('window').width);

export default function Walkthrough(props) {
  const dispatch = useDispatch();
  const slides = useSelector(state => state?.user?.walkThroughImages);
  const apiStatus = useSelector(state => state?.user?.skipIntro);
  const [loading, setLoading] = useState(true);

  var count = 0;
  useEffect(() => {
    PushNotification.setApplicationIconBadgeNumber(0);
    PushNotification.removeAllDeliveredNotifications();
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(theme?.logoColor);
    }
  }, []);

  const onDone = async () => {
    dispatch(setOnBoardingComplete(true));
    await AsyncStorage?.setItem('viewedOnboarding', '1');
    props.navigation.reset({
      index: 0,
      routes: [{name: 'Dashboard'}],
    });
  };
  const renderItem = ({item}) => {
    return (
      <FastImage
        source={{uri: item?.image, priority: FastImage.priority.high}}
        style={styles?.renderItemImageBGStyles}
        resizeMode={FastImage.resizeMode.cover} // Adjust the resizeMode as needed
        onLoadStart={() => {}}
        onLoadEnd={() => {
          count = count + 1;
          if (count >= 2) {
            setLoading(false);
          }
        }}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0)',
            'rgba(0, 0, 0, 0)',
            'rgba(0, 0, 0, 0.7)',
          ]}
          style={styles?.linearGradientaStyles}>
          <Image
            source={require('@/assets/images/icons/logo.png')}
            style={styles?.logoStyles}
          />
          {loading && (
            <ActivityIndicator size={'large'} color={theme?.logoColor} />
          )}
          <View style={styles?.rennterItemTitleView}>
            <Text
              allowFontScaling={false}
              style={styles?.renderItemTitleStyles}>
              {item?.title}
            </Text>

            <Text allowFontScaling={false} style={styles?.renderItemTextStyles}>
              {item?.text}
            </Text>
          </View>
        </LinearGradient>
      </FastImage>
    );
  };
  return (
    <>
      {slides?.length <= 0 ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: screenWidth * 0.99,
            alignSelf: 'center',
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.textGrey,
            }}>
            {apiStatus ? 'Unable to load data at the moment.' : ''}
          </Text>
        </View>
      ) : (
        <AppIntroSlider
          decelerationRate={Platform.OS == 'ios' ? 0.9 : 0}
          scrollEnabled={true}
          data={slides}
          renderItem={renderItem}
          renderNextButton={() => {
            return (
              <View style={styles?.renderNextButtonViewStyles}>
                <Image
                  source={require('@/assets/images/icons/arrow.png')}
                  style={styles?.renderArrowIconStyles}
                  resizeMode="contain"
                />
              </View>
            );
          }}
          renderSkipButton={() => {
            return (
              <TouchableOpacity
                style={styles?.skipButtonTO}
                onPress={() => {
                  onDone();
                }}>
                <Text
                  allowFontScaling={false}
                  style={styles?.skipButtonTextStyles}>
                  Skip
                </Text>
              </TouchableOpacity>
            );
          }}
          renderDoneButton={() => {
            return (
              <View style={styles?.doneButtonViewStyles}>
                <Image
                  source={require('@/assets/images/icons/arrow.png')}
                  style={styles?.renderArrowIconStyles}
                  resizeMode="contain"
                />
              </View>
            );
          }}
          showSkipButton={true}
          activeDotStyle={{
            width: (screenWidth * 0.35) / slides?.length,
            height: 3,
            borderRadius: 10,
            borderColor: theme.white,
            backgroundColor: theme.white,
          }}
          dotStyle={{
            width: (screenWidth * 0.35) / slides?.length,
            height: 3,
            borderRadius: 10,
            backgroundColor: theme.greyColor,
          }}
          onDone={() => {
            onDone();
          }}
        />
      )}
      {/* {loading && <Loader />} */}
    </>
  );
}
