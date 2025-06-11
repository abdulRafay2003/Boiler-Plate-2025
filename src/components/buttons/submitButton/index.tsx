import React, {useState} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';

interface Props {
  btnContainer?: any | null;
  disabled?: boolean | null;
  onPress?: any | null;
  btnTextStyle?: any | null;
  btnText?: string | null;
  arrowImage?: boolean | null;
  arrowImageleft?: boolean | null;
  leftimagesource?: any | null;
  arrowImageright?: boolean | null;
  rightImgsrc?: any | null;
  darkbutton?: boolean | null;
  rightImageStyle?: any | null;
  leftImageStyle?: any | null;
}

export const SubmitButton = (props: Props) => {
  const {
    btnContainer,
    disabled,
    onPress,
    btnTextStyle,
    btnText,
    arrowImageleft,
    leftimagesource,
    arrowImageright,
    rightImgsrc,
    darkbutton,
    rightImageStyle,
    leftImageStyle,
  } = props;
  return (
    <TouchableOpacity
      style={btnContainer}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.9}>
      <View>
        {arrowImageleft ? (
          <Image
            source={leftimagesource}
            style={leftImageStyle}
            resizeMode="contain"
          />
        ) : null}
        <Text
          allowFontScaling={false}
          style={
            disabled
              ? [
                  btnTextStyle,
                  {
                    color: 'grey',
                  },
                ]
              : btnTextStyle
          }>
          {btnText}
        </Text>

        {arrowImageright ? (
          <Image
            source={rightImgsrc}
            style={rightImageStyle}
            resizeMode="contain"
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
