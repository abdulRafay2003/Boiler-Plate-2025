import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const InvoiceDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          height: screenHeight,
          width: screenWidth,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: screenWidth * 0.9,
            height: screenHeight * 0.6,
            marginTop: 20,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.9,
            height: 65,
            marginTop: 20,
            borderRadius: 10,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default InvoiceDetailSkeleton;
