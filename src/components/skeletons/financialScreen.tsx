import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const FinancialScreenSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight, alignItems: 'center', marginTop: 40}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: screenWidth,
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              width: screenWidth * 0.4,
              height: 60,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              width: screenWidth * 0.4,
              height: 60,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            width: screenWidth * 0.893,
            height: 50,
            borderRadius: 10,
            marginTop: 20,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: screenWidth,
            paddingHorizontal: 20,
            marginTop: 20,
          }}>
          <View
            style={{
              width: screenWidth * 0.4,
              height: 60,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              width: screenWidth * 0.4,
              height: 60,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            width: screenWidth * 0.893,
            height: 120,
            borderRadius: 10,
            marginTop: 20,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 120,
            borderRadius: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 120,
            borderRadius: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 120,
            borderRadius: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 120,
            borderRadius: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 120,
            borderRadius: 10,
            marginTop: 10,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default FinancialScreenSkeleton;
