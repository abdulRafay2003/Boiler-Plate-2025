import {View, Text, Platform, Image, Dimensions} from 'react-native';
import React, {useState} from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import theme from '@/assets/stylesheet/theme';
import {SubmitButton} from '../buttons/submitButton';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Input} from '../TextInput/Input';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import {NoteLogsValidation} from '../Validations/validations';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

let screenWidth = Math.round(Dimensions.get('window').width);

interface Props {
  sheetRef?: any | null;
  snapPoints?: any | null;
  onSubmit?: any | null;
}
const NoteLogsBottomSheet = (props: Props) => {
  const {sheetRef, snapPoints, onSubmit} = props;
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(new Date());
  const [noteDetails, setNoteDetails] = useState('');
  const [focused, setFocused] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: {errors},
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
      handleIndicatorStyle={{backgroundColor: theme?.textGrey}}
      handleStyle={{
        height: 30,
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
        style={{borderWidth: 0}}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
          allowFontScaling={false}
            style={{
              fontSize: 20,
              color: theme?.black,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
            }}>
            Note Logs
          </Text>
        </View>
        <View
          style={{
            width: screenWidth * 0.9,
            alignSelf: 'center',
          }}>
          <Input
          
            title={'Title'}
            titleStyles={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}
            placeholderTextColor={theme?.textGrey}
            mainViewStyles={{
              width: '100%',
              marginTop: 20,
            }}
            inputViewStyles={{
              borderWidth: 1,
              borderColor:
                focused == 'title' ? theme?.logoColor : theme?.inputBorder,
              height: 46,
              borderRadius: 8,
            }}
            textInputFocused={() => {
              setFocused('title');
            }}
            placeholder={'Enter Title'}
            fieldName={'title'}
            control={control}
            errTxt={errors?.title && errors?.title?.message}
            errTxtstyle={{
              top: 46,
              right: 0,
              position: 'absolute',
              color: theme.brightRed,
              fontSize: 11,
              alignSelf: 'flex-end',
            }}
            value={title}
            onChangeTexts={text => {
              setTitle(text);
            }}
          />
          <Input
            title={'Date'}
            titleStyles={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}
            placeholderTextColor={theme?.textGrey}
            mainViewStyles={{
              width: '100%',
              marginTop: 20,
            }}
            inputViewStyles={{
              borderWidth: 1,
              borderColor:
                focused == 'date' ? theme?.logoColor : theme?.inputBorder,
              height: 46,
              borderRadius: 8,
            }}
            textInputFocused={() => {
              setFocused('date');
            }}
            placeholder={'Select Date'}
            fieldName={'title'}
            control={control}
            errTxt={errors?.date && errors?.date?.message}
            errTxtstyle={{
              top: 46,
              right: 0,
              position: 'absolute',
              color: theme.brightRed,
              fontSize: 11,
              alignSelf: 'flex-end',
            }}
            value={moment(date).format('DD-MM-YYYY')}
            isLeftImage={true}
            leftImageSource={require('@/assets/images/icons/calender.png')}
            leftImageStyle={{
              width: 15,
              height: 15,
              position: 'absolute',
              right: 0,
              top: 15,
              marginRight: 10,
              tintColor: theme?.black,
            }}
            openDate={() => {
              setOpen(true);
            }}
            rightIcon={false}
            rightIconSource={null}
            rightIconStyle={null}
            onChangeTexts={text => {
              setDate(text);
            }}
          />
          <Input
            title={'Time'}
            titleStyles={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}
            placeholderTextColor={theme?.textGrey}
            mainViewStyles={{
              width: '100%',
              marginTop: 20,
            }}
            inputViewStyles={{
              borderWidth: 1,
              borderColor:
                focused == 'time' ? theme?.logoColor : theme?.inputBorder,
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
              setOpenTime(true);
            }}
            isLeftImage={true}
            leftImageSource={require('@/assets/images/icons/time.png')}
            leftImageStyle={{
              width: 15,
              height: 15,
              position: 'absolute',
              right: 0,
              top: 15,
              marginRight: 10,
            }}
            rightIcon={false}
            rightIconSource={null}
            rightIconStyle={null}
            onChangeTexts={text => {
              setTime(text);
            }}
          />
          <Input
            allowMultiline={true}
            title={'Add Note Details'}
            titleStyles={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}
            placeholderTextColor={theme?.textGrey}
            mainViewStyles={{
              width: '100%',
              marginTop: 20,
            }}
            inputViewStyles={{
              borderWidth: 1,
              borderColor:
                focused == 'noteDetails'
                  ? theme?.logoColor
                  : theme?.inputBorder,
              height: 170,
              borderRadius: 8,
            }}
            textInputFocused={() => {
              setFocused('noteDetails');
            }}
            placeholder={'Start typing to leave a note logs....'}
            fieldName={'title'}
            control={control}
            errTxt={errors?.title && errors?.title?.message}
            errTxtstyle={{
              top: 170,
              right: 0,
              position: 'absolute',
              color: theme.brightRed,
              fontSize: 11,
              alignSelf: 'flex-end',
            }}
            value={noteDetails}
            onChangeTexts={text => {
              setNoteDetails(text);
            }}
          />
          <View
            style={{
              backgroundColor: theme?.lightGrey,
              height: 50,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Text
          allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.black,
                }}>
                Associate with
              </Text>
              <View
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: theme?.logoColor,
                  borderRadius: 28 / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('@/assets/images/icons/plus_icon.png')}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
              </View>
            </View>
          </View>
          <SubmitButton
            btnContainer={{
              height: 58,
              width: '100%',
              backgroundColor: theme?.logoColor,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}
            btnText="Add"
            btnTextStyle={{
              color: theme?.white,
              fontSize: 14,
              fontWeight: '700',
            }}
            onPress={onSubmit}
          />
        </View>
        <DatePicker
          modal
          open={open}
          date={date}
          mode="date"
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <DatePicker
          modal
          open={openTime}
          date={time}
          mode="time"
          onConfirm={time => {
            setOpenTime(false);
            setTime(time);
          }}
          onCancel={() => {
            setOpenTime(false);
          }}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default NoteLogsBottomSheet;
