import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const UserProfileSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{paddingRight: 20}}>
          <View
            style={{
              width: screenWidth,
              height: screenHeight * 0.7,
              marginTop: 40,
              paddingHorizontal:15,
              alignItems:'center'
            }}>
                <View style={{height:110,width:110,borderRadius:110/2,marginTop:10}}/>
                <View style={{width:100,height:45,borderRadius:10,marginTop:10}}/>
                <View style={{width:'100%',height:85,borderRadius:10,marginTop:30}}/>
                <View style={{width:'100%',height:85,borderRadius:10,marginTop:10}}/> 
                <View style={{width:'100%',height:85,borderRadius:10,marginTop:10}}/>                
            </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default UserProfileSkeleton;
