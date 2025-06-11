import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import moment from 'moment';
import {AttachmentViewerPopup} from '@/components/modal/attachmentViewer';
import {getProfilePicUrlApi} from '@/services/apiMethods/authApis';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  item?: any | null;
  moveLeadScreen?: any | null;
}
const ActivityLogItem = (props: Props) => {
  const {item, moveLeadScreen} = props;
  const [showMore, setShowMore] = useState(false);
  const [renderAttachData, setRenderAttachData] = useState([]);
  const [showAttachViewerPopup, setShowAttachViewerPopup] = useState(false);
  const [showLoader, setShowLoader] = useState('');
  const [downloadStart, setDownloadStart] = useState(false);
  const userData = useSelector(state => state?.user?.userDetail);
  var lines = item?.message?.split(/\r\n|\r|\n/).length;
  const dateShow = item?.createdAt ? item?.createdAt.split('T')[0] : null;
  const downloadBrochure = async name => {
    const source = await getProfilePicUrlApi(name, userData?.access_token);
    if (source) {
      const extension = name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2);
      let dirs = ReactNativeBlobUtil.fs.dirs;
      ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: extension,
        path: `${dirs.DocumentDir}/${name}.${extension}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: name,
          description: 'File downloaded by download manager.',
          mime:
            extension == 'png' ||
            extension == 'jpg' ||
            extension == 'jpeg' ||
            extension == 'heic'
              ? `image/${extension}`
              : `application/${extension}`,
        },
      })
        .fetch('GET', source)
        .then(res => {
          setDownloadStart(false);
          setShowLoader('');
          if (Platform.OS === 'ios') {
            const filePath = res.path();
            let options = {
              type: extension,
              url: filePath,
              saveToFiles: true,
            };
            Share.open(options)
              .then(resp => {
                console.log(resp);
              })
              .catch(err => console.log(err));
          } else {
          }
        })
        .catch(err => {
          console.log('BLOB ERROR -> ', err);
          setDownloadStart(false);
          setShowLoader('');
        });
    }
  };

  const renderAttachments = ({item}) => {
    return (
      <View
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
            width: 25,
            height: 25,
            borderRadius: 25 / 2,
            backgroundColor: theme?.logoColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('@/assets/images/icons/attachments.png')}
            style={{height: 12, width: 12, tintColor: theme?.white}}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (downloadStart == false) {
              setDownloadStart(true);
              setShowLoader(item?.Attachment?.filename);
              downloadBrochure(item?.Attachment?.filename);
            }
            // downloadBrochure(item?.Attachment?.filename);
            // setShowLoader(item?.Attachment?.filename);
            // downloadBrochure(item?.Attachment?.filename);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '90%',
          }}>
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
            {item?.Attachment?.filename}
          </Text>

          <View
            style={{
              width: 25,
              height: 25,
              borderRadius: 25 / 2,
              backgroundColor: theme?.logoColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {item?.Attachment?.filename == showLoader ? (
              <ActivityIndicator size={'small'} color={theme?.white} />
            ) : (
              <Image
                source={require('@/assets/images/icons/download.png')}
                style={{height: 12, width: 12, tintColor: theme?.white}}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
      <View
        style={{
          width: screenWidth * 0.89,
          borderBottomWidth: StyleSheet?.hairlineWidth,
          paddingVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              width: screenWidth * 0.67,
              color: theme?.black,
              fontSize: 18,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              flexWrap: 'wrap',
            }}>
            {item?.title}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              position: 'absolute',
              right: 0,
              top: 5,
              color: theme?.black,
              fontSize: 14,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            {dateShow ? moment(dateShow)?.format('DD/MM/YYYY') : null}
          </Text>
        </View>
        <View
          style={{
            marginTop: 5,
          }}>
          {item?.message?.length > 108 && lines < 3 ? (
            showMore == item?.id ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowMore(null)}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                  }}>
                  {item?.message}{' '}
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: theme?.logoColor,
                      fontFamily: FONT_FAMILY?.IBMPlexBold,
                    }}>
                    Show less
                  </Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowMore(item?.id)}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                  }}>
                  {`${item?.message?.slice(0, 74)}... `}{' '}
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: theme.logoColor,
                      fontFamily: FONT_FAMILY?.IBMPlexBold,
                    }}>
                    Show more
                  </Text>
                </Text>
              </TouchableOpacity>
            )
          ) : (
            <>
              {lines > 3 ? (
                showMore == item?.id ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowMore(null)}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        color: theme?.black,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      }}>
                      {item?.message}{' '}
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 14,
                          color: theme.logoColor,
                          fontFamily: FONT_FAMILY?.IBMPlexBold,
                        }}>
                        Show less
                      </Text>
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowMore(item?.id)}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        color: theme?.black,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      }}>
                      {`${item?.message?.slice(0, 15)}... `}{' '}
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 14,
                          color: theme.logoColor,
                          fontFamily: FONT_FAMILY?.IBMPlexBold,
                        }}>
                        Show more
                      </Text>
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                  }}>
                  {item?.message}
                </Text>
              )}
            </>
          )}
        </View>
        {item?.status != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Status
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.status}
            </Text>
          </View>
        )}
        {item?.location != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Location
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.location}
            </Text>
          </View>
        )}
        {item?.phone != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Phone
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.phone}
            </Text>
          </View>
        )}
        {item?.accessLevel != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Event Access
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.accessLevel}
            </Text>
          </View>
        )}
        {item?.NoteType != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Note Type
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.NoteType}
            </Text>
          </View>
        )}
        {item?.direction != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Direction
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.direction}
            </Text>
          </View>
        )}
        {item?.type != 'NOTE' && item?.completedDate != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Completed Date
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {moment(item?.completedDate)?.format('DD/MM/YYYY')}
            </Text>
          </View>
        )}
        {item?.type == 'NOTE' && item?.noteDate != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Selected Date
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {moment(item?.noteDate)?.format('DD/MM/YYYY')}
            </Text>
          </View>
        )}
        {item?.startDate != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Start Date
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {moment(item?.startDate)?.format('DD/MM/YYYY')}
            </Text>
          </View>
        )}
        {item?.type == 'NOTE' && item?.time != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Time
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.time}
            </Text>
          </View>
        )}
        {item?.type != 'NOTE' && item?.startTime != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              Start Time
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.startTime}
            </Text>
          </View>
        )}
        {item?.type != 'NOTE' && item?.endTime != undefined && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              End Time
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.greyText,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {item?.endTime}
            </Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.bottomTab,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}>
              Lead ID:
            </Text>
            <TouchableOpacity activeOpacity={0.9} onPress={moveLeadScreen}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme?.logoColor,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  width: screenWidth * 0.6,
                }}>
                {' '}
                {item?.lead?.title}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingHorizontal: 7,
              height: 28,
              borderWidth: 1,
              borderColor: theme?.logoColor,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.logoColor,
                fontSize: 13,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
              }}>
              {item?.type}
            </Text>
          </View>
        </View>
        {item?.AttachmentsOnActivities?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setRenderAttachData(item?.AttachmentsOnActivities);
              setShowAttachViewerPopup(true);
            }}
            activeOpacity={0.9}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: theme?.logoColor,
              width: screenWidth * 0.41,
              paddingHorizontal: 5,
            }}>
            <Image
              source={require('@/assets/images/icons/attachments.png')}
              style={{
                width: 14,
                height: 14,
                resizeMode: 'contain',
                tintColor: theme?.logoColor,
              }}
            />
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.logoColor,
                fontSize: 13,
                left: 5,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
              }}>
              Show Attachements
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <AttachmentViewerPopup
        show={showAttachViewerPopup}
        onClose={() => {
          setRenderAttachData([]);
          setShowAttachViewerPopup(false);
        }}
        onTouchOutside={() => {
          setRenderAttachData([]);
          setShowAttachViewerPopup(false);
        }}
        attachData={renderAttachData}
        renderAttach={renderAttachments}
      />
    </View>
  );
};

export default ActivityLogItem;
