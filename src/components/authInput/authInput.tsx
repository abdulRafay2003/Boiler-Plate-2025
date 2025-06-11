import theme from '@/assets/stylesheet/theme';
import React, {useEffect, useRef} from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Controller} from 'react-hook-form';
import {FONT_FAMILY} from '@/constants/fontFamily';
interface Props {
  inputViewStyles?: any | null;
  textInputFocused?: any | null;
  placeholder?: any | null;
  allowMultiline?: any | null;
  control?: any | null;
  fieldName?: any | null;
  errTxt?: any | null;
  errTxtstyle?: any | null;
  value?: any | null;
  onChangeTexts?: any | null;
  keyboardType?: any | null;
  title?: any | null;
  mainViewStyles?: any | null;
  titleStyles?: any | null;
  placeholderTextColor?: any | null;
  maxLength?: any | null;
  returnKeyLabel?: any | null;
  returnKeyType?: any | null;
  onSubmitEditing?: any | null;
  blur?: any | null;
  ref?: any | null;
  secureTextEntry?: any | null;
  passwordField?: any | null;
  onPressEye?: any | null;
  isLeftImage?: any | null;
  leftImageSource?: any | null;
  leftImageStyle?: any | null;
  openDate?: any | null;
  textContentType?: any | null
}

export const AnimatedInput = (props: Props) => {
  const {
    inputViewStyles,
    textInputFocused,
    placeholder,
    allowMultiline,
    control,
    fieldName,
    errTxt,
    errTxtstyle,
    value,
    onChangeTexts,
    keyboardType,
    title,
    mainViewStyles,
    titleStyles,
    placeholderTextColor,
    maxLength,
    returnKeyLabel,
    returnKeyType,
    onSubmitEditing,
    blur,
    ref,
    secureTextEntry,
    passwordField,
    onPressEye,
    isLeftImage,
    leftImageSource,
    leftImageStyle,
    openDate,
    textContentType
  } = props;
  const moveText = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (value !== '') {
      moveTextTop();
    } else if (value === '') {
      moveTextBottom();
    }
  }, [value]);

  const moveTextTop = () => {
    Animated.timing(moveText, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const moveTextBottom = () => {
    Animated.timing(moveText, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const yVal = moveText.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -20],
  });

  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
    ],
  };
  return (
    <View style={mainViewStyles}>
      {value?.length > 0 && (
        <Animated.View
          style={[
            {
              top: 25,
              left: 10,
              position: 'absolute',
              borderRadius: 90,
              zIndex: 10000,
            },
            animStyle,
          ]}>
          <Text 
          allowFontScaling={false}
          style={titleStyles}>{title}</Text>
        </Animated.View>
      )}
      {/* {title && <Text style={titleStyles}>{title}</Text>} */}
      <View style={inputViewStyles}>
        {isLeftImage ? (
          <TouchableOpacity activeOpacity={0.9} onPress={openDate}>
            <Image
              source={leftImageSource}
              style={leftImageStyle}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
        <Controller
          control={control}
          name={fieldName}
          render={({field: {onChange}}) => (
            <View
              style={{
                flexDirection: 'row',
                height: '100%',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
              
                returnKeyLabel={returnKeyLabel}
                returnKeyType={returnKeyType}
                ref={ref}
                onSubmitEditing={onSubmitEditing}
                style={{
                  height: value?.length > 0 ? '82%' : '100%',
                  width: passwordField ? '90%' : '100%',
                  paddingHorizontal: 10,
                  color: theme?.black,
                  fontFamily: FONT_FAMILY?.RobotoRegular,
                  marginTop:
                    Platform.OS == 'ios'
                      ? value?.length > 0
                        ? 10
                        : 0
                      : value?.length > 0
                      ? 10
                      : 10,
                  top: Platform.OS == 'ios' ? 0 : 5,
                  // borderWidth:1,
                  // textAlignVertical:'center'
                }}
                value={value}
                onFocus={textInputFocused}
                keyboardType={keyboardType}
                onBlur={blur}
                placeholder={placeholder}
                allowFontScaling={false}
                multiline={allowMultiline}
                placeholderTextColor={placeholderTextColor}
                textAlignVertical="top"
                onChangeText={(e: any) => {
                  onChange(e), onChangeTexts && onChangeTexts(e);
                }}
                maxLength={maxLength}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                textContentType={textContentType}
              />
              {passwordField && (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={onPressEye}
                  style={{
                    height: '100%',
                    width: '10%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {secureTextEntry ? (
                    <Image
                      source={require('@/assets/images/icons/hide_password.png')}
                      style={{
                        height: 20,
                        width: 20,
                        marginRight: 10,
                        tintColor: theme?.primaryGrey,
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={require('@/assets/images/icons/show_password.png')}
                      style={{
                        height: 20,
                        width: 20,
                        marginRight: 10,
                        tintColor: theme?.primaryColor,
                      }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        <Text allowFontScaling={false} style={errTxtstyle}>
          {errTxt}
        </Text>
      </View>
    </View>
  );
};
