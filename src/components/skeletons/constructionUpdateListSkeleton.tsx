import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ConstructionUpdateListSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{paddingRight: 20}}>
          <View
            style={{
              width: screenWidth,
              height: screenHeight * 0.7,
              marginTop: 40,
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: screenWidth,
                paddingHorizontal: 20,
              }}>
              <View style={{height: 140, width: 160, borderRadius: 15}} />
              <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 20,
                    borderRadius: 6,
                    // marginTop: 20,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 8,
                    marginTop: 5,
                  }}
                />

                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 20,
                    borderRadius: 6,
                    marginTop: 10,
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
                marginTop: 40,
              }}>
              <View style={{height: 140, width: 160, borderRadius: 15}} />
              <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 20,
                    borderRadius: 6,
                    // marginTop: 20,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 8,
                    marginTop: 5,
                  }}
                />

                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 20,
                    borderRadius: 6,
                    marginTop: 10,
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
                marginTop: 40,
              }}>
              <View style={{height: 140, width: 160, borderRadius: 15}} />
              <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 20,
                    borderRadius: 6,
                    // marginTop: 20,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 8,
                    marginTop: 5,
                  }}
                />

                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 20,
                    borderRadius: 6,
                    marginTop: 10,
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
                marginTop: 40,
              }}>
              <View style={{height: 140, width: 160, borderRadius: 15}} />
              <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 20,
                    borderRadius: 6,
                    // marginTop: 20,
                  }}
                />
                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 30,
                    borderRadius: 8,
                    marginTop: 5,
                  }}
                />

                <View
                  style={{
                    width: screenWidth * 0.45,
                    height: 20,
                    borderRadius: 6,
                    marginTop: 10,
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

export default ConstructionUpdateListSkeleton;
