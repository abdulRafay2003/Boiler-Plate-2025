import {View, Text, Image, Dimensions} from 'react-native';
import React from 'react';
import i18next from 'i18next';
import theme from '@/assets/stylesheet/theme';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

interface Props {
  tintColor?: any | null;
  mainViewStyles?: any | null
  internalViewStyles?: any | null
}

export const CircleBackButton = (props: Props) => {
  const {tintColor,mainViewStyles,internalViewStyles} = props;

  return (
    <View
      style={[{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: screenWidth * 0.92,
      },mainViewStyles]}>
      <View
        style={[{
          backgroundColor: theme.logoColor,
          height: 47,
          width: 47,
          borderRadius: 47 / 2,
          alignItems: 'center',
          justifyContent: 'center',
        },internalViewStyles]}>
        <Image
          style={{
            width: 8,
            height: 14,
            tintColor: tintColor ? tintColor : theme.white,
            transform: [{rotate: '180deg'}],
          }}
          source={require('@/assets/images/icons/arrow.png')}
        />
      </View>
    </View>
  );
};
