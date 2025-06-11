import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheet/theme';
interface Props {
  item?: any | null;
  onPressItem?: any | null;
  index?: any | null;
  BG?: any | null;
  activeIndex?: any | null;
  fontFamilyStyle?: any | null;
  lineShow?: any | null;
}
const ActivityItem = (props: Props) => {
  const {item, onPressItem, index, BG, fontFamilyStyle, lineShow} = props;
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
      }}>
      <View
        style={{
          width: 100,
          height: 110,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            width: 100,
            height: 110,
          }}
          activeOpacity={1}
          onPress={onPressItem?.bind(this, index)}>
          <View
          
            style={{
              height: 60,
              width: 60,
              borderRadius: 60 / 2,
              backgroundColor: BG,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
          
              source={item?.icon}
              style={{
                height: 25,
                width: 25,
                tintColor: theme?.white,
              }}
              resizeMode="contain"
            />
          </View>
          <Text
          allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: fontFamilyStyle,
              color: theme?.black,
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
        {lineShow && (
          <View
            style={{
              height: 50,
              width: 2,
              bottom: 7,
              backgroundColor: theme?.greyRGB,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default ActivityItem;
