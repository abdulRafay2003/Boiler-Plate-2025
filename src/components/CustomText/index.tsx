import React, {ReactNode} from 'react';
import {
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  TextProps,
  I18nManager,
} from 'react-native';
import {Colors, FontType} from '@/config/index';
import {FONT_FAMILY} from '@/constants/fontFamily';

type CustomTextProps = TextProps & {
  children: ReactNode;
  customStyle?: StyleProp<TextStyle>;
  isSecondaryColor?: boolean;
};

const ExtraLargeBoldText = ({
  children,
  customStyle,
  isSecondaryColor,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.ExtraLargeBoldText,
        {
          color: isSecondaryColor ? Colors.greyColor : Colors.black,
        },
        customStyle,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

const LargeBoldText = ({
  children,
  customStyle,
  isSecondaryColor,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.LargeBoldText,
        {
          color: isSecondaryColor ? Colors.greyColor : Colors.black,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

const LargeSemiBoldText = ({
  children,
  customStyle,
  isSecondaryColor,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.LargeSemiBoldText,
        {
          color: isSecondaryColor ? Colors.greyColor : Colors.black,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

const MediumText = ({
  children,
  customStyle,
  isSecondaryColor,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.MediumText,
        {
          color: isSecondaryColor ? Colors.greyColor : Colors.black,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

const RegularText = ({
  children,
  customStyle,
  isSecondaryColor,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.RegularText,
        {
          color: isSecondaryColor ? Colors.greyColor : Colors.black,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};
const SmallText = ({
  children,
  customStyle,
  isSecondaryColor,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.SmallText,
        {
          color: isSecondaryColor ? Colors.greyColor : Colors.black,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};
const ExtraSmallText = ({
  children,
  customStyle,
  isSecondaryColor,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.ExtraSmallText,
        {
          color: isSecondaryColor ? Colors.greyColor : Colors.black,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

export default {
  ExtraLargeBoldText,
  LargeBoldText,
  LargeSemiBoldText,
  MediumText,
  RegularText,
  SmallText,
  ExtraSmallText,
};

const styles = StyleSheet.create({
  ExtraLargeBoldText: {
    fontFamily: FONT_FAMILY['IBMPlexBold'],
    fontSize: FontType.FontExtraLarge,
  },
  LargeBoldText: {
    fontFamily: FONT_FAMILY['IBMPlexBold'],
    fontSize: FontType.FontLarge,
  },
  LargeSemiBoldText: {
    fontFamily: FONT_FAMILY['IBMPlexSemiBold'],
    fontSize: FontType.FontLarge,
  },
  MediumText: {
    fontFamily: FONT_FAMILY['IBMPlexMedium'],
    fontSize: FontType.FontMedium,
  },
  RegularText: {
    fontFamily: FONT_FAMILY['IBMPlexRegular'],
    fontSize: FontType.FontRegular,
  },
  SmallText: {
    fontFamily: FONT_FAMILY['IBMPlexRegular'],
    fontSize: FontType.FontSmall,
  },
  ExtraSmallText: {
    fontFamily: FONT_FAMILY['IBMPlexRegular'],
    fontSize: FontType.FontExtraSmall,
  },
});
