import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomerBottomSheetSkeleton1 = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: 140, marginTop: 20,flexDirection:'row'}}>
        <View
          style={{alignItems: 'flex-start', width: 100}}>
          <View style={{height: 70, width: 70, borderRadius: 70 / 2}} />
          <View
            style={{height: 30, width: 70, marginTop: 10, borderRadius: 6}}
          />
        </View>
        <View
          style={{alignItems: 'flex-start', width: 100}}>
          <View style={{height: 70, width: 70, borderRadius: 70 / 2}} />
          <View
            style={{height: 30, width: 70, marginTop: 10, borderRadius: 6}}
          />
        </View>
        <View
          style={{alignItems: 'flex-start', width: 100}}>
          <View style={{height: 70, width: 70, borderRadius: 70 / 2}} />
          <View
            style={{height: 30, width: 70, marginTop: 10, borderRadius: 6}}
          />
        </View>
        <View
          style={{alignItems: 'flex-start', width: 100}}>
          <View style={{height: 70, width: 70, borderRadius: 70 / 2}} />
          <View
            style={{height: 30, width: 70, marginTop: 10, borderRadius: 6}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default CustomerBottomSheetSkeleton1;
