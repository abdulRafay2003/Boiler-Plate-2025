import React, {useState, useEffect, useRef} from 'react';

import {
  Image as RNImage,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  CommonActions,
  NavigationContainer,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import Home from '@/containers/Main/home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ProjectDetails from '@/containers/projects/projectDetails';
import {CircleBackButton} from '@/components/buttons/circleBackButton';
import FloorPlans from '@/containers/projects/floorPlans';
import Gallery from '@/containers/projects/gallery';
import VRTour from '@/containers/Main/vrTour';
import Notification from '@/containers/Main/notification';

import More from '@/containers/more/more';
import ContactUs from '@/containers/more/contactUs';
import BlogListing from '@/containers/more/blogListing';
import BlogDetail from '@/containers/more/blogDetails';
import About from '@/containers/more/about';
import WebView from 'react-native-webview';
import WebViews from '@/containers/Main/webView';
import EnquiryForm from '@/containers/sideScreens/enquiryForm';
import Location from '@/containers/sideScreens/location';
import MoreModal from '@/containers/more/moreModal';
import {
  setRefresh,
} from '@/redux/slice/UserSlice/userSlice';
import { dispatchToStore } from '@/redux/store';
import ApplyMortage from '@/containers/sideScreens/applyMortage';
import PrivacyScreen from '@/containers/sideScreens/privacyPolicy';
import VideoScreen from '@/containers/sideScreens/videoScreen';
import {GetWalkThrough} from '@/services/apiMethods/walkthrough';
import Login from '@/containers/auth/login';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthenticatedRoutes = props => {
  return <AuthNavigator props={'Dashboard'} />;
};
const AuthNavigator = ({props}) => {
  return (
    // <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName={'Dashboard'}>
        <Stack.Screen
          name={'Notification'}
          component={Login}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={MainTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'FloorPlans'}
          component={FloorPlans}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Gallery'}
          component={Gallery}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="More"
          component={More}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WebView"
          component={WebViews}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="VideoPlayer"
          component={VideoScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Location"
          component={Location}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Enquiry"
          component={EnquiryForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Apply"
          component={ApplyMortage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'ProjectDetails'}
          component={ProjectDetails}
          options={{headerShown: false, gestureEnabled: false}}
        />
      </Stack.Navigator>
    // </NavigationContainer>
  );
};
const MainTabs = props => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const renderTabBar = ({routeName, selectedTab, navigate}) => {
    const onNavigate = async () => {
      var guestUser = await AsyncStorage.getItem('isGuest');

      if (routeName == 'Appointment' || routeName == 'Notification') {
        if (guestUser == '1') {
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: routeName}],
            }),
          );
        }
      } else if (routeName == 'Dashboard') {
        selectedTab == 'Dashboard'
          ? navigation.dispatch(StackActions.popToTop())
          : navigate(routeName);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: routeName}],
          }),
        );
      }
    };
    return (
      <TouchableOpacity
        onPress={() => onNavigate()} //navigate(routeName)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}></TouchableOpacity>
    );
  };

  return (
    <>
      <MoreModal
        visible={show}
        onClose={() => setShow(false)}
        onNavigate={({item}) => {
          setShow(false);
          props?.navigation?.navigate(item?.parentStack, {
            screen: item?.route,
            params: {
              from: 'Home',
            },
          });
        }}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme?.bottomTab,
            height: Platform.OS == 'ios' ? 85 : 70,
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingTop: Platform.OS == 'ios' ? 10 : 0,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarLabel: ({focused}) => <></>,
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  props?.navigation?.navigate('Home', {
                    screen: 'Home',
                    merge: true,
                  });
                }}>
                <Image
                  source={require('@/assets/images/icons/Home.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? theme.logoColor : theme.white,
                  }}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    width: screenWidth >= 838 ? 33 : null,
                    height: screenHeight >= 885 ? 20 : null,
                    // backgroundColor:'red',
                    color: focused ? theme.logoColor : theme.white,
                    fontSize: 12,
                    fontFamily: focused
                      ? FONT_FAMILY?.IBMPlexMedium
                      : FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  Home
                </Text>
                <View
                  style={{
                    borderWidth: 5,
                    width: 30,
                    borderRadius: 10,
                    borderColor: focused ? theme?.logoColor : theme?.bottomTab,
                  }}></View>
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name="VRTour"
          component={VRTour}
          options={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  props?.navigation?.navigate('VRTour');
                  dispatchToStore(setRefresh(true));
                }}>
                <Image
                  source={require('@/assets/images/icons/VrTour.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? theme.logoColor : theme.white,
                  }}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    width: screenWidth >= 838 ? 52 : null,
                    height: screenHeight >= 885 ? 20 : null,
                    // backgroundColor:'red',
                    textAlign: screenWidth == 838 ? 'center' : null,
                    color: focused ? theme.logoColor : theme.white,
                    fontSize: 12,
                    fontFamily: focused
                      ? FONT_FAMILY?.IBMPlexMedium
                      : FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  VR Tour
                </Text>
                <View
                  style={{
                    borderWidth: 5,
                    width: 30,
                    borderRadius: 10,
                    borderColor: focused ? theme?.logoColor : theme?.bottomTab,
                  }}></View>
              </TouchableOpacity>
            ),
            tabBarLabel: ({focused}) => <></>,
          }}
        />
        <Tab.Screen
          name="MainDashboard"
          component={VRTour}
          options={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  props?.navigation?.navigate('VRTour');
                  dispatchToStore(setRefresh(true));
                }}>
                <Image
                  source={require('@/assets/images/icons/VrTour.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? theme.logoColor : theme.white,
                  }}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    width: screenWidth >= 838 ? 52 : null,
                    height: screenHeight >= 885 ? 20 : null,
                    // backgroundColor:'red',
                    textAlign: screenWidth == 838 ? 'center' : null,
                    color: focused ? theme.logoColor : theme.white,
                    fontSize: 12,
                    fontFamily: focused
                      ? FONT_FAMILY?.IBMPlexMedium
                      : FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  Dashboard
                </Text>
                <View
                  style={{
                    borderWidth: 5,
                    width: 30,
                    borderRadius: 10,
                    borderColor: focused ? theme?.logoColor : theme?.bottomTab,
                  }}></View>
              </TouchableOpacity>
            ),
            tabBarLabel: ({focused}) => <></>,
          }}
        />
        <Tab.Screen
          name="Menu"
          component={DashboardStack}
          listeners={{
            tabPress: e => {
              e.preventDefault();
            },
          }}
          options={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarLabel: ({focused}) => <></>,
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('@/assets/images/icons/more.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? theme.logoColor : theme.white,
                  }}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    width: screenWidth >= 838 ? 33 : null,
                    height: screenHeight >= 885 ? 20 : null,
                    // backgroundColor:'red',
                    textAlign: screenWidth == 838 ? 'center' : null,
                    color: focused ? theme.logoColor : theme.white,
                    fontSize: 12,
                    fontFamily: focused
                      ? FONT_FAMILY?.IBMPlexMedium
                      : FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  More
                </Text>
                <View
                  style={{
                    borderWidth: 5,
                    width: 30,
                    borderRadius: 10,
                    // marginTop: 3,
                    borderColor: focused ? theme?.logoColor : theme?.bottomTab,
                  }}></View>
              </TouchableOpacity>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};
const HomeStack = props => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Home'}
        component={Home}
        options={{
          headerLeftLabelVisible: false,
          headerLeft: () => null,
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name={'Notification'}
        component={Notification}
        options={{
          headerShown: false,
         
        }}
      /> */}

      <Stack.Screen
        name={'BlogDetail'}
        component={BlogDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
const DashboardStack = props => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'ContactUs'}
        component={ContactUs}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={'BlogListing'}
        component={BlogListing}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={'BlogDetail'}
        component={BlogDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'About'}
        component={About}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={'Notification'}
        component={Notification}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default AuthenticatedRoutes;
