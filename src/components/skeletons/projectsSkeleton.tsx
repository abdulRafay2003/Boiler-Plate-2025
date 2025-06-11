import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ProjectSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{width:screenWidth,height:'100%',top:10}}>
       
        <View
          style={{
            width: screenWidth * 0.9,
            height: 60,
            borderRadius: 50,
            alignSelf: 'center',
            // top: screenHeight * 0.13,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            backgroundColor:'yellow',
        
          }}>
          <View
            style={{
              width: screenWidth * 0.41,
              // width: 160,
              height: 140,
              borderRadius: 23,
              alignSelf: 'center',
              top: 30,
            }}
          />
          <View
            style={{
              width: screenWidth * 0.41,
              // width: 160,
              height: 140,
              borderRadius: 23,
              alignSelf: 'center',
              top: 30,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            marginTop:20
          }}>
          <View
            style={{
              width: screenWidth * 0.41,
              // width: 160,
              height: 140,
              borderRadius: 23,
              alignSelf: 'center',
              top: 30,
            }}
          />
          <View
            style={{
              width: screenWidth * 0.41,
              // width: 160,
              height: 140,
              borderRadius: 23,
              alignSelf: 'center',
              top: 30,
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default ProjectSkeleton;
