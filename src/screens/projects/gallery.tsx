import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
// import VideoPlayer from 'react-native-video-controls';
import VideoPlayer from 'react-native-video-controls';
import {TabsButton} from '@/components/formsTab';
import {Headers} from '@/components/header/headers';
// import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import Carousel from 'react-native-reanimated-carousel';
import GallerySkeleton from '@/components/skeletons/gallery';
import getYouTubeID from 'get-youtube-id';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import WebVideo from '@conquerplus/react-native-web-video';
import {ImageProgress} from '@/components/ImageProgress';
import {useSelector} from 'react-redux';
import { RootState } from '@/redux/store';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

export default function Gallery(props) {
  const [selectedImage, setSelectedImage] = useState(
    props?.route?.params?.selected,
  );
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const activeItem = useRef();
  var flatScroll = useRef();
  const albumScroll = useRef();

  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState({selectedImage});
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  // const Gallery = props?.route?.params?.obj;
  const [Gallery, setGallery] = useState([]);
  const Album = props?.route?.params?.media;
  const [playerOpen, setPlayerOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  var title = props?.route?.params?.title;
  var value = props?.route?.params?.value;
  var id = props?.route?.params?.id;
  const foccused = useIsFocused();
  useEffect(() => {
    if (flatScroll) {
      try {
        setTimeout(() => {
          flatScroll?.current?.scrollToIndex({
            animate: true,
            index: activeIndex,
          });
        }, 1000);
      } catch (error) {}
    }
  }, [activeIndex, tabIndex]);

  useEffect(() => {
    if (albumScroll) {
      try {
        setTimeout(() => {
          albumScroll?.current?.scrollToIndex({
            animate: true,
            index: tabIndex,
          });
        }, 1000);
      } catch (error) {}
    }
  }, [tabIndex]);

  useEffect(() => {
    let findIndex = Album?.findIndex(itemss => itemss.title == title);

    setGallery(Album[findIndex]?.media_items);
    setTabIndex(findIndex);

    let findIndexByValue = Album[findIndex]?.media_items?.findIndex(
      ite => ite.url == value,
    );

    setActiveIndex(findIndexByValue);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderAlbumName = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          // flatScroll?.current?.null()
          flatScroll = null;
          setTabIndex(index);
          setActiveIndex(0);
          setGallery(item?.media_items);
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: tabIndex != index ? 1 : 0,
          borderColor: theme?.lightGrey,
          width: 150,
          margin: 6,
          height: 45,
          borderRadius: 25,
          backgroundColor:
            tabIndex == index ? theme?.logoColor : theme?.transparent,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            color: tabIndex == index ? 'white' : theme.darkGrey,
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
          }}>
          {item?.type == 'gallery'
            ? item?.title?.charAt(0).toUpperCase() +
              item?.title?.slice(1)?.toLowerCase()
            : 'Videos'}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderGalleryImage = ({item, index}) => {
    var id = '';
    var url = '';
    if (item?.url?.includes('mp4')) {
      id = '';
      url = item?.url;
    } else if (item?.url?.includes('m4v')) {
      id = '';
      url = item?.url;
    } else {
      if (item?.url?.includes('vimeo')) {
        let rawurl = item?.url;
        const match = /vimeo.*\/(\d+)/i.exec(rawurl);

        if (match) {
          url = `https://player.vimeo.com/video/${match[1]}?h=ac18ec0853`;
        }
      } else {
        id = getYouTubeID(item?.url);
        url = `https://www.youtube.com/embed/${id}?rel=0&autoplay=0&showinfo=0&controls=0`;
      }
    }
    return (
      <>
        {item?.type == 'image' ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setSelectedIndex({selectedImage: item});
              setSelectedImage(item);
              setActiveIndex(index);
            }}
            style={{margin: 10}}>
            <ImageProgress
              source={
                item?.url == false
                  ? require('@/assets/images/icons/logo_PH.png')
                  : item?.url
              }
              imageStyles={{
                width: 90,
                height: 75,
                borderRadius: 10,
                opacity: Gallery[activeIndex]?.url == item?.url ? 1 : 0.7,
              }}
              imageStyle={{
                width: 90,
                height: 75,
                borderRadius: 10,
                opacity: Gallery[activeIndex]?.url == item?.url ? 1 : 0.7,
              }}
              resizeMode={'cover'}
              activityIndicatorSize={'small'}
              activityIndicatorColor={theme?.logoColor}
            />
          </TouchableOpacity>
        ) : (
          <View style={{flex: 1}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setSelectedIndex({selectedImage: item});
                setSelectedImage(item);
                setActiveIndex(index);
              }}
              style={{margin: 10}}>
              {item?.image_thumbnail ? (
                <ImageProgress
                  source={
                    item?.image_thumbnail == false
                      ? require('@/assets/images/icons/logo_PH.png')
                      : item?.image_thumbnail
                  }
                  imageStyles={{
                    width: 90,
                    height: 75,
                    borderRadius: 10,
                    opacity: Gallery[activeIndex]?.url == item?.url ? 1 : 0.7,
                  }}
                  imageStyle={{
                    width: 90,
                    height: 75,
                    borderRadius: 10,
                    opacity: Gallery[activeIndex]?.url == item?.url ? 1 : 0.7,
                  }}
                  resizeMode={'cover'}
                  activityIndicatorSize={'small'}
                  activityIndicatorColor={theme?.logoColor}
                />
              ) : (
                <ImageProgress
                  source={require('@/assets/images/icons/logo_PH.png')}
                  imageStyles={{
                    width: 90,
                    height: 75,
                    borderRadius: 10,
                    opacity: Gallery[activeIndex]?.url == item?.url ? 1 : 0.7,
                  }}
                  imageStyle={{
                    width: 90,
                    height: 75,
                    borderRadius: 10,
                    opacity: Gallery[activeIndex]?.url == item?.url ? 1 : 0.7,
                  }}
                  resizeMode={'cover'}
                  activityIndicatorSize={'small'}
                  activityIndicatorColor={theme?.logoColor}
                />
              )}
              <Image
                source={require('@/assets/images/icons/videoIcon.png')}
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  tintColor: 'white',
                  alignSelf: 'center',
                  top: 20,
                  zIndex: 9999,
                  opacity: Gallery[activeIndex]?.url == item?.url ? 1 : 0.3,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  const renderGalleryItems = ({item}) => {
    var id = '';
    var url = '';
    if (item?.url?.includes('mp4')) {
      id = '';
      url = item?.url;
    } else if (item?.url?.includes('m4v')) {
      id = '';
      url = item?.url;
    } else {
      if (item?.url?.includes('vimeo')) {
        let rawurl = item?.url;
        const match = /vimeo.*\/(\d+)/i.exec(rawurl);

        if (match) {
          url = `https://player.vimeo.com/video/${match[1]}?h=ac18ec0853`;
        }
      } else {
        id = getYouTubeID(item?.url);
        url = `https://www.youtube.com/embed/${id}?rel=0&autoplay=0&showinfo=0&controls=0`;
      }
    }

    return (
      <>
        {item?.type == 'image' ? (
          <>
            {item.url ? (
              <ImageProgress
                source={item?.url}
                imageStyles={{
                  width: screenWidth,
                  height: 400,
                }}
                imageStyle={{width: screenWidth, height: 400}}
                activityIndicatorSize={'small'}
                activityIndicatorColor={theme?.logoColor}
              />
            ) : (
              <Image
                source={require('@/assets/images/icons/logo_PH.png')}
                style={{
                  width: screenWidth,
                  height: 400,
                }}
              />
            )}
          </>
        ) : (
          <TouchableOpacity
            onPress={() => {
              props?.navigation?.navigate('VideoPlayer', {
                url: url,
                name: 'Video',
                lat: props?.route?.params?.lat,
                lng: props?.route?.params?.lng,
                projectTitle: props?.route?.params?.projectTitle,
                id: props?.route?.params?.id,
              });
            }}>
            {item?.image_thumbnail ? (
              <ImageProgress
                source={item?.image_thumbnail}
                imageStyles={{height: 400, width: screenWidth}}
                activityIndicatorSize={'small'}
                activityIndicatorColor={theme?.logoColor}
              />
            ) : (
              <Image
                source={require('@/assets/images/icons/logo_PH.png')}
                style={{height: 400, width: screenWidth}}
              />
            )}
            <Image
              source={require('@/assets/images/icons/videoIcon.png')}
              style={{
                height: 60,
                width: 60,
                tintColor: 'white',
                alignSelf: 'center',
                top: 170,
                position: 'absolute',
                zIndex: 999,
              }}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme?.white}}>
      <StatusBar barStyle={'dark-content'} translucent={true} />
      <Headers
        bgStyles={{
          backgroundColor: theme?.white,
          height: 100,
          width: screenWidth,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          justifyContent: 'center',
        }}
        internalViewStyles={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingHorizontal: 10,
          height: 80,
          // top:20
        }}
        backArrowViewStyles={{
          width: 47,
          height: 47,
          borderRadius: 47 / 2,
          backgroundColor: theme?.logoColor,
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
        heading={'Gallery'}
        headingViewStyles={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
        headingStyles={{
          color: theme?.logoColor,
          fontSize: 20,
          fontFamily: FONT_FAMILY?.IBMPlexBold,
          marginLeft: 10,
        }}
        onBackArrowPress={() => {
          flatScroll = null;
          navigation.goBack();
        }}
        onNotificationPress={() => {
          navigation?.navigate('Notification');
        }}
        notificationIcon={false}
      />
      {loading ? (
        <GallerySkeleton />
      ) : (
        <>
          <View
            style={{
              marginTop: 10,
            }}>
            <FlatList
              ref={albumScroll}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{}}
              numColumns={1}
              horizontal={true}
              data={Album}
              renderItem={renderAlbumName}
              onScrollToIndexFailed={info => {
                if (albumScroll) {
                  const wait = new Promise(resolve =>
                    setTimeout(resolve, 1500),
                  );
                  wait.then(() => {
                    albumScroll?.current?.scrollToIndex({
                      animate: true,
                      index: info?.index,
                    });
                  });
                }
              }}
            />
          </View>
          <View style={{marginTop: 18}}>
            <Carousel
              ref={activeItem}
              loop={false}
              width={screenWidth}
              height={400}
              autoPlay={false}
              data={Gallery}
              style={{}}
              scrollAnimationDuration={1000}
              onSnapToItem={index => {
                setActiveIndex(index);
              }}
              defaultIndex={activeIndex}
              renderItem={renderGalleryItems}
            />
          </View>
          <View
            style={{
              marginTop: 18,
            }}>
            <FlatList
              ref={flatScroll}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{}}
              numColumns={1}
              horizontal={true}
              data={Gallery}
              // initialScrollIndex={activeIndex}
              renderItem={renderGalleryImage}
              onScrollToIndexFailed={info => {
                if (flatScroll) {
                  const wait = new Promise(resolve =>
                    setTimeout(resolve, 1500),
                  );
                  wait.then(() => {
                    flatScroll?.current?.scrollToIndex({
                      index: info?.index,
                      animated: true,
                    });
                  });
                }
              }}
            />
          </View>
        </>
      )}
      <View
        style={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme?.greyText,
          height: 1,
          width: screenWidth * 0.93,
          alignSelf: 'center',
          marginTop: 10,
        }}></View>
      {userData?.role == 'guest' && (
        <TabsButton
          disabledEnquiryTap={loading}
          mainViewStyling={{
            backgroundColor: theme?.white,
            alignSelf: 'center',
            width: screenWidth * 0.95,
            position: 'absolute',
            bottom: 0,
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingBottom: 20,
            paddingTop: 21,
          }}
          enquiryPress={() => {
            props?.navigation?.navigate('Enquiry', {
              data: {
                lat: props?.route?.params?.lat,
                lng: props?.route?.params?.lng,
                unitType: '',
                floorPlan: '',
                projectTitle: props?.route?.params?.projectTitle,
                id: props?.route?.params?.id,
              },
            });
          }}
        />
      )}
    </View>
  );
}
