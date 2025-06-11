import React, {useState, useRef, useEffect} from 'react';
import {View, StatusBar, Dimensions, Text, Keyboard, Platform} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {SubmitButton} from '@/components/buttons/submitButton';
import {DeleteAccountPopup} from '@/components/modal/deleteAccountPopup';
import {ReasonValidation} from '@/components/Validations/validations';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import {useForm} from 'react-hook-form';
import {setLoader, setUserDetail} from '@/redux/slice/UserSlice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Input} from '@/components/TextInput/Input';
import {DeleteAccountApi} from '@/services/apiMethods/authApis';
import LoaderNew from '@/components/loaderNew';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import {AxiosError} from 'axios';
import { RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const DeleteAccount = props => {

  const inputRef = useRef(null);
  const isLoadingRedux = useSelector((state: RootState) => state?.user?.loading);
  const [showPopUp, setShowPopUp] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reason, setReason] = useState('');
  const [agree, setAgree] = useState(false);
  const [showThankyou, setShowThankyou] = useState(false);
  const [thanksText, setThanksText] = useState('');
  const [apiResponnseErrors, setApiResponseMessageView] = useState('');
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(ReasonValidation),
  });
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if(Platform.OS == 'android'){

      StatusBar.setTranslucent(true);
    }
    dispatchToStore(setLoader(false));
  }, []);
  const onPressYes = async () => {
    try {
      setShowPopUp(false);
      dispatchToStore(setLoader(true));
      let payload = {
        reason: reason,
      };
      const deleteAccount = await DeleteAccountApi(payload);
      if (deleteAccount?.statusCode == 200) {
        dispatchToStore(setLoader(false));
        setShowPopUp(false);
        setShowThankyou(true);
        setThanksText(deleteAccount?.message);
      } else {
        dispatchToStore(setLoader(false));
        setShowPopUp(true);
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setApiResponseMessageView('Unable to delete account at the moment.');
      }
      dispatchToStore(setLoader(false));
    }
  };
  return (
    <>
      <View
        style={{backgroundColor: theme?.white, paddingBottom: 100, flex: 1}}>
        <Headers
          bgStyles={{
            backgroundColor: theme?.logoColor,
            height: 100,
            width: screenWidth,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            justifyContent: 'center',
          }}
          internalViewStyles={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 10,
            height: 80,
          }}
          backArrowViewStyles={{
            width: 47,
            height: 47,
            borderRadius: 47 / 2,
            backgroundColor: theme?.transparentWhite,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          notificationViewStyles={{
            width: 47,
            height: 47,
            borderRadius: 47 / 2,
            backgroundColor: theme?.transparentWhite,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          notificationIconStyles={{height: 17, width: 17}}
          backArrowStyles={{
            height: 17,
            width: 10,
            tintColor: theme?.white,
            transform: [{rotate: '180 deg'}],
          }}
          heading={'Account'}
          headingViewStyles={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          headingStyles={{
            color: theme?.white,
            fontSize: 20,
            fontFamily: FONT_FAMILY?.IBMPlexBold,
            marginLeft: 10,
          }}
          onBackArrowPress={() => {
            props.navigation.goBack();
          }}
          onNotificationPress={() => {
            props?.navigation?.navigate('Notification');
          }}
          notificationIcon={false}
        />
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 40,
          }}>
          <Text
                  allowFontScaling={false}

            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              textAlign: 'left',
            }}>
            This account will be deleted within the next 30 days. We appreciate
            your support and engagement. Thank you for being part of our
            community.If you wish to cancel the delete request, login with same
            credentials and visit your profile. After 30 days, the account will
            be removed permanently.If you have any questions, feel free to reach
            out.
          </Text>
          <SubmitButton
            btnContainer={{
              height: 58,
              width: '100%',
              backgroundColor: theme?.logoColor,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 25,
            }}
            btnText="Delete Account"
            btnTextStyle={{
              color: theme?.white,
              fontSize: 14,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}
            onPress={() => {
              setAgree(false);
              reset({reason});
              setShowPopUp(true);
              setAgree(false);
            }}
          />
        </View>
      </View>
      <DeleteAccountPopup
        onStartShouldSetResponder={() => {
          Keyboard.dismiss();
        }}
        show={showPopUp}
        onTouchOutside={() => {
          if (agree == true) {
            setShowPopUp(false);
            setAgree(false);
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
            dispatchToStore(setUserDetail({role: 'guest'}));
          } else {
            setShowPopUp(false);
            Keyboard.dismiss();
          }
        }}
        onClose={() => {
          setShowPopUp(false);
          setReason('');
        }}
        goToHome={() => {
          setShowPopUp(false);
          setReason('');
          setAgree(false);
          props.navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
          dispatchToStore(setUserDetail({role: 'guest'}));
        }}
        focused={focused}
        textInputFocused={() => {
          setFocused(true);
        }}
        control={control}
        reasonMulti={true}
        errors={errors?.reason && errors?.reason?.message}
        reasonText={reason}
        onChangeTexts={text => {

          setReason(text);
        }}
        onNoPress={() => {
          setShowPopUp(false);
          setReason('');
        }}
        onYesPress={handleSubmit(onPressYes)}
        reasonSubmit={agree}
        inputRef={inputRef}
        onTouchInput={() => {
          if (inputRef) {
            inputRef?.current?.focus();
          }
        }}
      />
      <ThankYouPopup
        onTouchOutside={() => {
          setShowThankyou(false);
          if (thanksText != '') {
            props?.navigation?.goBack();
          }
        }}
        onClose={() => {
          setShowThankyou(false);
          props?.navigation?.goBack();
        }}
        show={showThankyou}
        thankyouText={thanksText}
      />
      <AlertPopupAuth
        show={apiResponnseErrors?.length > 0 ? true : false}
        onClose={() => {
          setApiResponseMessageView('');
        }}
        alertText={apiResponnseErrors}
        onTouchOutside={() => {
          setApiResponseMessageView('');
        }}
      />
      <LoaderNew visible={isLoadingRedux} color={theme?.logoColor} />
    </>
  );
};

export default DeleteAccount;
