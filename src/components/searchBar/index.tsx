import React, {useState} from 'react';
import {View, Image, TextInput, Platform, Dimensions} from 'react-native';
import {FONT_FAMILY} from '@/constants/fontFamily';
import searchStyle from '@/assets/stylesheet/search.style';
import i18next from 'i18next';
import {TouchableOpacity} from 'react-native-gesture-handler';
import theme from '@/assets/stylesheet/theme';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

interface Props {
  onChangeTexts?: any | null;
  showFilter?: boolean | null;
  placeHolder?: string | null;
  onPress?: any | null;
  filterData?: any | null;
  returnKeyType?: any | null;
  onSubmitEditing?: any | null;
  value?: any | null;
}

export const SearchBar = (props: Props) => {
  const {
    onChangeTexts,
    showFilter,
    placeHolder,
    onPress,
    filterData,
    returnKeyType,
    onSubmitEditing,
    value,
  } = props;

  return (
    <View
      style={{
        width: screenWidth,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: showFilter == false ? 5 : 30,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: showFilter == false ? '100%' : '82%',
          flexDirection: 'row',
          alignItems: 'center',
          height: 49,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme?.lightGrey,
        }}>
        <View
          style={{
            width: '12%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('@/assets/images/icons/search.png')}
            style={{height: 18, width: 18, tintColor: theme?.greyText}}
            resizeMode="contain"
          />
        </View>
        <TextInput
        allowFontScaling={false}
          value={value}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          style={{
            width: '80%',
            justifyContent: 'center',
            fontSize: 18,
            fontFamily: FONT_FAMILY.IBMPlexRegular,
            color: theme.greyText,
          }}
          placeholder={placeHolder}
          placeholderTextColor={theme.lightGrey}
          onChangeText={onChangeTexts}
        />
      </View>
      {showFilter != false ? (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={{
              alignItems: 'center',
              width: 50,
              height: 50,
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: theme?.agentUpComingBackground,
            }}>
            <Image
              source={require('@/assets/images/icons/filter.png')}
              style={{
                height: 24,
                width: 21,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};
