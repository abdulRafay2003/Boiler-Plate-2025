import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const FloorPlanSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{justifyContent:'center',alignItems:'center'}}>
          <View
            style={{
              width: screenWidth,
              flexDirection: 'row',
              marginTop: 20,
              paddingLeft: 15,
            }}>
            <View
              style={{width: 150, height: 50, borderRadius: 50, marginLeft: 0}}
            />
            <View
              style={{width: 150, height: 50, borderRadius: 50, marginLeft: 10}}
            />
            <View
              style={{width: 150, height: 50, borderRadius: 50, marginLeft: 10}}
            />
          </View>
          <View style={{width:'90%',height:300,marginTop:20,borderRadius:10}} />
          <View style={{width:'90%',height:30,marginTop:5,borderRadius:10}} />
          <View style={{width:'90%',height:30,marginTop:5,borderRadius:10}} />
          <View style={{width:'90%',height:30,marginTop:5,borderRadius:10}} />
          <View style={{width:'50%',height:50,marginTop:20,borderRadius:10,alignSelf:'flex-start',marginLeft:20}} />
        </View>
       
      </View>
    </SkeletonPlaceholder>
  );
};

export default FloorPlanSkeleton;
