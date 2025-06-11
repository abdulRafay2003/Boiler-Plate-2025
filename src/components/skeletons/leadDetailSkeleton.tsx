import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LeadDetailHeaderSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: 100, paddingHorizontal: 20, marginTop: 10}}>
        <View
          style={{
            width: '70%',
            height: 25,
            borderRadius: 10,
            marginTop: 20,
          }}
        />
        <View
          style={{
            width: '50%',
            height: 20,
            borderRadius: 10,
            marginTop: 20,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default LeadDetailHeaderSkeleton;
