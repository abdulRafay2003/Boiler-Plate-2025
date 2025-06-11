import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LocationSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{paddingRight: 20}}>
          <View
            style={{
              height: screenHeight,
              width: screenWidth,
              paddingHorizontal: 15,
              marginTop: 20,
            }}>
            <View style={{height: 40, width: 250, borderRadius: 10}} />
            <View style={{height: 350, borderRadius: 10, marginTop: 10}} />
            <View style={{height: 100, borderRadius: 10, marginTop: 20}} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default LocationSkeleton;
