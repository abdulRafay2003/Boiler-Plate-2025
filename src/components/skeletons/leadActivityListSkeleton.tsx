import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LeadActivityListSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height:85,marginTop:60}}>
      <View style={{flexDirection:'row',justifyContent:'space-around'}}>
      <View style={{width:70,height:70,borderRadius:70/2,marginTop:5,alignSelf:"center"}}/>
      <View style={{width:5,height:70,borderRadius:70/2,marginTop:5,alignSelf:"center"}}/>
      <View style={{width:70,height:70,borderRadius:70/2,marginTop:5,alignSelf:"center"}}/>
      <View style={{width:5,height:70,borderRadius:70/2,marginTop:5,alignSelf:"center"}}/>
      <View style={{width:70,height:70,borderRadius:70/2,marginTop:5,alignSelf:"center"}}/>
      </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default LeadActivityListSkeleton;
