import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PaymentSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{height: screenHeight,alignItems:'center',marginTop:10}}>
       <View style={{height:100,width:screenWidth*0.9,borderRadius:10}} />
       <View style={{height:500,width:screenWidth*0.9,marginTop:20,borderRadius:10}} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default PaymentSkeleton;
