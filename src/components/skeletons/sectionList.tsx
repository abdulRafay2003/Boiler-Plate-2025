import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SectionListSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight, paddingHorizontal: 15}}>
        <View
          style={{
            marginTop: 20,
          }}>
          <View
            style={{width: '60%', height: 40, marginTop: 10, borderRadius: 6}}
          />
          <View
            style={{width: '100%', height: 120, marginTop: 10, borderRadius: 6}}
          />
        </View>
        <View
          style={{
            marginTop: 10,
          }}>
          <View
            style={{width: '60%', height: 40, marginTop: 10, borderRadius: 6}}
          />
          <View
            style={{width: '100%', height: 120, marginTop: 10, borderRadius: 6}}
          />
        </View>
        <View
          style={{
            marginTop: 10,
          }}>
          <View
            style={{width: '60%', height: 40, marginTop: 10, borderRadius: 6}}
          />
          <View
            style={{width: '100%', height: 120, marginTop: 10, borderRadius: 6}}
          />
        </View>
        <View
          style={{
            marginTop: 10,
          }}>
          <View
            style={{width: '60%', height: 40, marginTop: 10, borderRadius: 6}}
          />
          <View
            style={{width: '100%', height: 120, marginTop: 10, borderRadius: 6}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default SectionListSkeleton;
