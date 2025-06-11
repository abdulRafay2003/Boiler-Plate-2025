import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import theme from '@/assets/stylesheet/theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HeaderSkeleton = () => {
  return (
    <SkeletonPlaceholder backgroundColor='#D8E0E4'>
      <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',top:160}}>
       
      <View
          style={{
            width: 60,
            height: 240,
           borderTopRightRadius:23,
           borderBottomRightRadius:23

           
            
           
          }}
        />
        <View
          style={{
            width: 260,
            height: 240,
            borderRadius: 23,
            marginHorizontal:20
           
          }}
        />
         <View
          style={{
            width: 100,
            height: 240,
            borderRadius: 23,
           
           
          }}
        />
        
      </View>
    </SkeletonPlaceholder>
  );
};

export default HeaderSkeleton;
