import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SingleVRSkeleton = () => {
  return (
    <SkeletonPlaceholder  backgroundColor="#D8E0E4"  >
      <View
        style={{
          width: screenWidth * 0.9,
          height:
            screenHeight * 0.38,
            borderRadius: 30,
            alignSelf: 'center',
            marginTop:screenHeight*(-0.176),
            position:'absolute',
           
        }}
      />
    </SkeletonPlaceholder>
  );
};

export default SingleVRSkeleton;
