import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PaymentPlanSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight, paddingHorizontal: 15,marginTop:20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{width: '60%', height: 20, marginTop: 10, borderRadius: 6}}
          />
          <View
            style={{width: '20%', height: 20, marginTop: 10, borderRadius: 6}}
          />
        </View>

        <View
          style={{width: '100%', height: 20, marginTop: 10, borderRadius: 6}}
        />
        <View
          style={{width: '100%', height: 30, marginTop: 10, borderRadius: 6}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View
            style={{width: '60%', height: 20, marginTop: 10, borderRadius: 6}}
          />
          <View
            style={{width: '30%', height: 20, marginTop: 10, borderRadius: 6}}
          />
        </View>
        <View
          style={{
            marginTop: 35,
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

export default PaymentPlanSkeleton;
