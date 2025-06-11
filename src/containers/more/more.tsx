import React from 'react';
import theme from '@/assets/stylesheet/theme';
import { FONT_FAMILY } from '@/constants/fontFamily';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

const More = props => {
  const items = [
    {title: 'About Us', parentStack: 'Menu', route: 'About'},
    {title: 'Blog', parentStack: 'Menu', route: 'BlogListing'},
    {title: 'Contact Us', parentStack: 'Menu', route: 'ContactUs'},
  ];

  const renderItems = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          borderBottomWidth: 0.2,
          borderBottomColor: theme?.white,
          height: 95,
          justifyContent: 'center',
        }}
        activeOpacity={1}
        onPress={() => {
       
        props?.navigation?.navigate('Dashboard', {
            screen:item?.parentStack,
            params: {
              screen: item?.route,
            },
          });
        }}>
        <Text 
                  allowFontScaling={false}
        
        style={{fontSize: 22, color: theme?.white,fontFamily:FONT_FAMILY?.IBMPlexMedium}}>{item?.title}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <ImageBackground
      source={require('@/assets/images/background/more_bg.png')}
      style={{flex: 1, paddingHorizontal: 15}}>
      {/* <StatusBar barStyle={'light-content'} translucent={true}  /> */}
      <View style={{top: 66, flex: 0.9}}>
        <TouchableOpacity
          style={{
            backgroundColor: theme?.transparentWhite,
            height: 47,
            width: 47,
            borderRadius: 47 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          }}>
          <Image
            source={require('@/assets/images/icons/white_cross.png')}
            style={{height: 10, width: 10}}
          />
        </TouchableOpacity>
        <View style={{marginTop: 30}}>
          <FlatList
            data={items}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={renderItems}
          />
        </View>
      </View>
    </ImageBackground>
  );
};
export default More;
