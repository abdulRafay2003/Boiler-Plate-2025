import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const BlogDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{paddingRight: 20}}>
         
          <View
            style={{
              width: screenWidth,
              height: screenHeight * 0.7,
              marginTop: 20,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: screenWidth * 0.9,
                height: 60,
                borderRadius:10
              }}
            />
            <View
              style={{
                width: screenWidth * 0.9,
                height: 60,
                flexDirection:'row',
                justifyContent:'space-between',
                marginTop:10
              }}>
              <View
                style={{
                  width: screenWidth * 0.45,
                  height: 60,
                  borderRadius:10
                }}
              />
              <View
                style={{
                  width: screenWidth * 0.30,
                  height: 60,
                  borderRadius:10
                }}
              />
            </View>
            <View
              style={{
                width: screenWidth * 0.9,
                height: screenHeight*0.6,
                marginTop: 20,
                borderRadius:10
              }}
            />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default BlogDetailSkeleton;
