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
import Home from '@/screens/Main/home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ProjectDetails from '@/screens/projects/projectDetails';
import {CircleBackButton} from '@/components/buttons/circleBackButton';
import FloorPlans from '@/screens/projects/floorPlans';
import Gallery from '@/screens/projects/gallery';
import VRTour from '@/screens/Main/vrTour';
import Notification from '@/screens/Main/notification';

import More from '@/screens/more/more';
import ContactUs from '@/screens/more/contactUs';
import BlogListing from '@/screens/more/blogListing';
import BlogDetail from '@/screens/more/blogDetails';
import About from '@/screens/more/about';
import WebView from 'react-native-webview';
import WebViews from '@/screens/Main/webView';
import EnquiryForm from '@/screens/sideScreens/enquiryForm';
import Location from '@/screens/sideScreens/location';
import MoreModal from '@/screens/more/moreModal';
import {
  setRefresh,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import ApplyMortage from '@/screens/sideScreens/applyMortage';
import PrivacyScreen from '@/screens/sideScreens/privacyPolicy';
import VideoScreen from '@/screens/sideScreens/videoScreen';
import {GetWalkThrough} from '@/services/apiMethods/walkthrough';
import InvoiceViewer from '@/screens/customerScreens/invoiceAndPayment/invoice';
import AddAndUpdateUser from '@/screens/customerScreens/userManagment/addandUpdateUser';
import UserProfile from '@/screens/customerScreens/userManagment/userProfile';
import UserListing from '@/screens/customerScreens/userManagment/userListing';
import AgentHome from '@/screens/agentScreens/main/agentHome';
import ScheduleViewing from '@/screens/agentScreens/leads/scheduleAViewing';
import LatestActivities from '@/screens/agentScreens/leads/latestActivities';
import AllLeads from '@/screens/agentScreens/leads/allLeads';
import Login from '@/screens/auth/login';
import dataHandlerService from '@/services/mainServices/dataHandler.service';
import DashBoardCustomer from '@/screens/customerScreens/Main/dashboardCustomer';
import CustomerPropertyPortfolio from '@/screens/customerScreens/portfolio/potfolio';
import PortfolioDetail from '@/screens/customerScreens/portfolio/portfolioDetail';
import ConstructionUpdateList from '@/screens/customerScreens/constructionUpdates/constructionUpdateListing';
import ConstructionUpdateDetail from '@/screens/customerScreens/constructionUpdates/constructionUpdateDetail';
import Signup from '@/screens/auth/signup';
import Otp from '@/screens/auth/otp';
import Walkthrough from '@/screens/auth/walkthrough';
import SingleLeadDetails from '@/screens/agentScreens/leads/singleLeadDetails';
import CallLogs from '@/screens/agentScreens/logs/callLogs';
import EventLogs from '@/screens/agentScreens/logs/eventLogs';
import NoteLogs from '@/screens/agentScreens/logs/noteLogs';
import TaskLogs from '@/screens/agentScreens/logs/taskLogs';
import Financials from '@/screens/customerScreens/invoiceAndPayment/financials';
import PaymentPlan from '@/screens/customerScreens/invoiceAndPayment/paymentPlan';
import DeleteAccount from '@/screens/sideScreens/deleteAccount';
import ActivityDetails from '@/screens/agentScreens/leads/activitiesDetail';
import PaymentScreen from '@/screens/customerScreens/invoiceAndPayment/paymentScreen';
import ImageWork from '@/screens/agentScreens/main/imageWork';
import RecieptViewer from '@/screens/customerScreens/invoiceAndPayment/reciept';
import StatementViewer from '@/screens/customerScreens/invoiceAndPayment/statement';
import NotificationItem from '@/screens/customerScreens/invoiceAndPayment/notificationItem';
import { dispatchToStore, store } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = props => {
  const userData = store.getState().user.userDetail;
  const route = () => {
    switch (userData?.role) {
      case undefined:
        return 'Dashboard';
      case 'guest':
        return 'Dashboard';
      case 'customer':
        return 'DashboardCustomer';
      case 'agent':
        return 'DashboardAgent';
      default:
        break;
    }
  };
  // return <AuthNavigator props={route()} />;
  return <AuthNavigator props={'Walkthrough'} />;
};
const AuthNavigator = ({props}) => {
  return (
    // <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName={props}>
        <Stack.Screen
          name="Walkthrough"
          component={Walkthrough}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={MainTabsGuest}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DashboardAgent"
          component={MainTabsAgent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DashboardCustomer"
          component={MainTabsCustomer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Login'}
          component={Login}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name={'Signup'}
          component={Signup}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name={'Otp'}
          component={Otp}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name={'userProfile'}
          component={UserProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ScheduleViewing"
          component={ScheduleViewing}
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
        <Stack.Screen
          name={'DeleteAccount'}
          component={DeleteAccount}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    // </NavigationContainer>
  );
};

const MainTabsGuest = props => {
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
        signIn={item => {
          setShow(false);
          if (item == 'signin') {
            props?.navigation?.navigate('Login');
          } else {
          }
        }}
        signUp={item => {
          setShow(false);
          if (item == 'signup') {
            props?.navigation?.navigate('Signup');
          } else {
          }
        }}
        onNavigate={({item}) => {
          if (item?.title == 'Logout') {
            setShow(false);
            props?.navigation?.navigate(item?.parentStack, {
              screen: item?.route,
              params: {
                from: 'Home',
              },
            });
            dispatchToStore(setUserDetail({role: 'guest'}));
          } else {
            setShow(false);
            props?.navigation?.navigate(item?.parentStack, {
              screen: item?.route,
              params: {
                from: 'Home',
              },
            });
          }
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
const MainTabsCustomer = props => {
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
        subUsers={() => {
          setShow(false);
          props?.navigation.navigate('CDashboard', {
            screen: 'UserListing',
          });
        }}
        signUp={item => {
          setShow(false);
          if (item == 'signup') {
            props?.navigation?.navigate('Signup');
          } else if (item == 'financials') {
            props?.navigation?.navigate('CDashboard', {
              screen: 'Financials',
            });
          } else {
            props?.navigation?.navigate('Login');
          }
        }}
        signIn={item => {
          setShow(false);
          if (item == 'signin') {
            props?.navigation?.navigate('Login');
          } else if (item == 'portfolio') {
            props?.navigation?.navigate('CDashboard', {
              screen: 'CustomerPropertyPortfolio',
            });
          } else {
            props?.navigation?.navigate('Login');
          }
        }}
        onNavigate={({item}) => {
          if (item?.title == 'Logout') {
            setShow(false);
            props?.navigation?.navigate('Login');
            dispatchToStore(setUserDetail({role: 'guest'}));
          } else if (item?.title == 'Account') {
            setShow(false);
            props?.navigation?.navigate('DeleteAccount');
          } else {
            setShow(false);
            props?.navigation?.navigate(item?.parentStack, {
              screen: item?.route,
              params: {
                from: 'Home',
              },
            });
          }
        }}
        onPressProfile={item => {
          setShow(false);
          props?.navigation?.navigate('userProfile');
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
        }}
        initialRouteName="CDashboard">
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
          name="CDashboard"
          component={CustomerDashboardStack}
          options={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: 'CDashboard'}],
                  });
                  // props?.navigation?.navigate('CDashboard');
                  dispatchToStore(setRefresh(true));
                }}>
                <Image
                  source={require('@/assets/images/icons/dashbord_bottom.png')}
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
const MainTabsAgent = props => {
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
        signUp={item => {
          setShow(false);
          if (item == 'signup') {
            props?.navigation?.navigate('Signup');
          } else if (item == 'activities') {
            props?.navigation?.navigate('ActivityDetails', {
              from: 'More',
            });
          } else {
            props?.navigation?.navigate('Login');
          }
        }}
        signIn={item => {
          setShow(false);
          if (item == 'signin') {
            props?.navigation?.navigate('Login');
          } else if (item == 'leads') {
            props?.navigation?.navigate('ADashboard', {
              screen: 'AllLeads',
            });
          } else {
            props?.navigation?.navigate('Login');
          }
        }}
        onNavigate={({item}) => {
          if (item?.title == 'Logout') {
            setShow(false);
            props?.navigation?.navigate('Login');
            dispatchToStore(setUserDetail({role: 'guest'}));
          } else if (item?.title == 'Account') {
            setShow(false);
            props?.navigation?.navigate('DeleteAccount');
          } else {
            setShow(false);
            props?.navigation?.navigate(item?.parentStack, {
              screen: item?.route,
              params: {
                from: 'Home',
              },
            });
          }
        }}
        onPressProfile={item => {
          setShow(false);
          props?.navigation?.navigate('userProfile');
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
        }}
        initialRouteName="ADashboard">
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
          name="ADashboard"
          component={AgentDashboardStack}
          options={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: 'ADashboard'}],
                  });
                  dispatchToStore(setRefresh(true));
                }}>
                <Image
                  source={require('@/assets/images/icons/dashbord_bottom.png')}
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
const CustomerDashboardStack = props => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'CustomerDashbordScreen'}
        component={DashBoardCustomer}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name={'ConstructionUpdateList'}
        component={ConstructionUpdateList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'ConstructionUpdateDetail'}
        component={ConstructionUpdateDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'UserListing'}
        component={UserListing}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'SubUserProfile'}
        component={UserProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'UpdateSubUser'}
        component={AddAndUpdateUser}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Invoice'}
        component={InvoiceViewer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Reciept'}
        component={RecieptViewer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Statement'}
        component={StatementViewer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Financials'}
        component={Financials}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'PaymentPlan'}
        component={PaymentPlan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'NotificationItem'}
        component={NotificationItem}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Notification'}
        component={Notification}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'CustomerPropertyPortfolio'}
        component={CustomerPropertyPortfolio}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'PortfolioDetail'}
        component={PortfolioDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'PaymentScreen'}
        component={PaymentScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
const AgentDashboardStack = props => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'AgentHome'}
        component={AgentHome}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={'ImageWork'}
        component={ImageWork}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="AllLeads"
        component={AllLeads}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LatestActivities"
        component={LatestActivities}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NoteLogs"
        component={NoteLogs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CallLogs"
        component={CallLogs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EventLogs"
        component={EventLogs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TaskLogs"
        component={TaskLogs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SingleLeadDetails"
        component={SingleLeadDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ActivityDetails"
        component={ActivityDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ConstructionUpdateDetail'}
        component={ConstructionUpdateDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default MainStack;
