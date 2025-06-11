import theme from '@/assets/stylesheet/theme';
import React from 'react';
import {View, ActivityIndicator, Dimensions} from 'react-native';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {}

export const Loader = (props: Props) => {
  const {} = props;
  return (
    <View
      style={{
        height: screenHeight,
        width: screenWidth,
        position: 'absolute',
        backgroundColor: theme?.blackOpacity,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}>
      <ActivityIndicator size={'large'} color={theme?.logoColor} />
    </View>
  );
};
