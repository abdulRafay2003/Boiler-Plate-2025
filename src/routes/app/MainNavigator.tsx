import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainStack from './app-routes';
import InitialRoute from './initiate';
import dataHandlerService from '../../services/mainServices/dataHandler.service';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useDispatch} from 'react-redux';
import {setSkipIntro, setWalkThroughImages} from '@/redux/actions/UserActions';
import {GetWalkThrough} from '@/services/apiMethods/walkthrough';
import theme from '@/assets/stylesheet/theme';
import {Alert, AppState} from 'react-native';
import AuthenticatedRoutes from './authenticatedRoutes';
import {AxiosError} from 'axios';

const MainRoute = props => {
  const dispatch = useDispatch();
  var status = dataHandlerService.getStore().getState().user.onBordingComplete;
  useEffect(() => {
    getWalkThroughImages();
  }, []);

  const getWalkThroughImages = async () => {
    let dirs = ReactNativeBlobUtil.fs.dirs;
    try {
      const images = await GetWalkThrough();

      let array = [];

      images?.map((item, index) => {
        array.push({
          key: item?.cover_image?.id,
          title: item?.title,
          text: item?.description,
          image: item?.cover_image?.url,
          color: theme?.black,
        });
      });

      dispatch(setWalkThroughImages(array));
    } catch (error) {
      const err = error as AxiosError;
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        dispatch(setSkipIntro(true));
        dispatch(setWalkThroughImages([]));
      }

      console.log('error', error);
    }
  };

  return (
    <NavigationContainer>
      {/* {<AuthenticatedRoutes />} */}
      {status ? <MainStack /> : <InitialRoute />}
    </NavigationContainer>
  );
};

export default MainRoute;
