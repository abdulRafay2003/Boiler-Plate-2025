import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AgentAllLeadsSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
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
            marginTop: 20,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 68,
            borderRadius: 10,
            marginTop: 20,
            marginBottom: 15,
          }}
        />
        <View
          style={{
            width: screenWidth * 0.893,
            height: 68,
            borderRadius: 10,
            marginTop: 20,
            marginBottom: 15,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default AgentAllLeadsSkeleton;
