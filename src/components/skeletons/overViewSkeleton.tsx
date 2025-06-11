import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const OverviewSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{paddingRight: 20}}>
          <View
            style={{
              width: screenWidth,
              height: screenHeight * 0.7,
              marginTop: 50,
              paddingHorizontal:15
            }}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{width:'50%',height:40,borderRadius:10,marginTop:10}}/>
                 <View style={{width:'20%',height:40,borderRadius:10,marginTop:10}}/>
                </View>
                <View style={{width:'100%',height:60,borderRadius:10,marginTop:30}}/>
                <View style={{width:'100%',height:60,borderRadius:10,marginTop:10}}/>
                <View style={{width:'100%',height:60,borderRadius:10,marginTop:10}}/>
                <View style={{width:'100%',height:60,borderRadius:10,marginTop:10}}/>
                <View style={{width:'100%',height:60,borderRadius:10,marginTop:10}}/>
                <View style={{width:'100%',height:60,borderRadius:10,marginTop:10}}/>
                <View style={{width:'100%',height:60,borderRadius:10,marginTop:10}}/>
            </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default OverviewSkeleton;
