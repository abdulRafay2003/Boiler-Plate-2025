import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ActivityHeaderSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{flex: 1}}>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 70 / 2,
                marginTop: 10,
              }}
            />
            <View
              style={{
                width: 60,
                height: 16,
                alignSelf: 'center',
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          </View>

          <View>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 70 / 2,
                marginTop: 10,
              }}
            />
            <View
              style={{
                width: 60,
                height: 16,
                alignSelf: 'center',
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          </View>
          <View>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 70 / 2,
                marginTop: 10,
              }}
            />
            <View
              style={{
                width: 60,
                height: 16,
                alignSelf: 'center',
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          </View>
          <View>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 70 / 2,
                marginTop: 10,
              }}
            />
            <View
              style={{
                width: 60,
                height: 16,
                alignSelf: 'center',
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default ActivityHeaderSkeleton;
