import React from 'react';
// import {useTranslation} from 'react-i18next';
import { Text, TouchableOpacity, Image } from 'react-native';
import { FONT_FAMILY } from '@/constants/fontFamily';
import theme from '@/assets/stylesheet/theme';

interface Props {
  btnContainer: any | null;
  showDropDown: boolean | null;
  onPress: any | null;
  label: string | null;
  description?: string | null;
  labelStyle?: any | null;
  control?: any | null;
  fieldName?: any | null;
  errors?: any | null;
  errTxtstyle?: any | null;

}

export const DropDownButton = (props: Props) => {
  const { btnContainer, showDropDown, onPress, label, description, labelStyle } =
    props;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[btnContainer]}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        allowFontScaling={false}
        style={[

          {
            width: '85%',
            alignSelf: 'flex-start',
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
          }, labelStyle,
        ]}>
        {label}
      </Text>
      {!description ? null : (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          allowFontScaling={false}
          style={{
            width: '85%',
            alignSelf: 'flex-start',
            fontSize: 12,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
            color: theme?.darkGrey,
          }}>
          {description}
        </Text>
      )}
      <Image
        style={{
          transform: [{ rotate: showDropDown ? '180deg' : '0deg' }],
          // top: description ? 29 : 27,
          width: 20,
          height: 20,
          position: 'absolute',
          right: 12,
        }}
        source={require('@/assets/images/icons/country_arrow.png')}
        resizeMode="contain"
      />
    </TouchableOpacity>

  )
}


