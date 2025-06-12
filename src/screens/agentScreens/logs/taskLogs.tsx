import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Platform,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Input} from '@/components/TextInput/Input';
import {useForm} from 'react-hook-form';
import {
  NoteLogsValidation,
  TaskLogsValidation,
} from '@/components/Validations/validations';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import moment from 'moment';
import {SubmitButton} from '@/components/buttons/submitButton';
import DatePicker from 'react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DropDownButton} from '@/components/buttons/dropDownButton';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import axios, {AxiosError} from 'axios';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import {AttachmentPopup} from '@/components/modal/attachmentPopup';
import AssociateLeadBottomSheet from '@/components/agentBottomSheets/associateLead';
import {TabRouter} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {DropDownButtonYup} from '@/components/buttons/dropDownYup';
import {SubmittedPopup} from '@/components/modal/submittedPopup';
import {postNotesApi} from '@/services/apiMethods/createNotes';
import {allLeadsSearchApi} from '@/services/apiMethods/leadsApis';
import {Loader} from '@/components/loader';
import {useDispatch, useSelector} from 'react-redux';
import {deleteImageApi} from '@/services/apiMethods/uploadImage';
import {ConfirmationPopup} from '@/components/modal/confirmationPopup';
import {AlertPopup} from '@/components/modal/alertPopup';
import {BASE_URL_GJ} from '@/services/mainServices/config';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import { dispatchToStore, RootState } from '@/redux/store';
import { setUserDetail } from '@/redux/slice/UserSlice/userSlice';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const TaskLogs = props => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '1%', '70%'], []);
  const currentDate = new Date();
  const dataFound = useSelector((state: RootState) => state?.user?.dropdownData);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState();
  const [noteDetails, setNoteDetails] = useState('');
  const [focused, setFocused] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [typeDropDown, setTypeDropDown] = useState(false);
  const [showThankyou, setShowThankyou] = useState(false);
  const [typeLable, setTypeLabel] = useState('');
  const [endTime, setEndTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState();
  const [endOpenTime, setEndOpenTime] = useState(false);
  const [directionDropDown, setDirectionDropDown] = useState(false);
  const [directionLable, setDirectionLabel] = useState('');
  const [showSelectAttachment, setShowSelectAttachment] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [errorView, setErrorView] = useState(false);
  const [selectLabel, setSelectLabel] = useState('');
  const [activeState, setActiveState] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [tempLeadArr, setTempLeadArr] = useState([]);
  const [holderArray, setHolderArray] = useState([]);
  const [loadingMark, setLoadingMark] = useState(false);
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [messageView, setMessageView] = useState('');
  const [allLeadsSkeleton, setAllLeadsSkeleton] = useState(true);
  const [selectedLeadsArray, setSelectedLeadsArray] = useState([]);
  const [images, setImages] = useState([]);
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const [deleteIcon, setDeleteIcon] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const [showPopup, setShowPoup] = useState(false);
  const [apiResponnseErrors, setApiResponseMessageView] = useState('');
  const [typeDropDownOptions, setTypeDropDownOptions] = useState(
    dataFound?.TASK_STATUS,
  );
  const [directionDropDownOptions, setDirectionDropDownOptions] = useState([
    {id: 1, title: 'Incoming'},
    {id: 2, title: 'Outgoing'},
  ]);
  const [logListing, setLogListing] = useState([]);
  const [apiCrash, setApiCrash] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(TaskLogsValidation),
  });
  useEffect(() => {
    if (focused != 'type') {
      setTypeDropDown(false);
    } else {
      Keyboard?.dismiss();
    }
  }, [focused]);
  useEffect(() => {
    setValue('date', selectedDate);
    setValue('time', selectedTime);
    setValue('endTime', selectedEndTime);
    setValue('selectedLeadsArray', selectedLeadsArray);
  });
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      backHandler.remove();
    };
  }, [images]);
  const handleBackButtonClick = () => {
    if (uploading == true) {
      setShowAlert(true);
    } else {
      if (images?.length > 0) {
        setShowPoup(true);
      } else {
        props?.navigation.goBack();
      }
    }
    return true;
  };
  const renderOptions = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setTypeLabel(item);
          setTypeDropDown(false);
          setValue('typeLable', item?.title);
          trigger('typeLable');
        }}
        activeOpacity={0.8}
        style={{
          width: '100%',
          paddingVertical: 8,
          justifyContent: 'center',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme?.textGrey,
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            alignSelf: 'flex-start',
            // marginLeft: 15,
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            marginBottom: 5,
          }}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      multiple: false,
      selectionLimit: 0,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let temp = [];
        response?.assets?.map(item => {
          temp?.push(item);
        });
        if (images?.length > 0) {
          setImages([...images, ...temp]);
          uploadImages([...images, ...temp]);
        } else {
          setImages(temp);
          uploadImages(temp);
        }
      }
    });
  };
  const openDocumentPicker = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
        type: DocumentPicker?.types?.allFiles,
      });

      if (response[0]?.size <= 100000000) {
        let temp = [];
        response?.map(item => {
          temp?.push(item);
        });
        if (images?.length > 0) {
          setImages([...images, ...temp]);
          uploadImages([...images, ...temp]);
        } else {
          setImages(temp);
          uploadImages(temp);
        }
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteImage = index => {
    const updatedImages = [...selectedImage];
    updatedImages.splice(index, 1);
    setSelectedImage(updatedImages);
  };
  const openBottomSheet = () => {
    if (sheetRef?.current) {
      getAllLeadsSearch('firstRender', 1);
      sheetRef?.current.expand();
      setTempLeadArr(selectedLeadsArray);
    }
  };
  const searchText = searchString => {
    try {
      const searchData = holderArray?.filter(item => {
        const itemData = item?.activityName?.toLowerCase();
        const textData = searchString?.toLowerCase();
        return itemData?.startsWith(textData) || itemData?.includes(textData);
      });
      if (searchData?.length > 0) {
        setLogListing(searchData);
      } else {
        setLogListing([]);
      }
    } catch (error) {
      console.log('errorSeacrhessss', error);
    }
  };
  const deleteSelectedLeads = index => {
    const updatedLeads = [...selectedLeadsArray];
    updatedLeads.splice(index, 1);
    setErrorView(true);
    setSelectedLeadsArray(updatedLeads);
  };
  const renderLogListing = ({item, index}) => {
    let findItem = tempLeadArr?.find(items => {
      return item?.id == items?.id;
    });

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          let tempArr = [];
          let findIndex = tempLeadArr?.findIndex(itemF => {
            return item?.id == itemF?.id;
          });
          let find = tempLeadArr?.find(itemF => {
            return item?.id == itemF?.id;
          });
          if (find?.id == undefined) {
            tempArr?.push(item);
          } else {
            setTempLeadArr([...tempLeadArr?.splice(findIndex, 1)]);
          }
          if (tempLeadArr?.length > 0) {
            setTempLeadArr([...tempLeadArr, ...tempArr]);
          } else {
            setTempLeadArr(tempArr);
          }
        }}>
        <View
          style={{
            borderBottomWidth: 0.6,
            borderBottomColor: theme?.greyText,
            paddingBottom: 10,
            margin: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: '62%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderRadius: 3,
                justifyContent: 'center',
              }}>
              {/* <View
                style={{
                  width: 9,
                  height: 9,
                  backgroundColor:
                    // tempLeadArr?.includes(item) == true
                    findItem != undefined ? theme?.black : theme?.transparent,
                  borderRadius: 9 / 2,
                  alignSelf: 'center',
                }}></View> */}
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={require('@/assets/images/icons/tick.png')}
                  style={{
                    height: 12,
                    width: 12,
                    tintColor:
                      findItem != undefined
                        ? theme?.logoColor
                        : theme?.transparent,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.black,
                left: 10,
              }}>
              {item?.title}
            </Text>
          </View>

          <Text
            allowFontScaling={false}
            style={{
              fontSize: 12,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.textGrey,
            }}>
            Date: {moment(item?.startDate)?.format('DD MMM YYYY')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const showErrorMessage = () => {
    if (
      (errors && errors?.desc?.message) ||
      (errors && errors?.title?.message) ||
      (errors && errors?.typeLable?.message)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const onSubmit = async () => {
    setLoadingMark(true);
    let tempArr = [];
    let tempArrAtaach = [];
    selectedLeadsArray?.map(itemF => {
      tempArr?.push(itemF?.id);
    });
    images?.map(itemx => {
      tempArrAtaach?.push({filename: itemx?.uploadedName});
    });
    try {
      var payLoad = {
        title: title,
        type: 'TASK',
        status: typeLable == '' ? null : typeLable?.id,
        endTime:
          selectedEndTime == null
            ? null
            : moment(selectedEndTime)?.format('hh:mm a'),
        message: noteDetails,
        startTime:
          selectedTime == null ? null : moment(selectedTime)?.format('hh:mm a'),
        completedDate: selectedDate == null ? null : selectedDate,
        leadId: tempArr,
        attachments: tempArrAtaach,
      };
      const responseNotes = await postNotesApi(payLoad);
      setMessageView(responseNotes?.message);
      if (responseNotes) {
        setShowThankyou(true);
        setTimeout(() => {
          setShowThankyou(false);
          props?.navigation?.goBack();
        }, 1000);
      }
      setLoadingMark(false);
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setApiResponseMessageView('Unable to create task logs at the moment.');
      } else {
        setApiResponseMessageView(error?.response?.data?.message);
      }
      setLoadingMark(false);
    }
  };
  const submitAddLeads = () => {
    let arr = [...tempLeadArr];
    let arr2 = [...new Set(arr)];
    setSelectedLeadsArray(arr2);
    setValue('selectedLeadsArray', arr2);
    trigger('selectedLeadsArray');
    sheetRef?.current?.close();
    setSearchValue('');
  };
  const getAllLeadsSearch = async (text, pageNumber) => {
    try {
      if (pageNumber <= 1) {
        setAllLeadsSkeleton(true);
      }
      var payLoad;
      if (text == 'firstRender') {
        payLoad = `?pageSize=${8}&pageNumber=${pageNumber}`;
      } else if (text?.length > 0) {
        payLoad = `?title=${text}&pageSize=${8}&pageNumber=${pageNumber}`;
      } else {
        payLoad = `?pageSize=${8}&pageNumber=${pageNumber}`;
      }
      const responseAllleadsSearch = await allLeadsSearchApi(payLoad);

      // setLogListing(responseAllleadsSearch?.data?.rowData);
      if (responseAllleadsSearch?.data?.rowData?.length > 0) {
        if (pageNumber > 1) {
          let merge = [...logListing, ...responseAllleadsSearch?.data?.rowData];
          setLogListing(merge);
          setLength(responseAllleadsSearch?.data?.count);
          setAllLeadsSkeleton(false);
        } else {
          setLogListing(responseAllleadsSearch?.data?.rowData);
          setLength(responseAllleadsSearch?.data?.count);
          setAllLeadsSkeleton(false);
        }
      } else {
        setAllLeadsSkeleton(false);
        setLength(0);
        if (pageNumber <= 1) {
          setLogListing([]);
        }
        setPage(1);
      }
      setApiCrash(false);
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setAllLeadsSkeleton(false);
        setLogListing([]);
        setApiCrash(true);
        setLength(0);
      }
    }
  };
  const deleteImages = async name => {
    try {
      var payLoad = {
        filename: name,
      };
      let arr = [...images];
      let find = arr?.findIndex(itemF => {
        return itemF?.uploadedName == name;
      });
      if (find >= 0) {
        arr[find].uploading = true;
        arr[find].statusUploaded = false;
        setImages(arr);
      }
      const responseDelete = await deleteImageApi(payLoad);
      if (responseDelete?.statusCode == 200) {
        setDeleteIcon(false);
        let arr = [...images];
        let find = arr?.findIndex(itemF => {
          return itemF?.uploadedName == name;
        });
        if (find >= 0) {
          arr.splice(find, 1);
          setImages(arr);
          setDeleteIcon(false);
        }
      } else {
        arr[find].uploading = false;
        arr[find].statusUploaded = true;
        setImages(arr);
      }
    } catch (err) {
      let arr = [...images];
      let find = arr?.findIndex(itemF => {
        return itemF?.uploadedName == name;
      });
      if (find >= 0) {
        arr[find].uploading = false;
        arr[find].statusUploaded = true;
        setImages(arr);
      }
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      console.log('deleteError', error?.response?.data?.message);
    }
  };
  const deleteImagesPOPUP = async () => {
    setLoadingMark(true);
    const uploadPromises = images.map(image => {
      return new Promise(async (resolve, reject) => {
        var payLoad = {
          filename: image?.uploadedName,
        };

        try {
          const responseDelete = await deleteImageApi(payLoad);
          resolve(responseDelete);
        } catch (err) {
          const error = err as AxiosError;
          if (error?.response?.status == 401) {
            dispatchToStore(setUserDetail({role: 'guest'}));
            props?.navigation?.navigate('Login');
          }
          console.log('errorImageInfo', err?.response);
        }
      });
    });
    Promise.all(uploadPromises)
      .then(urls => {
        setLoadingMark(false);
        setTimeout(() => {
          props?.navigation?.goBack();
        }, 200);
      })

      .catch(error => {
        console.log('Error uploading images:', error);
      });
  };

  const uploadImages = async imageUrl => {
    setUploading(true);
    const updatedImages = imageUrl.map(image => ({
      ...image,
      cancelSource: axios.CancelToken.source(),
    }));
    setImages(updatedImages);

    const uploadPromises = updatedImages.map(async (image, index) => {
      if (image?.uploadedName == undefined && !image.uploading) {
        if (image?.uploadedName == undefined) {
          const formData = new FormData();
          formData.append('file', {
            uri: Platform.OS == 'ios' ? image.uri : image.uri,
            type: Platform.OS == 'ios' ? image.mime : image.type,
            name:
              image?.fileName != undefined
                ? `${
                    image?.fileName?.substring(0, 3) +
                    image?.fileName?.slice(image?.fileName?.length - 6)
                  }`
                : `${
                    image?.name?.substring(0, 3) +
                    image?.name?.slice(image?.name?.length - 6)
                  }`,
          });
          try {
            // Update upload status for the current image
            setImages(prevImages =>
              prevImages.map((prevImage, i) =>
                i === index
                  ? {...prevImage, uploading: true, statusUploaded: false}
                  : prevImage,
              ),
            );

            const response = await axios.post(
              `${BASE_URL_GJ}/file/image`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data;',
                  Authorization: 'Bearer ' + userData?.token?.access_token,
                },
                onUploadProgress: progressEvent => {
                  const uploadProgress =
                    (progressEvent.loaded / progressEvent.total) * 100;
                  setProgress(
                    prevProgress =>
                      prevProgress +
                      (1 / updatedImages.length) * uploadProgress,
                  );
                },
                cancelToken: image.cancelSource.token,
              },
            );

            // Update upload status for the current image
            setImages(prevImages =>
              prevImages.map((prevImage, i) =>
                i === index
                  ? {
                      ...prevImage,
                      uploading: false,
                      statusUploaded: true,
                      uploadedName: response?.data?.data?.name,
                    }
                  : prevImage,
              ),
            );
            setUploading(false);
          } catch (error) {
            setUploading(false);
            const err = error as AxiosError;
            console.log('imageeErrrorrrWhike', err?.response?.data);
            // Handle error
          }
        }
      }
    });
  };
  const handleCancelUpload = item => {
    // Cancel ongoing requests for each image

    let cancelArr = [...images];
    images.forEach((image, index) => {
      if (image.uploading && image.cancelSource) {
        image.cancelSource.cancel(
          `Upload canceled for image at index ${index}`,
        );
      }
    });
    // Reset state
    let Find = cancelArr?.findIndex(itemC => {
      return itemC?.fileName == item?.fileName;
    });
    if (Find >= 0) {
      cancelArr?.splice(Find, 1);
      setImages(cancelArr);
    }
    setUploading(false);
    setProgress(0);
  };

  return (
    <>
      <View
        onStartShouldSetResponder={() => {
          Keyboard?.dismiss();
          setTypeDropDown(false);
          setFocused('');
          if (sheetRef?.current) {
            setSearchValue('');
            sheetRef?.current?.close();
          }
        }}
        style={{flex: 1, backgroundColor: theme?.white}}>
        <Headers
          bgStyles={{
            backgroundColor: theme?.logoColor,
            height: 100,
            width: screenWidth,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            justifyContent: 'center',
          }}
          internalViewStyles={{
            flexDirection: 'row',

            alignItems: 'flex-end',
            paddingHorizontal: 10,
            height: 80,
          }}
          backArrowViewStyles={{
            width: 47,
            height: 47,
            borderRadius: 47 / 2,
            backgroundColor: theme?.transparentWhite,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          notificationViewStyles={{
            width: 47,
            height: 47,
            borderRadius: 47 / 2,
            backgroundColor: theme?.transparentWhite,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          notificationIconStyles={{height: 17, width: 17}}
          backArrowStyles={{
            height: 17,
            width: 10,
            tintColor: theme?.white,
            transform: [{rotate: '180 deg'}],
          }}
          heading={'Log Task'}
          headingViewStyles={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          headingStyles={{
            color: theme?.white,
            fontSize: 20,
            fontFamily: FONT_FAMILY?.IBMPlexBold,
            marginLeft: 10,
          }}
          onBackArrowPress={() => {
            if (uploading == true) {
              setShowAlert(true);
            } else {
              if (images?.length > 0) {
                setShowPoup(true);
              } else {
                props?.navigation.goBack();
              }
            }
          }}
          onNotificationPress={() => {
            props?.navigation?.navigate('Notification');
          }}
          notificationIcon={false}
        />
        <KeyboardAwareScrollView
          style={{width: screenWidth * 0.9, alignSelf: 'center'}}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <Input
            title={'Title*'}
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
            placeholder={'Enter title'}
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
          <View style={{zIndex: 1000, marginTop: 10}}>
            <Text
              allowFontScaling={false}
              style={{
                // marginBottom: 18.5,
                top: 10,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}>
              Status
            </Text>
            <DropDownButtonYup
              control={control}
              fieldName={'typeLable'}
              errors={errors?.typeLable && errors?.typeLable?.message}
              errTxtstyle={{
                color: theme.brightRed,
                fontSize: 11,
                alignSelf: 'flex-end',
              }}
              onPress={() => {
                setFocused('type');
                setTypeDropDown(!typeDropDown);
              }}
              showDropDown={typeDropDown}
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
              label={typeLable == '' ? 'Select type' : typeLable?.title}
              labelStyle={{
                color: typeLable == '' ? theme?.greyText : theme?.black,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
              }}
            />
            {typeDropDown && (
              // <View
              //   style={{
              //     position: 'absolute',
              //     top: 90,
              //     width: '100%',
              //     maxHeight: 120,
              //   }}>
              //   <FlatList
              //     nestedScrollEnabled={true}
              //     data={typeDropDownOptions}
              //     showsVerticalScrollIndicator={true}
              //     style={{
              //       backgroundColor: theme?.white,
              //       maxHeight: 120,
              //       borderBottomLeftRadius: 10,
              //       borderBottomRightRadius: 10,
              //       width: '100%',
              //       borderWidth: 0.7,
              //       borderColor:
              //         focused == 'type' ? theme?.logoColor : theme?.inputBorder,
              //       zIndex: 9999,
              //     }}
              //     showsHorizontalScrollIndicator={false}
              //     renderItem={renderOptions}
              //     bounces={false}
              //     contentContainerStyle={{
              //       paddingEnd: 20,
              //     }}
              //   />
              // </View>
              <ScrollView
                nestedScrollEnabled={true}
                style={{
                  backgroundColor: theme?.white,
                  maxHeight: 100,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  width: '100%',
                  borderWidth: 0.7,
                  borderColor:
                    focused == 'type' ? theme?.logoColor : theme?.inputBorder,
                  zIndex: 9999,
                  top: 90,
                  flex: 1,
                  position: 'absolute',
                }}
                showsVerticalScrollIndicator={false}
                bounces={false}>
                {typeDropDownOptions?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setTypeLabel(item);
                        setTypeDropDown(false);
                        setValue('typeLable', item?.title);
                        trigger('typeLable');
                      }}
                      activeOpacity={0.8}
                      style={{
                        width: '100%',
                        paddingVertical: 8,
                        justifyContent: 'center',
                        borderTopWidth:
                          index == 0 ? null : StyleSheet.hairlineWidth,
                        borderTopColor: theme?.textGrey,
                        alignItems: 'center',
                        marginHorizontal: 10,
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          alignSelf: 'flex-start',
                          // marginLeft: 15,
                          fontSize: 14,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.black,
                          marginBottom: 5,
                        }}>
                        {item?.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          <Input
            title={'Date Completed'}
            titleStyles={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}
            placeholderTextColor={theme?.textGrey}
            mainViewStyles={{
              width: '100%',
              marginTop: 10,
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
            placeholder={'Select date'}
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
            value={
              selectedDate == null
                ? date
                : moment(selectedDate).format('DD-MM-YYYY')
            }
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
              setSelectedDate(text);
            }}
          />
          <Input
            editable={false}
            title={'Start Time'}
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
            placeholder={'Select time'}
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
            value={
              selectedTime == null
                ? time
                : moment(selectedTime)?.format('HH:mm')
            }
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
            editable={false}
            title={'End Time'}
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
                focused == 'endTime' ? theme?.logoColor : theme?.inputBorder,
              height: 46,
              borderRadius: 8,
            }}
            textInputFocused={() => {
              setFocused('endTime');
            }}
            placeholder={'Select end time'}
            fieldName={'endTime'}
            control={control}
            errTxt={errors?.endTime && errors?.endTime?.message}
            errTxtstyle={{
              top: 46,
              right: 0,
              position: 'absolute',
              color: theme.brightRed,
              fontSize: 11,
              alignSelf: 'flex-end',
            }}
            value={
              selectedEndTime == null
                ? endTime
                : moment(selectedEndTime)?.format('HH:mm')
            }
            openDate={() => {
              setEndOpenTime(true);
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
              setSelectedEndTime(text);
            }}
          />
          <Input
            allowMultiline={true}
            title={'Add Task Details*'}
            titleStyles={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}
            placeholderTextColor={theme?.textGrey}
            mainViewStyles={{
              width: '100%',
              // backgroundColor:'red',
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
            placeholder={'Start typing to leave a task logs....'}
            fieldName={'desc'}
            control={control}
            errTxt={errors?.desc && errors?.desc?.message}
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
              width: screenWidth * 0.5,
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              alignSelf: 'flex-start',
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                // openImagePicker();
                setShowSelectAttachment(true);
              }}
              style={{
                width: screenWidth * 0.3,
                backgroundColor: theme?.logoColor,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  fontSize: 14,
                  color: theme?.white,
                }}>
                Attach Files
              </Text>
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                fontSize: 12,
                color: theme?.textGrey,
                left: 10,
              }}>
              {'PDF & JPEG etc.\nMaximum should be 100 mb files'}
            </Text>
          </View>
          <ScrollView
            bounces={false}
            contentContainerStyle={{
              paddingBottom: 5,
            }}
            showsVerticalScrollIndicator={false}
            style={{
              maxHeight: 150,
              marginTop: 10,
            }}>
            {images.map((image, index) => (
              <View
                key={index}
                style={{
                  marginTop: 25,
                  width: screenWidth * 0.9,
                  height: 33,
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: theme?.textGrey,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  {image.uploading && (
                    <ActivityIndicator
                      color={theme?.logoColor}
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  )}
                  {image.statusUploaded && (
                    <Image
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/7799/7799536.png',
                      }}
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  )}
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      width: screenWidth * 0.7,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      fontSize: 15,
                      color: theme?.black,
                    }}>
                    {image?.uploadedName}
                  </Text>

                  {image.uploading ? (
                    <>
                      {deleteIcon != true && (
                        <TouchableOpacity
                          disabled={deleteIcon}
                          activeOpacity={0.9}
                          onPress={() => {
                            handleCancelUpload(image);
                          }}
                          style={{
                            width: 25,
                            height: 25,
                            borderRadius: 25 / 2,
                            backgroundColor: theme?.brightRed,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Image
                            source={require('@/assets/images/icons/white_cross.png')}
                            style={{height: 12, width: 12}}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <TouchableOpacity
                      disabled={deleteIcon}
                      activeOpacity={0.9}
                      onPress={() => {
                        setDeleteIcon(true);
                        deleteImages(image?.uploadedName);
                      }}
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 25 / 2,
                        backgroundColor: theme?.logoColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('@/assets/images/icons/dustbin.png')}
                        style={{height: 12, width: 12}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              backgroundColor: theme?.lightGrey,
              // height: 50,
              paddingVertical: 17,
              borderRadius: 10,
              justifyContent: 'center',
              width: screenWidth * 0.9,
              marginTop: 20,
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',

                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.black,
                }}>
                Associate with*
              </Text>
              <TouchableOpacity
                onPress={() => {
                  openBottomSheet();
                }}
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
              </TouchableOpacity>
            </View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={{
                flexDirection: 'row',
                paddingEnd: 20,
              }}>
              {selectedLeadsArray?.map((item, index) => {
                return (
                  <View
                    style={{
                      backgroundColor: theme?.iphoneGrey,
                      paddingHorizontal: 10,
                      marginRight: 5,
                      borderRadius: 5,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.white,
                      }}>
                      {item?.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        deleteSelectedLeads(index);
                      }}
                      activeOpacity={0.9}
                      style={{
                        position: 'absolute',
                        width: 16,
                        height: 16,
                        right: -5,
                        bottom: 22,
                        backgroundColor: theme?.textGrey,
                        borderRadius: 16 / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('@/assets/images/icons/white_cross.png')}
                        style={{
                          width: 8,
                          height: 8,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          {errors && errors?.selectedLeadsArray?.message && (
            <View style={{alignSelf: 'flex-end'}}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme.brightRed,
                  fontSize: 11,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {errors?.selectedLeadsArray?.message}
              </Text>
            </View>
          )}
          {/* {apiResponnseErrors && selectedLeadsArray?.length > 0 && (
            <View style={{alignSelf: 'flex-end'}}>
              <Text
                  allowFontScaling={false}

                style={{
                  color: theme.brightRed,
                  fontSize: 11,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {apiResponnseErrors}
              </Text>
            </View>
          )} */}
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
            onPress={handleSubmit(onSubmit)}
            disabled={loadingMark}
          />
          {showErrorMessage() && (
            <View style={{alignSelf: 'flex-end'}}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme.brightRed,
                  fontSize: 11,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {'Note: Please Fill All Required Fields '}
              </Text>
            </View>
          )}
        </KeyboardAwareScrollView>

        <DatePicker
          modal
          open={open}
          date={selectedDate == null ? date : selectedDate}
          mode="date"
          minimumDate={new Date()}
          onConfirm={date => {
            setOpen(false);
            setSelectedDate(date);
            setSelectedTime(date);
            setSelectedEndTime(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <DatePicker
          modal
          locale="en_GB"
          is24hourSource={Platform.OS === 'android' ? 'locale' : 'device'}
          open={openTime}
          date={selectedTime == null ? time : selectedTime}
          minimumDate={
            moment(selectedDate).format('DD-MM-YYYY') ==
            moment(currentDate).format('DD-MM-YYYY')
              ? new Date()
              : null
          }
          mode="time"
          onConfirm={time => {
            setOpenTime(false);
            setSelectedTime(time);
            // setTime(time);
          }}
          onCancel={() => {
            setOpenTime(false);
          }}
        />
        <DatePicker
          modal
          locale="en_GB"
          is24hourSource={Platform.OS === 'android' ? 'locale' : 'device'}
          open={endOpenTime}
          date={selectedEndTime == null ? endTime : selectedEndTime}
          minimumDate={
            moment(selectedDate).format('DD-MM-YYYY') ==
            moment(currentDate).format('DD-MM-YYYY')
              ? new Date()
              : null
          }
          mode="time"
          onConfirm={time => {
            setEndOpenTime(false);
            setSelectedEndTime(time);
          }}
          onCancel={() => {
            setEndOpenTime(false);
          }}
        />
        <AttachmentPopup
          onTouchOutside={() => {
            setShowSelectAttachment(false);
          }}
          onClose={() => {
            setShowSelectAttachment(false);
          }}
          show={showSelectAttachment}
          clickPhoto={() => {
            setShowSelectAttachment(false);
            openImagePicker();
          }}
          clickDoc={() => {
            setShowSelectAttachment(false);
            openDocumentPicker();
          }}
        />
        <SubmittedPopup
          show={showThankyou}
          // thankyouText={`Log Note Has Been Created`}
          thankyouText={messageView}
        />
        <ConfirmationPopup
          btnTxtLabel={'Keep Editing'}
          btnTxtLabel1={'Discard'}
          show={showPopup}
          onClose={() => {
            setShowPoup(false);
          }}
          confirmationHeading={`Are you sure you want to discard?`}
          confirmationText={''}
          onTouchOutside={() => {
            setShowPoup(false);
          }}
          onPressNo={() => {
            setShowPoup(false);
          }}
          onPressYes={() => {
            setShowPoup(false);
            deleteImagesPOPUP();
          }}
        />
        <AlertPopup
          show={showAlert}
          onClose={() => {
            setShowAlert(false);
          }}
          onTouchOutside={() => {
            setShowAlert(false);
          }}
        />
      </View>

      <AssociateLeadBottomSheet
        onPressLog={() => {
          sheetRef?.current?.close();
          props?.navigation?.navigate('NoteLogs');
        }}
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        leadData={logListing}
        renderLeadData={renderLogListing}
        searchValue={searchValue}
        onChangeText={text => {
          if (text?.length > 0) {
            setPage(1);
            getAllLeadsSearch(text, 1);
            setSearchValue(text);
          } else {
            getAllLeadsSearch(text, 1);
            setSearchValue('');
          }
        }}
        onSubmit={() => {
          submitAddLeads();
        }}
        emptyCompo={() => {
          return (
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                width: screenWidth,
                paddingTop: 50,
              }}>
              {apiCrash ? (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.textGrey,
                  }}>
                  Unable to load data at the moment.
                </Text>
              ) : (
                <>
                  {' '}
                  <Image
                    source={require('@/assets/images/icons/smallAlert_Icon.png')}
                    style={{
                      height: 50,
                      width: 50,
                      tintColor: theme?.textGrey,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      fontFamily: FONT_FAMILY?.IBMPlexBold,
                      color: theme?.textGrey,
                    }}>
                    No new data at the moment.
                  </Text>
                </>
              )}
            </View>
          );
        }}
        footerCompo={() => {
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {logListing?.length < length ? (
                <ActivityIndicator size={'large'} color={theme?.logoColor} />
              ) : (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexBold,
                    color: theme?.textGrey,
                  }}>
                  {logListing?.length > 0 ? '' : ''}
                </Text>
              )}
            </View>
          );
        }}
        threshold={0}
        onEndReachedData={() => {
          if (logListing?.length < length) {
            getAllLeadsSearch(searchValue, page + 1);
            setPage(page + 1);
          }
        }}
        allSkeleton={allLeadsSkeleton}
      />
      <AlertPopupAuth
        show={apiResponnseErrors?.length > 0 ? true : false}
        onClose={() => {
          setApiResponseMessageView('');
        }}
        alertText={apiResponnseErrors}
        onTouchOutside={() => {
          setApiResponseMessageView('');
        }}
      />
      {loadingMark && <Loader />}
    </>
  );
};

export default TaskLogs;
