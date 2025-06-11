import {FONT_FAMILY} from '@/constants/fontFamily';
import i18next from 'i18next';
import {Dimensions, StatusBar} from 'react-native';
import theme from './theme';
let {width, height} = Dimensions.get('window');

export default {
  container: {
    width: '90%',
    flexDirection: 'row',
    // backgroundColor: 'green',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E7EFF8',
    alignSelf: 'center',
    height: 49,
    marginTop: 12,
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  leftImage: {
    height: 18,
    width: 18,
    // tintColor: 'red',
    // backgroundColor: 'red',
  },
  txtInputStyle: {
    width: '80%',
    justifyContent: 'center',
    fontSize: 12,
    // textAlign: i18next.language == LANG_AR ? 'right' : 'left',
    fontFamily: FONT_FAMILY.IBMPlexBold,
    color: theme.navyBlue,
    // backgroundColor: 'red',
  },

  rightImgCont: {
    borderWidth: 0.5,
    borderColor: '#122E44',
    right: 50,
    height: 22,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  rightImgStyle: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    right: 40,
    // backgroundColor: 'red',
  },
};
