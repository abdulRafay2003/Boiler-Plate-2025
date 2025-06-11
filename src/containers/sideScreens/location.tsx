import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import MapView, {Marker} from 'react-native-maps';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {TabsButton} from '@/components/formsTab';
import openMap from 'react-native-open-maps';
import LocationSkeleton from '@/components/skeletons/location';
import {MapPopup} from '@/components/modal/mapPopup';
import {project} from 'react-native.config';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const Location = props => {
  const _map = useRef(null);
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [data, setData] = useState(props?.route?.params?.data);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(true);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const gotoMaps = () => {
    if (Platform.OS == 'ios') {
      setShowMapPopup(true);
    } else {
      Linking.canOpenURL('comgooglemaps://?ll=40.765819,-73.975866').then(
        canOpen => {
          if (canOpen) {
            openMap({
              latitude: data?.lat,
              longitude: data?.lng,
              provider: 'google',
              start: '',
              end: `${data?.address}`,
              travelType: 'drive',
              waypoints: [''],
            });
          } else {
            console.log(
              'Go To Maps',
              data,
              `https://www.google.com/maps/dir/?api=1&destination=${data?.lat},${data?.lng}`,
            );
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${data?.lat},${data?.lng}`,
              // &destination_place_id=${data?.projectName}`,
            );
            // Linking.openURL(
            //   `https://www.google.com/maps/dir//${data?.projectName}/@${data?.lat},${data?.lng},13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3e5f59d6efae41b9:0xa36911cec7d7f38!2m2!1d55.4540809!2d25.3969663?entry=ttu`,
            // );
          }
        },
      );
    }
  };

  const onPressGoogleMap = () => {
    Linking.canOpenURL('comgooglemaps://?ll=40.765819,-73.975866').then(
      canOpen => {
        if (canOpen) {
          openMap({
            latitude: data?.lat,
            longitude: data?.lng,
            provider: 'google',
            start: '',
            end: `${data?.address}`,
            travelType: 'drive',
            waypoints: [''],
          });
        } else {
          console.log(
            'On Press Google Ma',
            data,
            `https://www.google.com/maps/dir/?api=1&destination=${data?.lat},${data?.lng}`,
          );
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${data?.lat},${data?.lng}`,
            // &destination_place_id=${data?.projectName}`,
          );
          // Linking.openURL(
          //   `https://www.google.com/maps/dir//${data?.projectName}/@${data?.lat},${data?.lng},13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3e5f59d6efae41b9:0xa36911cec7d7f38!2m2!1d55.4540809!2d25.3969663?entry=ttu`,
          // );
        }
      },
    );
  };
  const onPressAppleMap = () => {
    Linking.openURL(`maps://0,0?q=${data?.address}${data?.lat},${data?.lng}`);
  };
  return (
    <>
      <View style={{backgroundColor: theme?.white, paddingBottom: 100}}>
        {/* <StatusBar barStyle={'light-content'} translucent={true}  /> */}
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
          heading={'LOCATION'}
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
            props.navigation.goBack();
          }}
          onNotificationPress={() => {
            props?.navigation?.navigate('Notification');
          }}
          notificationIcon={false}
        />
        {loading ? (
          <LocationSkeleton />
        ) : (
          <ScrollView
            contentContainerStyle={{paddingBottom: 50}}
            style={{paddingHorizontal: 20, marginBottom: 50}}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <Text
              allowFontScaling={false}
              style={{
                marginVertical: 20,
                fontSize: 20,
                color: theme?.black,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
              }}>
              {data?.projectName}
            </Text>
            <View style={{borderRadius: 20, overflow: 'hidden'}}>
              <MapView
                provider="google"
                style={{
                  height: screenHeight / 2,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 20,
                }}
                ref={_map}
                loadingEnabled={true}
                zoomEnabled={false}
                scrollEnabled={false}
                showsMyLocationButton={false}
                showsUserLocation={false}
                rotateEnabled={false}
                region={{
                  latitude: data?.lat,
                  longitude: data?.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                mapType="standard"
                maxZoomLevel={30}>
                <Marker
                  coordinate={{latitude: data?.lat, longitude: data?.lng}}
                  style={{width: 120, height: 80}}>
                  <Image
                    source={require('@/assets/images/icons/pin_icon.png')}
                    style={{height: 30, width: 25}}
                    resizeMode="contain"
                  />
                </Marker>
              </MapView>
              <TouchableOpacity
                style={{marginVertical: 10}}
                onPress={() => {
                  gotoMaps();
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: theme?.directionBlue,
                    textDecorationLine: 'underline',
                    fontSize: 14,
                    alignSelf: 'flex-end',
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  Get Directions
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 5}}>
              <Text
                allowFontScaling={false}
                style={{
                  marginVertical: 10,
                  fontSize: 18,
                  color: theme?.logoColor,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                }}>
                Address
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                }}>
                {data?.address}
              </Text>
            </View>
          </ScrollView>
        )}
      </View>

      <TabsButton
        disabledEnquiryTap={loading}
        mainViewStyling={{
          alignSelf: 'center',
          width: screenWidth * 0.95,
          position: 'absolute',
          bottom: -5,
          height: 100,
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingBottom: 20,
          paddingTop: 21,
          borderTopWidth: 0.2,
          borderTopColor: theme?.lightGrey,
        }}
        enquiryPress={() => {
          props?.navigation?.navigate('Enquiry', {
            data: {
              lat: data?.lat,
              lng: data?.lng,
              unitType: '',
              floorPlan: '',
              projectTitle: data?.projectName,
              id: data?.id,
            },
          });
          // console.log('asjdhajshdjkahsdkj', data);
        }}
      />
      <MapPopup
        show={showMapPopup}
        onTouchOutside={() => {
          setShowMapPopup(false);
        }}
        onPressAppleMap={onPressAppleMap}
        onPressGoogleMap={onPressGoogleMap}
      />
    </>
  );
};

export default Location;
