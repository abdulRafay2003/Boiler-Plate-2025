import {ActivityIndicator} from 'react-native';
import Image from 'react-native-image-progress';

interface Props {
  source?: any | null;
  activityIndicatorSize?: any | null;
  activityIndicatorColor?: any | null;
  imageStyles?: any | null;
  resizeMode?: any | null;
  imageStyle?: any | null;
  imageSource?: any | null;
}

export const ImageProgress = (props: Props) => {
  const {
    imageSource,
    source,
    activityIndicatorSize,
    activityIndicatorColor,
    imageStyles,
    resizeMode,
    imageStyle,
  } = props;
  return (
    <Image
      source={{uri: source}}
      // source={{ uri: source }}
      indicator={() => {
        return (
          <ActivityIndicator
            size={activityIndicatorSize}
            color={activityIndicatorColor}
          />
        );
      }}
      style={imageStyles}
      resizeMode={resizeMode}
      imageStyle={imageStyle}
    />
  );
};
