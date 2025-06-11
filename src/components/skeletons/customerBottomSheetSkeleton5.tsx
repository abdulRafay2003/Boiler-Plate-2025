import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomerBottomSheetSkeleton1 = () => {
  return (
    <SkeletonPlaceholder>
        <View style={{height:290,borderRadius:15,marginTop:40}}>
    
     </View>
    </SkeletonPlaceholder>
  );
};

export default CustomerBottomSheetSkeleton1;
