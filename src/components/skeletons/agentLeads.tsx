import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AgentLeadSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <>
        <View
          style={{
            width: screenWidth * 0.893,
            height: 68,
            borderRadius: 10,
            marginTop: 20,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 68,
            borderRadius: 10,
            marginTop: 18,
            // marginBottom: 15,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 68,
            borderRadius: 10,
            marginTop: 18,
            // marginBottom: 15,
          }}
        />
      </>
    </SkeletonPlaceholder>
  );
};

export default AgentLeadSkeleton;
