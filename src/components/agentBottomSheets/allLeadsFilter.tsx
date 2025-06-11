import {
  View,
  Text,
  Platform,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import theme from '@/assets/stylesheet/theme';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {SubmitButton} from '../buttons/submitButton';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SearchBar} from '../searchBar';
import {DropDownButton} from '../buttons/dropDownButton';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

// Hello
interface Props {
  sheetRef?: any | null;
  snapPoints?: any | null;
  onSubmit?: any | null;
  renderAllLeads?: any | null;
  allLeadsArray?: any | null;
  dropDownFocus?: any | null;
  showDropDown?: any | null;
  focused?: any | null;
  typeLable?: any | null;

  renderAllProperties?: any | null;
  allPrpertiesArray?: any | null;
  dropDownFocusProperties?: any | null;
  showDropDownProperties?: any | null;
  focusedProperties?: any | null;
  propertiesLable?: any | null;
}
const AllLeadsFilterBottomSheet = (props: Props) => {
  const {
    sheetRef,
    snapPoints,
    onSubmit,
    renderAllLeads,
    allLeadsArray,
    dropDownFocus,
    showDropDown,
    focused,
    typeLable,
    renderAllProperties,
    allPrpertiesArray,
    dropDownFocusProperties,
    showDropDownProperties,
    focusedProperties,
    propertiesLable,
  } = props;

  return (
    <BottomSheet
      enablePanDownToClose={true}
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: theme?.textGrey}}
      handleStyle={{
        height: 30,
      }}
      backgroundStyle={{
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 20,
            color: theme?.black,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
          }}>
          Filter
        </Text>
      </View>

      {/* -------------------------------Lead Status DropDown----------------------------- */}
      <View style={{zIndex: 1000, marginTop: 10, paddingHorizontal: 20}}>
        <Text
          allowFontScaling={false}
          style={{
            top: 10,
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
            color: theme?.black,
          }}>
          Lead Status
        </Text>
        <DropDownButton
          onPress={dropDownFocus}
          showDropDown={showDropDown}
          btnContainer={{
            paddingLeft: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor:
              focused == 'type' ? theme?.logoColor : theme?.inputBorder,
            marginTop: 30,
            width: screenWidth * 0.9,
            height: 46,
            justifyContent: 'center',
          }}
          label={typeLable == '' ? 'Select Status' : typeLable}
          labelStyle={{
            color: typeLable == '' ? theme?.greyText : theme?.black,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
          }}
        />
        {showDropDown && (
          <View
            style={{
              position: 'absolute',
              top: 90,
              width: '100%',
              maxHeight: 120,
            }}>
            <FlatList
              nestedScrollEnabled={true}
              data={allLeadsArray}
              showsVerticalScrollIndicator={true}
              style={{
                backgroundColor: theme?.white,
                maxHeight: 120,
                left: 21,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                width: '100%',
                borderWidth: 0.7,
                borderColor:
                  focused == 'type' ? theme?.logoColor : theme?.inputBorder,
                zIndex: 9999,
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={renderAllLeads}
              bounces={false}
              contentContainerStyle={{
                paddingEnd: 20,
              }}
            />
          </View>
        )}
      </View>

      {/* ---------------------------Properties DropDown---------------------------------- */}
      {/* <View
        style={{
          zIndex: 1,
          marginTop: 10,
          paddingHorizontal: 20,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            top: 10,
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
            color: theme?.black,
          }}>
          Properties
        </Text>
        <DropDownButton
          onPress={dropDownFocusProperties}
          showDropDown={showDropDownProperties}
          btnContainer={{
            paddingLeft: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor:
              focusedProperties == 'property'
                ? theme?.logoColor
                : theme?.inputBorder,
            marginTop: 30,
            width: screenWidth * 0.9,
            height: 46,
            justifyContent: 'center',
          }}
          label={propertiesLable == '' ? 'Select Property' : propertiesLable}
          labelStyle={{
            color: propertiesLable == '' ? theme?.greyText : theme?.black,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
          }}
        />
        {showDropDownProperties && (
          <View
            style={{
              position: 'absolute',
              top: 90,
              width: '100%',
              maxHeight: 120,
            }}>
            <FlatList
              nestedScrollEnabled={true}
              data={allPrpertiesArray}
              showsVerticalScrollIndicator={true}
              style={{
                backgroundColor: theme?.white,
                maxHeight: 120,
                left: 21,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                width: '100%',
                borderWidth: 0.7,
                borderColor:
                  focusedProperties == 'type'
                    ? theme?.logoColor
                    : theme?.inputBorder,
                // zIndex: 9999,
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={renderAllProperties}
              bounces={false}
              contentContainerStyle={{
                paddingEnd: 20,
              }}
            />
          </View>
        )}
      </View> */}
      <SubmitButton
        btnContainer={{
          height: 58,
          width: '90%',
          backgroundColor: theme?.logoColor,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 25,
        }}
        btnText="Filter"
        btnTextStyle={{
          color: theme?.white,
          fontSize: 14,
          fontWeight: '700',
        }}
        onPress={onSubmit}
      />
    </BottomSheet>
  );
};

export default AllLeadsFilterBottomSheet;
