import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';
import i18next from 'i18next';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {useSelector} from 'react-redux';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

interface Props {
  enquiryPress?: any | null;
  mainViewStyling?: any | null;
  callPress?: any | null;
  whatsAppPress?: any | null;
  disabledEnquiryTap?: any | null;
}

export const TabsButton = (props: Props) => {
  const {
    enquiryPress,
    mainViewStyling,
    callPress,
    whatsAppPress,
    disabledEnquiryTap,
  } = props;
  const contactDetails = useSelector(state => state?.user?.contactDetails);
  const sendWhatsApp = num => {
    let msg = '';
    let phoneWithCountryCode = num;

    let mobile =
      Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
    if (mobile) {
      let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
      Linking.openURL(url)
        .then(data => {})
        .catch(() => {
          Alert.alert('Make sure WhatsApp installed on your device');
        });
    } else {
      Alert.alert('Please insert mobile no');
    }
  };
  return (
    <View style={mainViewStyling}>
      <View
        style={{
          width: '25%',
          borderRadius: 45,
          backgroundColor: theme?.logoColor,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              `tel:${contactDetails?.phone.replace(/[^0-9.+]/g, '')}`,
            );
          }}
          style={{
            width: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={require('@/assets/images/icons/call.png')}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
            }}
          />
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              color: theme?.white,
            }}>
            Call
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={enquiryPress}
        style={{
          width: '45%',
          borderRadius: 45,
          backgroundColor: theme?.logoColor,
          justifyContent: 'center',
        }}
        disabled={disabledEnquiryTap}>
        <View
          style={{
            width: 130,
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={require('@/assets/images/icons/enquiry.png')}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
            }}
          />
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              color: theme?.white,
            }}>
            Enquiry Form
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          sendWhatsApp(contactDetails?.whatsapp);
        }}
        style={{
          width: '25%',
          borderRadius: 45,
          backgroundColor: theme?.whatsApp,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('@/assets/images/icons/whatsapp.png')}
          style={{
            width: 30,
            height: 30,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
