import React from 'react';
import {PixelRatio, Pressable, StyleSheet, Text, View} from 'react-native';

import {RadioButtonProps} from './types';

export default function RadioButton({
  accessibilityLabel = 'radio button',
  borderColor,
  borderSize = 2,
  color = '#444',
  containerStyle,
  description,
  descriptionStyle,
  disabled = false,
  id,
  label,
  labelStyle,
  layout = 'row',
  onPress,
  selected = false,
  size = 15,
  testID,
}: RadioButtonProps) {
  const borderWidth = PixelRatio.roundToNearestPixel(borderSize);
  const sizeHalf = PixelRatio.roundToNearestPixel(size * 0.5);
  const sizeFull = PixelRatio.roundToNearestPixel(size);

  let orientation: any = {flexDirection: 'row'};
  let margin: any = {marginLeft: 10};

  if (layout === 'column') {
    orientation = {alignItems: 'center'};
    margin = {marginTop: 10};
  }

  function handlePress() {
    if (onPress) {
      onPress(id);
    }
  }

  return (
    <>
      <Pressable
        accessibilityHint={description}
        accessibilityLabel={label || accessibilityLabel}
        accessibilityRole="radio"
        accessibilityState={{checked: selected, disabled}}
        disabled={disabled}
        onPress={handlePress}
        style={[
          styles.container,
          orientation,
          {opacity: disabled ? 0.2 : 1},
          containerStyle,
        ]}
        testID={testID}>
        <View
          style={[
            styles.border,
            {
              borderColor: borderColor || color,
              borderWidth,
              width: sizeFull,
              height: sizeFull,
              borderRadius: sizeHalf,
            },
          ]}>
          {selected && (
            <View
              style={{
                backgroundColor: color,
                width: sizeHalf,
                height: sizeHalf,
                borderRadius: sizeHalf,
              }}
            />
          )}
        </View>
        {Boolean(label) && <Text 
          allowFontScaling={false}
        style={[margin, labelStyle]}>{label}</Text>}
      </Pressable>
      {Boolean(description) && (
        <Text
        allowFontScaling={false}
        
        style={[margin, descriptionStyle]}>{description}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  border: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
