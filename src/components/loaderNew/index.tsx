import React, {useEffect, useState} from 'react';
import {Dimensions, Platform, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

interface Props {
  visible: boolean | null;
  color?: any | null;
  // loading: any;
  // backdropOpacity: any;
}

const LoaderNew = (props: Props) => {
  const {visible, color} = props;
  const [seconds, setSeconds] = useState(60);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Modal
      isVisible={visible}
      deviceHeight={screenHeight}
      deviceWidth={screenWidth}
      backdropColor={'black'}
      backdropOpacity={Platform.OS == 'ios' ? 0.9 : 0.7}
      statusBarTranslucent={true}
      animationOut="fadeOut">
      <ActivityIndicator size="large" color={color} />
    </Modal>
  );
};

export default LoaderNew;
