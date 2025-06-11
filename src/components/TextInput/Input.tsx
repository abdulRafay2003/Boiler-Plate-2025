import theme from '@/assets/stylesheet/theme';
import React from 'react';
import {Image, View, Text, TextInput, TouchableOpacity} from 'react-native';
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
  editable?: any | null;
  rightIcon?: boolean | null;
  rightIconSource?: any | null;
  rightIconStyle?: any | null;
  isLeftImage?: boolean | null;
  leftImageSource?: any | null;
  leftImageStyle?: any | null;
  openDate?: any | null;
  openEvent?: any | null;
  disableEvent?: any | null;
}

export const Input = (props: Props) => {
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
    rightIcon,
    editable,
    rightIconSource,
    rightIconStyle,
    isLeftImage,
    leftImageSource,
    leftImageStyle,
    openDate,
    openEvent,
    disableEvent,
  } = props;
  return (
    <View style={mainViewStyles}>
      {title && <Text 
          allowFontScaling={false}
      
      style={titleStyles}>{title}</Text>}
      <View style={inputViewStyles}>
        {isLeftImage ? (
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
            }}
            activeOpacity={0.9}
            onPress={openDate}>
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
            <TextInput
              returnKeyLabel={returnKeyLabel}
              returnKeyType={returnKeyType}
              ref={ref}
              onSubmitEditing={onSubmitEditing}
              style={{
                height: '100%',
                width: isLeftImage ? '90%' : '100%',
                paddingHorizontal: 10,
                color: theme?.black,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                bottom: isLeftImage ? 44 : 0,
                zIndex: isLeftImage ? -1 : null,
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
              editable={editable}
              autoCapitalize="none"
            />
          )}
        />
        {rightIcon ? (
          <Image
            source={rightIconSource}
            style={rightIconStyle}
            resizeMode="contain"
          />
        ) : null}
        <Text allowFontScaling={false} style={errTxtstyle}>
          {errTxt}
        </Text>
      </View>
    </View>
  );
};
