import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomerBottomSheetSkeleton2 = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: 290,marginTop:10}}>
        <View
          style={{
            height: 30,
            width: screenWidth * 0.95,
            borderRadius: 6,
            marginTop: 10,
            alignSelf:'center'
          }}
        />
          <View
          style={{
            height: 30,
            width: screenWidth * 0.95,
            borderRadius: 6,
            marginTop: 10,
            alignSelf:'center'
          }}
        />
          <View
          style={{
            height: 30,
            width: screenWidth * 0.95,
            borderRadius: 6,
            marginTop: 10,
            alignSelf:'center'
          }}
        />
          <View
          style={{
            height: 30,
            width: screenWidth * 0.95,
            borderRadius: 6,
            marginTop: 10,
            alignSelf:'center'
          }}
        />
          <View
          style={{
            height: 30,
            width: screenWidth * 0.95,
            borderRadius: 6,
            marginTop: 10,
            alignSelf:'center'
          }}
        />
          <View
          style={{
            height: 30,
            width: screenWidth * 0.95,
            borderRadius: 6,
            marginTop: 10,
            alignSelf:'center'
          }}
        />
          <View
          style={{
            height: 30,
            width: screenWidth * 0.95,
            borderRadius: 6,
            marginTop: 10,
            alignSelf:'center'
          }}
        />
         
         
      </View>
    </SkeletonPlaceholder>
  );
};

export default CustomerBottomSheetSkeleton2;
