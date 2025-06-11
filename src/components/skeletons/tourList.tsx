import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const TourListSkeleton = () => {
  return (
    <SkeletonPlaceholder>
       <View style={{width:'80%',height:screenHeight*0.05,marginTop:5,borderRadius:15}}/>
       <View style={{width:'100%',height:screenHeight*0.35,marginTop:10,borderRadius:15}}/>
       <View style={{width:'100%',height:screenHeight*0.10,marginTop:10,borderRadius:15}}/>
       <View style={{width:'60%',height:screenHeight*0.05,marginTop:10,borderRadius:15, alignSelf:'center'}}/>
    </SkeletonPlaceholder>
  );
};

export default TourListSkeleton;
