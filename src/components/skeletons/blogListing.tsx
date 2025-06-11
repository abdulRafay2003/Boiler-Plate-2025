import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const BlogListingSkeleton = () => {
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
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: screenWidth,
                paddingHorizontal: 20,
              }}>
              <View style={{height: 150, width: 150, borderRadius: 10}} />
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 10,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.25,
                    height: 30,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: screenWidth,
                paddingHorizontal: 20,
                marginTop: 20,
              }}>
              <View style={{height: 150, width: 150, borderRadius: 10}} />
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 10,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.25,
                    height: 30,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: screenWidth,
                paddingHorizontal: 20,
                marginTop: 20,
              }}>
              <View style={{height: 150, width: 150, borderRadius: 10}} />
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 10,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.25,
                    height: 30,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: screenWidth,
                paddingHorizontal: 20,
                marginTop: 20,
              }}>
              <View style={{height: 150, width: 150, borderRadius: 10}} />
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 10,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.25,
                    height: 30,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default BlogListingSkeleton;
