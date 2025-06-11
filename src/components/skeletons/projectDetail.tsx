import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ProjectDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight, paddingHorizontal: 15}}>
        <View
          style={{width: '100%', height: 400, marginTop: 50, borderRadius: 6}}
        />
         <View
          style={{width: '100%', height: 400, marginTop: 10, borderRadius: 6}}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default ProjectDetailSkeleton;
