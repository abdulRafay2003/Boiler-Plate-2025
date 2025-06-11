import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HomeSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{paddingRight:20}}>
        <View
          style={{
            width: 75,
            height: 75,
            borderRadius: 23,
            alignSelf: 'center',
            top: screenHeight * 0.07,
            marginLeft:20
          }}
        />
         <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50/2,
            alignSelf: 'flex-end',
            // top: screenHeight * 0.07,
            
          }}
        />
        </View>
       
        <View
          style={{
            width: 260,
            height: 240,
            borderRadius: 23,
            alignSelf: 'center',
            top: screenHeight * 0.1,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.9,
            height: 60,
            borderRadius: 50,
            alignSelf: 'center',
            top: screenHeight * 0.13,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            top: 20,
          }}>
          <View
            style={{
              width: screenWidth * 0.41,
              // width: 160,
              height: 140,
              borderRadius: 23,
              alignSelf: 'center',
              top: screenHeight * 0.13,
            }}
          />
          <View
            style={{
              width: screenWidth * 0.41,
              // width: 160,
              height: 140,
              borderRadius: 23,
              alignSelf: 'center',
              top: screenHeight * 0.13,
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default HomeSkeleton;
