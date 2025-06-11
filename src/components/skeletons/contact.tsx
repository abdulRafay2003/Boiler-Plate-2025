import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ContactUsSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight}}>
        <View style={{paddingRight: 20}}>
        
          <View
            style={{
              width: screenWidth,
              height: screenHeight * 0.7,
              marginTop: 20,
              paddingHorizontal: 15,
            }}>
            <View style={{width: screenWidth}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{height: 60, width: 60, borderRadius: 60 / 2}} />
                <View
                  style={{
                    width: screenWidth * 0.7,
                    marginLeft: 20,
                    borderRadius: 10,
                  }}
                />
              </View>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{height: 60, width: 60, borderRadius: 60 / 2}} />
                <View
                  style={{
                    width: screenWidth * 0.7,
                    marginLeft: 20,
                    borderRadius: 10,
                  }}
                />
              </View>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{height: 60, width: 60, borderRadius: 60 / 2}} />
                <View
                  style={{
                    width: screenWidth * 0.7,
                    marginLeft: 20,
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                height: 200,
                marginTop: 30,
                width: '100%',
                borderRadius: 10,
              }}
            />
            <View
              style={{
                height: 100,
                marginTop: 30,
                width: '100%',
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default ContactUsSkeleton;
