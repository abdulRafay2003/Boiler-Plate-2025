import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomerBottomSheetSkeleton1 = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: 505, alignItems: 'center'}}>
        <View
          style={{
            width: screenWidth * 0.893,
            height: 150,
            borderRadius: 10,
            marginTop: 30,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 150,
            borderRadius: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 150,
            borderRadius: 10,
            marginTop: 10,
          }}
        />
       
       
       
      </View>
    </SkeletonPlaceholder>
  );
};

export default CustomerBottomSheetSkeleton1;
