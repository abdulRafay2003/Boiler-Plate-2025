import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LeadDetailLogDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: 600}}>
        <View style={{paddingHorizontal: 20}}>
          <View
            style={{
              width: '100%',
              height: 101,
              borderRadius: 10,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              width: '100%',
              height: 101,
              borderRadius: 10,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              width: '100%',
              height: 101,
              borderRadius: 10,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              width: '100%',
              height: 101,
              borderRadius: 10,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default LeadDetailLogDetailSkeleton;
