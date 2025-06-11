import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomerBottomSheetSkeleton1 = () => {
  return (
    <SkeletonPlaceholder>
        <View style={{height:350,marginTop:20}}>
        <View style={{height:250,borderRadius:10}}/>
        <View style={{height:60,marginTop:10,borderRadius:10}}/>
        <View style={{height:15,marginTop:10,borderRadius:10,width:40,alignSelf:'center'}}/>
     </View>
    </SkeletonPlaceholder>
  );
};

export default CustomerBottomSheetSkeleton1;
