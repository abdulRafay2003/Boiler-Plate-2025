import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const List = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            top: -10,
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
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            top: 10,
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

export default List;
