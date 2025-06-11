import {View, Dimensions, VirtualizedList, Platform} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomerBottomSheetSkeleton1 = () => {
  return (
    <SkeletonPlaceholder>
        <View style={{height: Platform?.OS == 'ios' ? 105 : 130,width:screenWidth,marginTop:20}}>
    
     </View>
    </SkeletonPlaceholder>
  );
};

export default CustomerBottomSheetSkeleton1;
