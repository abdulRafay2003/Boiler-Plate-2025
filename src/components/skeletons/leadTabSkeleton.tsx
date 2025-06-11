import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LeadTabSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: 10, marginTop: 20}}>
        <View style={{paddingHorizontal: 0}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View
              style={{
                width: '40%',
                height: 40,
                borderRadius: 10,
                marginTop: 10,
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                width: '40%',
                height: 40,
                borderRadius: 10,
                marginTop: 10,
                alignSelf: 'center',
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 2,
            borderRadius: 10,
            marginTop: 5,
            alignSelf: 'center',
          }}
        />
      </View>
      <View
        style={{
          width: screenWidth,
          height: screenHeight * 0.7,
          marginTop: 50,
          paddingHorizontal: 15,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{width: '50%', height: 40, borderRadius: 10, marginTop: 10}}
          />
          <View
            style={{width: '20%', height: 40, borderRadius: 10, marginTop: 10}}
          />
        </View>
        <View
          style={{width: '100%', height: 60, borderRadius: 10, marginTop: 30}}
        />
        <View
          style={{width: '100%', height: 60, borderRadius: 10, marginTop: 10}}
        />
        <View
          style={{width: '100%', height: 60, borderRadius: 10, marginTop: 10}}
        />
        <View
          style={{width: '100%', height: 60, borderRadius: 10, marginTop: 10}}
        />
        <View
          style={{width: '100%', height: 60, borderRadius: 10, marginTop: 10}}
        />
        <View
          style={{width: '100%', height: 60, borderRadius: 10, marginTop: 10}}
        />
        <View
          style={{width: '100%', height: 60, borderRadius: 10, marginTop: 10}}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default LeadTabSkeleton;
