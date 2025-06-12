import {
  View,
  Text, Dimensions,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheet/theme';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { FONT_FAMILY } from '@/constants/fontFamily';
import LinearGradient from 'react-native-linear-gradient';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  show?: any | null;
  onTouchOutside?: any | null;
  startDate?: any | null;
  onConfirmStartDate?: any | null;
  onCancelStartDate?: any | null;
  monthRef?: any | null;
  monthsList?: any | null;
  renderMonth?: any | null;
  yearRef?: any | null;
  yearList?: any | null;
  renderYear?: any | null;
  dayRef?: any | null;
  dayList?: any | null;
  renderDay?: any | null;
}

export const GroupDatePicker = (props: Props) => {
  const {
    show,
    onTouchOutside,
    startDate,
    onConfirmStartDate,
    onCancelStartDate,
    monthRef,
    yearRef,
    monthsList,
    yearList,
    renderMonth,
    renderYear,
    dayRef,
    dayList,
    renderDay,
  } = props;
  return (
    <Dialog
      visible={show}
      coverScreen={true}
      overlayBackgroundColor={'black'}
      overlayOpacity={0.8}
      animationIn="bounceInUp"
      statusBarTranslucent={true}
      height={screenHeight}
      width={screenWidth}
      dialogStyle={{
        backgroundColor: theme?.white,
        justifyContent: 'center',
      }}
      backdropTransitionOutTiming={0}>
      <DialogContent>
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth,
            position: 'absolute',
            top: screenHeight * -0.35,
          }}
          activeOpacity={1}
          onPress={onTouchOutside}></TouchableOpacity>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.9)',
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.9)',
          ]}
          style={{
            // backgroundColor: theme?.greyText,
            width: screenWidth,
            marginHorizontal: -18,
            justifyContent: 'center',
            alignItems: 'center',

            // paddingHorizontal: 30,
          }}
          useAngle={true}
          angle={90} // 90 degrees for horizontal gradient
        >
          <View
            style={{
              // backgroundColor: theme?.greyText,
              width: '99%',
              // marginLeft: -19,
              // marginVertical: 20,
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              height: 250,
            }}>
            <Text
          allowFontScaling={false}

              style={{fontSize: 24, fontFamily: FONT_FAMILY?.IBMPlexSemiBold}}>
              Start Date
            </Text>
            <View
              style={{
                height: 33,
                width: '100%',
              }}>
              <FlatList
                bounces={false}
                ref={monthRef}
                horizontal
                data={monthsList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderMonth}
                snapToAlignment={'center'}
                snapToInterval={Dimensions.get('window').width / 5}
                getItemLayout={(data, index) => ({
                  length: Dimensions.get('window').width / 5,
                  offset: (Dimensions.get('window').width / 5) * index,
                  index,
                })}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
            <View
              style={{
                // backgroundColor: theme?.brightRed,
                height: 80,
                width: '100%',
              }}>
              <FlatList
                bounces={false}
                ref={dayRef}
                horizontal
                data={dayList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderDay}
                snapToAlignment={'center'}
                snapToInterval={Dimensions.get('window').width / 5}
                getItemLayout={(data, index) => ({
                  length: Dimensions.get('window').width / 5,
                  offset: (Dimensions.get('window').width / 5) * index,
                  index,
                })}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
            <View
              style={{
                // backgroundColor: theme?.brightRed,
                height: 50,
                width: '100%',
              }}>
              <FlatList
                bounces={false}
                ref={yearRef}
                horizontal
                data={yearList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderYear}
                snapToAlignment={'center'}
                snapToInterval={Dimensions.get('window').width / 5}
                getItemLayout={(data, index) => ({
                  length: Dimensions.get('window').width / 5,
                  offset: (Dimensions.get('window').width / 5) * index,
                  index,
                })}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
          </View>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
};
