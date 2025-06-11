import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CalendarSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: '100%'}}>
        <View
          style={{height: 40, width: 120, borderRadius: 10, marginLeft: 20}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View style={{height: 40, width: 70, borderRadius: 10}} />
          <View style={{height: 40, width: 70, borderRadius: 10}} />
          <View style={{height: 40, width: 70, borderRadius: 10}} />
          <View style={{height: 40, width: 70, borderRadius: 10}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View style={{height: 70, width: 70, borderRadius: 10}} />
          <View style={{height: 70, width: 70, borderRadius: 10}} />
          <View style={{height: 70, width: 70, borderRadius: 10}} />
          <View style={{height: 70, width: 70, borderRadius: 10}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View style={{height: 40, width: 80, borderRadius: 10}} />
          <View style={{height: 40, width: 80, borderRadius: 10}} />
          <View style={{height: 40, width: 80, borderRadius: 10}} />
          <View style={{height: 40, width: 80, borderRadius: 10}} />
        </View>
        <View
          style={{
            height: 40,
            width: 120,
            borderRadius: 10,
            marginLeft: 20,
            marginTop: 20,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View style={{height: 40, width: 70, borderRadius: 10}} />
          <View style={{height: 40, width: 70, borderRadius: 10}} />
          <View style={{height: 40, width: 70, borderRadius: 10}} />
          <View style={{height: 40, width: 70, borderRadius: 10}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View style={{height: 70, width: 70, borderRadius: 10}} />
          <View style={{height: 70, width: 70, borderRadius: 10}} />
          <View style={{height: 70, width: 70, borderRadius: 10}} />
          <View style={{height: 70, width: 70, borderRadius: 10}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View style={{height: 40, width: 80, borderRadius: 10}} />
          <View style={{height: 40, width: 80, borderRadius: 10}} />
          <View style={{height: 40, width: 80, borderRadius: 10}} />
          <View style={{height: 40, width: 80, borderRadius: 10}} />
        </View>
        <View
          style={{
            height: 60,
            width: '90%',
            borderRadius: 10,
            alignSelf: 'center',
            marginTop: 20,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default CalendarSkeleton;
