import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import moment from 'moment';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  item?: any | null;
  onPressLead?: any | null;
}
const LeadCard = (props: Props) => {
  const {item, onPressLead} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingVertical: 5,
        marginTop: 10,
      }}
      activeOpacity={1}
      onPress={onPressLead.bind(this, item?.leadNo)}>
      <View
        style={{
          width: screenWidth * 0.9,
          height: 70,
          borderWidth: 1.14,
          borderRadius: 10,
          borderColor: theme?.greyColor,
          paddingHorizontal: 15,
          justifyContent: 'center',
        }}>
        <View>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: theme?.bottomTab,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              width: '100%',
            }}>
            Lead ID:
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.logoColor,
                fontSize: 20,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                width: '100%',
              }}>
              {' '}
              {item?.title}
            </Text>
          </Text>
        </View>
        <View>
          <Text
            allowFontScaling={false}
            style={{
              color: theme?.bottomTab,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            Date:
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.bottomTab,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                flexWrap: 'wrap',
                width: screenWidth * 0.53,
              }}>
              {' '}
              {moment(item?.leadCreationDate)?.format('DD MMM YYYY')}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LeadCard;
