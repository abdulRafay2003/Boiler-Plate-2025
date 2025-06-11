import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const GallerySkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight * 0.735}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft:5
          }}>
          <View style={{width: 150, height: 50, borderRadius: 25, marginRight: 6,marginVertical:18}} />
          <View style={{width: 150, height: 50, borderRadius: 25, marginRight: 6, marginVertical: 18}} />
          <View style={{width: 150, height: 50, borderRadius: 25, marginRight: 6, marginVertical: 18}} />
        </View>
        <View
          style={{width: '100%', height: 400, marginTop: 0, borderRadius: 6}}
        />
        <View style={{width: '100%', marginTop: 30, flexDirection: 'row', paddingLeft:15}}>
          <View style={{height: 75, width: 90, borderRadius: 10}} />
          <View
            style={{height: 75, width: 90, borderRadius: 10, marginLeft: 10}}
          />
          <View
            style={{height: 75, width: 90, borderRadius: 10, marginLeft: 10}}
          />
          <View
            style={{height: 75, width: 90, borderRadius: 10, marginLeft: 10}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default GallerySkeleton;
