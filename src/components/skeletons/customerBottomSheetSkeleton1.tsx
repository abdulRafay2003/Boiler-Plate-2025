import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomerBottomSheetSkeleton1 = () => {
  return (
    <SkeletonPlaceholder>
        <View style={{height:140}}>
     <View style={{flexDirection:'row',justifyContent:'space-around'}}>
        <View style={{height:60,width:screenWidth*0.7 ,borderRadius:6}} />
        <View style={{height:40,width:screenWidth*0.2 ,borderRadius:6}} />
     </View>
     <View style={{height:30,width:screenWidth*0.8 ,borderRadius:6,marginTop:10,marginLeft:10}} />
      <View style={{height:30,width:screenWidth*0.95 ,borderRadius:6,marginTop:10,marginLeft:10}} />
     </View>
    </SkeletonPlaceholder>
  );
};

export default CustomerBottomSheetSkeleton1;
