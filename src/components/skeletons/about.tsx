import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AboutSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{paddingRight: 20}}>
          <View
            style={{
              width: screenWidth,
              height: screenHeight * 0.7,
              marginTop: 20,
              paddingHorizontal:15
            }}>
                <View style={{width:screenWidth,flexDirection:'row'}}>
                <View style={{width:150,height:50,borderRadius:50,marginLeft:0}}/>
                <View style={{width:150,height:50,borderRadius:50,marginLeft:10}}/>
                <View style={{width:150,height:50,borderRadius:50,marginLeft:10}}/>
                </View>
                <View style={{width:250,height:50,borderRadius:50,marginTop:30}}/>
                <View style={{width:'100%',height:100,borderRadius:10,marginTop:10}}/>
                <View style={{width:'100%',height:200,borderRadius:10,marginTop:10}}/>
                <View style={{width:'100%',height:120,borderRadius:10,marginTop:10}}/>
            </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default AboutSkeleton;
