import {View, Dimensions, VirtualizedList} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {createBottomSheetScrollableComponent} from '@gorhom/bottom-sheet';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DashboardFinancialsSkeleton = () => {
  return (
    <SkeletonPlaceholder>

      <>
        <View
          style={{
            height: 150,
            width: screenWidth * 0.9,
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            height: 150,
            width: screenWidth * 0.9,
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            height: 150,
            width: screenWidth * 0.9,
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
          }}
        />
</>
    </SkeletonPlaceholder>
  );
};

export default DashboardFinancialsSkeleton;
