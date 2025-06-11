import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DashboardConstructionUpdateSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          width: screenWidth,
          height:230
        }}
      >
    
      <View style={{flexDirection:'row'}}>
      <View style={{marginTop:10}}>
        <View
          style={{
            width: 170,
            height: 150,
            marginTop: 10,
            borderRadius: 10,
            marginLeft: 20,
          }}
        />
        <View
          style={{
            width: 170,
            height: 20,
            marginTop: 8,
            borderRadius: 6,
            marginLeft: 20,
          }}
        />
        <View
          style={{
            width: 170,
            height: 20,
            marginTop: 8,
            borderRadius: 6,
            marginLeft: 20,
          }}
        />
      </View>
      <View style={{marginTop:10}}>
        <View
          style={{
            width: 170,
            height: 150,
            marginTop: 10,
            borderRadius: 10,
            marginLeft: 10,
          }}
        />
        <View
          style={{
            width: 170,
            height: 20,
            marginTop: 8,
            borderRadius: 6,
            marginLeft: 10,
          }}
        />
        <View
          style={{
            width: 170,
            height: 20,
            marginTop: 8,
            borderRadius: 6,
            marginLeft: 10,
          }}
        />
      </View>
      <View style={{marginTop:10}}>
        <View
          style={{
            width: 170,
            height: 150,
            marginTop: 10,
            borderRadius: 10,
            marginLeft: 10,
          }}
        />
        <View
          style={{
            width: 170,
            height: 20,
            marginTop: 8,
            borderRadius: 6,
            marginLeft: 10,
          }}
        />
        <View
          style={{
            width: 170,
            height: 20,
            marginTop: 8,
            borderRadius: 6,
            marginLeft: 10,
          }}
        />
      </View>
      </View>
     </View>
    </SkeletonPlaceholder>
  );
};

export default DashboardConstructionUpdateSkeleton;
