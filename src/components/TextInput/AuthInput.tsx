import theme from '@/assets/stylesheet/theme';
import React from 'react';
import {Image, View, Text, TextInput} from 'react-native';
import {Controller} from 'react-hook-form';
import {FONT_FAMILY} from '@/constants/fontFamily';
import AnimatedInput from '@/components/authInput/authInput';

interface Props {
  mainViewStyles?: any | null;
  leftIconStyles?: any | null;
  leftIconSource?: any | null;
  control?: any | null;
  fieldName?: any | null;
  placeHolderText?: any | null;
  value?: any | null;
  styleLabel?: any | null;
  styleInput?: any | null;
  styleContent?: any | null;
  errTxtstyle?: any | null;
  errTxt?: any | null;
  onChangeTexts?: any | null;
  inputViewStyles?: any | null;
  inputPlaceHolder?: any | null
}

export const ModifiedAnimatedInput = (props: Props) => {
  const {
    mainViewStyles,
    leftIconStyles,
    leftIconSource,
    control,
    fieldName,
    placeHolderText,
    value,
    styleLabel,
    styleInput,
    styleContent,
    errTxtstyle,
    errTxt,
    onChangeTexts,
    inputViewStyles,
    inputPlaceHolder
  } = props;
  return (
    <View style={mainViewStyles}>
       <View style={inputViewStyles}>
      <Image source={leftIconSource} style={leftIconStyles} resizeMode='contain' />
      <Controller
        control={control}
        name={fieldName}
        render={({field: {onChange}}) => (
          <AnimatedInput
            placeholder={placeHolderText}
            inputPlaceHolder={inputPlaceHolder}
            errorText="Error"
            onChangeText={(e:any) => {
              onChange(e), onChangeTexts && onChangeTexts(e);
            }}
            value={value}
            styleLabel={styleLabel}
            styleInput={styleInput}
            styleContent={styleContent}
            styleBodyContent={{}}
          />
        )}
      />
      </View>
      <Text allowFontScaling={false} style={errTxtstyle}>
        {errTxt}
      </Text>
    </View>
  );
};
