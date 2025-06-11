import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomerBottomSheetSkeleton8 = () => {
  return (
    <SkeletonPlaceholder>
        <View style={{height:350,marginTop:20}}>
       
     </View>
    </SkeletonPlaceholder>
  );
};

export default CustomerBottomSheetSkeleton8;
