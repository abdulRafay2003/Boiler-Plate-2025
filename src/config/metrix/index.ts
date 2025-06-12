import {Dimensions, Platform, PixelRatio} from 'react-native';
import {
  widthPercentageToDP as wp2dp,
  heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';

const {width, height}: {width: number; height: number} =
  Dimensions.get('window');
const [shortDimension, longDimension]: [number, number] =
  width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth: number = 350;
const guidelineBaseHeight: number = 680;

export const scalef = (size: number): number =>
  (shortDimension / guidelineBaseWidth) * size;

export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scalef(size) - size) * factor;

export const normalizeFont = (size: number): number => {
  // For Normalizing the font size for all type of screens, Including iPad, iPhone, Tablet, Android
  const newSize: number = moderateScale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Use this function to normalize image size
export const normalizeWithScale = (size: number): number => {
  // For Normalizing the Icon size for different screens
  return moderateScale(size, 0.4);
};

export const VerticalSize = (size: number): number => {
  // For Normalizing the Height for different screens
  return hp2dp(`${(size / 760) * 100}%`);
};

export const HorizontalSize = (size: number): number => {
  // For Normalizing the Width for different screens
  return wp2dp(`${(size / 360) * 100}%`);
};

export const createShadow = {
  shadowColor: '#000000',
  shadowOffset: {
    width: HorizontalSize(3),
    height: VerticalSize(2),
  },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: VerticalSize(20),
};

export const cardShadow = {
  shadowColor: '#000000',
  shadowOffset: {
    width: HorizontalSize(0),
    height: VerticalSize(0),
  },
  shadowOpacity: 0.5,
  shadowRadius: 5,
  elevation: VerticalSize(10),
};

export default {
  Radius: VerticalSize(10),
  LightRadius: VerticalSize(6),
  ActiveOpacity: 0.5,
  customFontSize: normalizeFont,
  customImageSize: normalizeWithScale,
  VerticalSize,
  HorizontalSize,
  createShadow,
  cardShadow,
};
