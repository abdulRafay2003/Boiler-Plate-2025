import {View, Dimensions, Image, Text} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import theme from '@/assets/stylesheet/theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const WalkthroughSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{height: screenHeight * 0.85}} />
        <View
          style={{
            height: screenHeight * 0.15,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: screenHeight * 0.05,
              width: screenWidth * 0.25,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              height: screenHeight * 0.05,
              width: screenWidth * 0.45,
              borderRadius: 10,
              flexDirection:'row',
              justifyContent:'space-around',
              alignItems:'center'
            }}>
            <View
              style={{
                height: screenHeight * 0.01,
                width: screenWidth * 0.13,
                borderRadius: 10,
              }}
            />
            <View
              style={{
                height: screenHeight * 0.01,
                width: screenWidth * 0.13,
                borderRadius: 10,
              }}
            />
             <View
              style={{
                height: screenHeight * 0.01,
                width: screenWidth * 0.13,
                borderRadius: 10,
              }}
            />
          </View>
          <View
            style={{
              height: 70,
              width: 70,
              borderRadius: 70 / 2,
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default WalkthroughSkeleton;
