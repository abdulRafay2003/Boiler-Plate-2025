import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Loader} from '@/components/loader';
import {useForm} from 'react-hook-form';
import {AddUserValidation} from '@/components/Validations/validations';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import {Input} from '@/components/TextInput/Input';
import {DropDownButton} from '@/components/buttons/dropDownButton';
import {SubmitButton} from '@/components/buttons/submitButton';
import {ConfirmationPopup} from '@/components/modal/confirmationPopup';
import ReactNativePhoneInput from 'react-native-phone-input';
import {CountryPicker} from 'react-native-country-codes-picker';
import {
  countriesList,
  excludedCountries,
} from '@/constants/fontFamily/globalConst';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RadioButtonsGroup from '@/components/RadioButton';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const AddAndUpdateUser = props => {
  console?.log('jsadgdjhasgjhdasgf', props?.route?.params);
  const userData = props?.route?.params?.item;
  const phone_ref = useRef(null);
  const [loadingMark, setLoadingMark] = useState(false);
  const [focused, setFocused] = useState('');
  const [firstName, setFName] = useState(
    props?.route?.params?.from == 'Edit'
      ? `${props?.route?.params?.item?.firstName} ${props?.route?.params?.item?.lastName}`
      : '',
  );
  const [email, setEmail] = useState(
    props?.route?.params?.from == 'Edit'
      ? props?.route?.params?.item?.email
      : '',
  );
  const [accessDropDown, setAccessDropdown] = useState(false);
  const [accessLable, setAccessLabel] = useState(
    props?.route?.params?.from == 'Edit'
      ? props?.route?.params?.item?.permission
      : '',
  );
  const [accessArray, setAccessArray] = useState([
    {
      id: 1,
      title: 'Full Access',
    },
    {
      id: 2,
      title: 'Payment Access',
    },
    {
      id: 2,
      title: 'No Payment Access',
    },
  ]);
  const radioButtons = useMemo(
    () => [
      {
        id: 1, // acts as primary key, should be unique and non-empty string
        label: 'Enable',
        value: 'Enable',
      },
      {
        id: 0,
        label: 'Disable',
        value: 'Disable',
      },
    ],
    [],
  );
  const [selectedId, setSelectedId] = useState(
    props?.route?.params?.item?.status,
  );
  const [show, setShow] = useState(false);
  const [popType, setPopType] = useState('');
  const [phone, setPhone] = useState(
    props?.route?.params?.from == 'Edit'
      ? props?.route?.params?.item?.mobile
      : '',
  );
  const [phoneCode, setPhoneCode] = useState(
    props?.route?.params?.from == 'Edit'
      ? props?.route?.params?.item?.code
      : '+971',
  );
  const [showCountries, setShowCountries] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(AddUserValidation),
  });
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);
  const renderOptions = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setAccessLabel(item?.title);
          setAccessDropdown(false);
        }}
        activeOpacity={0.8}
        style={{
          paddingVertical: 10,
          justifyContent: 'center',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            alignSelf: 'flex-start',
            marginLeft: 15,
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            marginBottom: 5,
          }}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };
  const addnewUser = async () => {
    try {
      props?.navigation?.goBack();
    } catch (error) {}
  };
  return (
    <View
      style={{
        backgroundColor: theme?.white,
        flex: 1,
      }}>
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
        heading={'USER MANAGMEnt'}
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
          alignItems: 'center',
          justifyContent: 'space-between',
          width: screenWidth,
          marginTop: 30,
          flex: 0.95,
        }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{alignItems: 'center', width: screenWidth}}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              alignItems: 'center',
              width: screenWidth,
            }}>
            <Input
              editable={props?.route?.params?.from != 'Edit' ? true : false}
              title={'User Name'}
              titleStyles={{
                marginBottom: 10,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}
              placeholderTextColor={theme?.textGrey}
              mainViewStyles={{
                width: '90%',
              }}
              inputViewStyles={{
                borderWidth: 1,
                borderColor:
                  focused == 'fname' ? theme?.logoColor : theme?.inputBorder,
                height: 46,
                borderRadius: 8,
                backgroundColor:
                  props?.route?.params?.from == 'Edit'
                    ? theme?.lightGrey
                    : theme?.transparent,
              }}
              textInputFocused={() => {
                setFocused('fname');
              }}
              placeholder={'Enter full name'}
              fieldName={'firstName'}
              control={control}
              errTxt={errors?.firstName && errors?.firstName?.message}
              errTxtstyle={{
                top: 46,
                right: 0,
                position: 'absolute',
                color: theme.brightRed,
                fontSize: 11,
                alignSelf: 'flex-end',
              }}
              value={firstName}
              onChangeTexts={text => {
                setFName(text);
              }}
            />
            <Input
              editable={props?.route?.params?.from != 'Edit' ? true : false}
              title={'Email Address'}
              titleStyles={{
                marginBottom: 10,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}
              placeholderTextColor={theme?.textGrey}
              mainViewStyles={{
                width: '90%',
                marginVertical: 20,
              }}
              inputViewStyles={{
                borderWidth: 1,
                borderColor:
                  focused == 'email' ? theme?.logoColor : theme?.inputBorder,
                height: 46,
                borderRadius: 8,
                backgroundColor:
                  props?.route?.params?.from == 'Edit'
                    ? theme?.lightGrey
                    : theme?.transparent,
              }}
              textInputFocused={() => {
                setFocused('email');
              }}
              placeholder={'Enter email address'}
              fieldName={'email'}
              control={control}
              errTxt={errors?.email && errors?.email?.message}
              errTxtstyle={{
                top: 46,
                right: 0,
                position: 'absolute',
                color: theme.brightRed,
                fontSize: 11,
                alignSelf: 'flex-end',
              }}
              value={email}
              onChangeTexts={text => {
                if (text == ' ') {
                } else {
                  setEmail(text);
                }
              }}
            />
            <View style={{width: '90%'}}>
              <Text
                  allowFontScaling={false}

                style={{
                  marginBottom: 10,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                }}>
                Phone Number
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor:
                    focused == 'phone' ? theme?.logoColor : theme?.inputBorder,
                  width: '100%',
                  height: 46,
                  borderRadius: 8,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  backgroundColor:
                    props?.route?.params?.from == 'Edit'
                      ? theme?.lightGrey
                      : theme?.transparent,
                }}>
                {props?.route?.params?.from != 'Edit' && (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                      position: 'absolute',
                      left: 40,
                      top: Platform.OS == 'ios' ? 13.5 : 12,
                    }}
                    onPress={() => {
                      setShowCountries(true);
                    }}>
                    <Image
                      source={require('@/assets/images/icons/country_arrow.png')}
                      style={{height: 20, width: 20}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}

                <ReactNativePhoneInput
                  ref={phone_ref}
                  onPressFlag={() => {
                    setShowCountries(true);
                  }}
                  disabled
                  buttonTextStyle={{
                    fontSize: 14,
                    color: theme.darkestBlue,
                    backgroundColor: 'red',
                  }}
                  initialCountry={'ae'}
                  // countriesList={countriesList}
                  autoFormat={false}
                  textStyle={{
                    fontSize: 14,
                    color: theme.darkestBlue,
                  }}
                  style={{
                    width: 20,
                  }}
                />
                <Input
                  editable={false}
                  returnKeyLabel={'Done'}
                  returnKeyType={'done'}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholderTextColor={theme?.textGrey}
                  mainViewStyles={{
                    width: '85%',
                    marginLeft: 20,
                  }}
                  inputViewStyles={{
                    borderColor:
                      focused == 'phone'
                        ? theme?.logoColor
                        : theme?.inputBorder,
                    height: 46,
                    borderRadius: 8,
                  }}
                  textInputFocused={() => {
                    setFocused('phone');
                  }}
                  placeholder={'xxx xxx xxxx'}
                  control={control}
                  fieldName={'phone'}
                  errTxt={errors?.phone && errors?.phone?.message}
                  errTxtstyle={{
                    top: 46,
                    right: -13,
                    position: 'absolute',
                    color: theme.brightRed,
                    fontSize: 11,
                    alignSelf: 'flex-end',
                  }}
                  value={phone}
                  onChangeTexts={text => {
                    setPhone(text);
                  }}
                  keyboardType={'numeric'}
                  // maxLength={15}
                />
              </View>
            </View>
            <View style={{zIndex: 1000, width: '90%', marginTop: 20}}>
              <Text
                  allowFontScaling={false}

                style={{
                  marginBottom: 10,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                }}>
                User Permission
              </Text>
              <DropDownButton
                onPress={() => setAccessDropdown(!accessDropDown)}
                showDropDown={accessDropDown}
                btnContainer={{
                  paddingLeft: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme?.inputBorder,
                  width: '100%',
                  height: 46,
                  justifyContent: 'center',
                }}
                label={accessLable == '' ? 'Select Access' : accessLable}
                labelStyle={{
                  color: accessLable == '' ? theme?.greyText : theme?.black,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}
              />
              {accessDropDown && (
                <View
                  style={{
                    position: 'absolute',
                    top: 70,
                    width: '100%',
                    maxHeight: 120,
                  }}>
                  <FlatList
                    nestedScrollEnabled={true}
                    data={accessArray}
                    showsVerticalScrollIndicator={false}
                    style={{
                      backgroundColor: theme?.white,
                      maxHeight: 120,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      width: '100%',
                      borderWidth: 0.7,
                      borderColor: theme?.inputBorder,
                      zIndex: 9999,
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderOptions}
                    bounces={false}
                    contentContainerStyle={{
                      paddingEnd: 20,
                    }}
                  />
                </View>
              )}
            </View>

            {props?.route?.params?.from == 'Edit' && (
              <View
                style={{
                  width: '90%',
                  marginVertical: 20,
                  paddingHorizontal: 2,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text
                  allowFontScaling={false}

                  style={{
                    marginBottom: 10,
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                  }}>
                  Status
                </Text>
                <RadioButtonsGroup
                  radioButtons={radioButtons}
                  onPress={setSelectedId}
                  selectedId={selectedId}
                  layout="row"
                  containerStyle={{}}
                />
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            width: screenWidth * 0.9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {props?.route?.params?.from == 'Edit' ? (
            <SubmitButton
              btnContainer={{
                height: 48,
                width: '45%',
                backgroundColor: theme?.greyText,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                alignSelf: 'center',
              }}
              btnText="Delete"
              btnTextStyle={{
                color: theme?.white,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}
              onPress={() => {
                setPopType('delete');
                setShow(true);
              }}
            />
          ) : (
            <SubmitButton
              btnContainer={{
                height: 48,
                width: '45%',
                backgroundColor: theme?.greyText,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                alignSelf: 'center',
              }}
              btnText="Cancel"
              btnTextStyle={{
                color: theme?.white,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}
              onPress={() => {
                props?.navigation?.goBack();
              }}
            />
          )}
          {props?.route?.params?.from == 'Edit' ? (
            <SubmitButton
              btnContainer={{
                height: 48,
                width: '45%',
                backgroundColor: theme?.logoColor,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                alignSelf: 'center',
              }}
              btnText={'Update'}
              btnTextStyle={{
                color: theme?.white,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}
              onPress={() => {
                if (selectedId == '2') {
                  setPopType('disable');
                  setShow(true);
                } else {
                  props?.navigation?.goBack();
                }
              }}
            />
          ) : (
            <SubmitButton
              btnContainer={{
                height: 48,
                width: '45%',
                backgroundColor: theme?.logoColor,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                alignSelf: 'center',
              }}
              btnText={'Add'}
              btnTextStyle={{
                color: theme?.white,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}
              onPress={handleSubmit(addnewUser)}
            />
          )}
        </View>
      </View>
      <ConfirmationPopup
        btnTxtLabel={'No'}
        btnTxtLabel1={'Yes'}
        show={show}
        onClose={() => {
          setShow(false);
        }}
        confirmationHeading={`Are you sure you want to ${popType} this user?`}
        confirmationText={'The user can no longer manage the properties'}
        onTouchOutside={() => {
          setShow(false);
        }}
        onPressNo={() => {
          setShow(false);
        }}
        onPressYes={() => {
          setShow(false);
        }}
      />
      <CountryPicker
        show={showCountries}
        lang={'en'}
        style={{
          modal: {
            height: '60%',
            paddingBottom: 50,
          },
          dialCode: {
            // backgroundColor:'red',
            color: theme?.black,
          },
          countryName: {
            // backgroundColor:'red',
            color: theme?.black,
          },
          flag: {
            color: 'black',
          },
        }}
        onBackdropPress={() => {
          setShowCountries(false);
        }}
        inputPlaceholder={'Search'}
        pickerButtonOnPress={item => {
          setPhoneCode(item?.dial_code);
          setPhone('');
          phone_ref.current.selectCountry(item?.code.toLowerCase());

          setShowCountries(false);
        }}
        excludedCountries={excludedCountries}
      />
      {loadingMark && <Loader />}
    </View>
  );
};
export default AddAndUpdateUser;
