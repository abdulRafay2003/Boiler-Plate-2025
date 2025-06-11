import {View, Dimensions} from 'react-native';
import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
interface Props {
   from?: any | null
  }
const SingleItemSkeleton = (props: Props) => {
    const {
       from
      } = props;
  return (
    <SkeletonPlaceholder  backgroundColor="#D8E0E4"  >
      <View style={{height: screenHeight, paddingHorizontal: 15,marginTop:20}}>
        <View
          style={{
            marginTop: 10,
          }}>
         {from == 'paymentPlan'&& <View
            style={{width: '60%', height: 40, marginTop: 10, borderRadius: 6}}
          />}
          <View
            style={{width: '100%', height: 150, marginTop: 10, borderRadius: 6}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default SingleItemSkeleton;
