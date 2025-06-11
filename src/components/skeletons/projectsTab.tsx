import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ProjectTabSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          width: screenWidth * 0.9,
          height: 60,
          alignSelf: 'center',
          borderRadius: 50,
        }}
      />
    </SkeletonPlaceholder>
  );
};

export default ProjectTabSkeleton;
