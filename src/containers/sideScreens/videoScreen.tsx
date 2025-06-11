import {
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {CircleBackButton} from '@/components/buttons/circleBackButton';
import {TabsButton} from '@/components/formsTab';
import {useSelector} from 'react-redux';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

export default function VideoScreen(props) {
  const url = props?.route?.params?.url;
  const projecName = props?.route?.params?.name;
  const userData = useSelector(state => state?.user?.userDetail);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(true);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {/* <StatusBar barStyle={'dark-content'} translucent={true}  /> */}
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
          <View
            style={{
              height: 100,
              backgroundColor: theme?.white,
              width: screenWidth,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              position: 'absolute',
              zIndex: 1,
            }}>
            <View
              style={{
                height: 100,
                alignItems: 'center',
                flexDirection: 'row',
                paddingTop: 30,
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  props?.navigation?.goBack();
                }}>
                <CircleBackButton
                  mainViewStyles={{
                    width: 50,
                  }}
                  internalViewStyles={{
                    backgroundColor: theme?.logoColor,
                  }}
                />
              </TouchableOpacity>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 22,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                  marginLeft: 5,
                  color: theme?.logoColor,
                }}>
                {projecName}
              </Text>
            </View>
          </View>
          <View
            style={{
              top: 100,
              height:
                userData?.role == 'geust'
                  ? screenHeight * 0.77
                  : screenHeight * 0.85,
            }}>
            <WebView
              source={{
                uri: url,
              }}
            />
          </View>

          {userData?.role == 'geust' && (
            <TabsButton
              mainViewStyling={{
                backgroundColor: theme?.white,
                alignSelf: 'center',
                width: screenWidth,
                position: 'absolute',
                bottom: -5,
                height: 100,
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingBottom: 20,
                paddingTop: 21,
                borderTopWidth: Platform.OS == 'ios' ? 0.2 : 0.3,
                borderTopColor: theme?.textGrey,
                paddingHorizontal: 10,
              }}
              enquiryPress={() => {
                props?.navigation?.navigate('Enquiry', {
                  data: {
                    lat: props?.route?.params?.lat,
                    lng: props?.route?.params?.lng,
                    unitType: '',
                    floorPlan: '',
                    projectTitle: props?.route?.params?.projectTitle,
                    id: props?.route?.params?.id,
                  },
                });
              }}
            />
          )}
        </>
      )}
    </>
  );
}
