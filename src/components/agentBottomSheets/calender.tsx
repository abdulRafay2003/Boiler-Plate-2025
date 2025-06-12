import { Platform } from 'react-native';
import React, { useState } from 'react';
import BottomSheet, {
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import theme from '@/assets/stylesheet/theme';
import { SubmitButton } from '../buttons/submitButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/src/yup';
import { NoteLogsValidation } from '../Validations/validations';
interface Props {
  sheetRef?: any | null;
  snapPoints?: any | null;
  onSubmit?: any | null
}
const CalendarBottomSheet = (props: Props) => {
  const { sheetRef, snapPoints, onSubmit } = props;
  const [selected, setSelected] = useState('');
  const [time, setTime] = useState(new Date());
  const [focused, setFocused] = useState('');
  const [openTime, setOpenTime] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
} = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(NoteLogsValidation),
});

  return (
    <BottomSheet
      enablePanDownToClose={true}
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: theme?.textGrey }}
      handleStyle={{
        paddingTop: 10,
        height: 40,
      }}
      backgroundStyle={{
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,

      }}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          paddingBottom: Platform.OS == 'ios' ? 30 : 50,
        }}
        style={{ borderWidth: 0 }}>

        {/* <CalendarPicker
          textStyle={{
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
          }}
          weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
          nextTitle=">>"
          previousTitle="<<"
          customNextIcon={'jhgvcvhbjnk'}
          onDateChange={(date) => setSelected(date)}
        /> */}
        {/* <View style={{
          // backgroundColor:'red',
          width: '100%',
          height: 30,
          paddingHorizontal: 20,
          marginTop: 15
        }}>
          <Text
          allowFontScaling={false}
          style={{
            fontSize: 22,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black
          }}>
            Choose A Time
          </Text>
          <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
          <Input
            title={'Start Time'}
            titleStyles={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}
            placeholderTextColor={theme?.textGrey}
            mainViewStyles={{
              width: '45%',
              // marginTop: 20,
            }}
            inputViewStyles={{
              borderWidth: 1,
              borderColor:
                focused == 'time'
                  ? theme?.logoColor
                  : theme?.inputBorder,
              height: 46,
              borderRadius: 8,
            }}
            textInputFocused={() => {
              setFocused('time');
            }}
            placeholder={'Select Time'}
            fieldName={'title'}
            control={control}
            errTxt={errors?.time && errors?.time?.message}
            errTxtstyle={{
              top: 46,
              right: 0,
              position: 'absolute',
              color: theme.brightRed,
              fontSize: 11,
              alignSelf: 'flex-end',
            }}
            value={moment(time)?.format('h:mm a')}
            openDate={() => {
              setOpenTime(true)
            }}
            isLeftImage={true}
            leftImageSource={require('@/assets/images/icons/time.png')}
            leftImageStyle={{ width: 15, height: 15, position: 'absolute', right: 0, top: 15, marginRight: 10 }}
            rightIcon={false}
            rightIconSource={null}
            rightIconStyle={null}
            onChangeTexts={text => {
              setTime(text);
            }}
          />
           <Input
                  allowFontScaling={false}
            title={'End Time'}
            titleStyles={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}
            placeholderTextColor={theme?.textGrey}
            mainViewStyles={{
              width: '45%',
              // marginTop: 20,
            }}
            inputViewStyles={{
              borderWidth: 1,
              borderColor:
                focused == 'time'
                  ? theme?.logoColor
                  : theme?.inputBorder,
              height: 46,
              borderRadius: 8,
            }}
            textInputFocused={() => {
              setFocused('time');
            }}
            placeholder={'Select Time'}
            fieldName={'title'}
            control={control}
            errTxt={errors?.time && errors?.time?.message}
            errTxtstyle={{
              top: 46,
              right: 0,
              position: 'absolute',
              color: theme.brightRed,
              fontSize: 11,
              alignSelf: 'flex-end',
            }}
            value={moment(time)?.format('h:mm a')}
            openDate={() => {
              setOpenTime(true)
            }}
            isLeftImage={true}
            leftImageSource={require('@/assets/images/icons/time.png')}
            leftImageStyle={{ width: 15, height: 15, position: 'absolute', right: 0, top: 15, marginRight: 10 }}
            rightIcon={false}
            rightIconSource={null}
            rightIconStyle={null}
            onChangeTexts={text => {
              setTime(text);
            }}
          />
          </View>
         
        </View>
       
         <DatePicker
        modal
        open={openTime}
        date={time}
        mode='time'
        onConfirm={(time) => {
          setOpenTime(false)
          setTime(time)
        }}
        onCancel={() => {
          setOpenTime(false)
        }}
      /> */}
       <SubmitButton
          btnContainer={{
            height: 58,
            width: '90%',
            backgroundColor: theme?.logoColor,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 30,
          }}
          btnText="Filter"
          btnTextStyle={{
            color: theme?.white,
            fontSize: 14,
            fontWeight: '700',
          }}
          onPress={onSubmit}
        />
      </BottomSheetScrollView>
     
    </BottomSheet>
  )
}

export default CalendarBottomSheet