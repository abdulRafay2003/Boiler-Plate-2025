import {FONT_FAMILY} from '@/constants/fontFamily';
import {Dimensions} from 'react-native';
import theme from './theme';
let {width, height} = Dimensions.get('window');

export default <any> {
 renderItemImageBG:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
 },
 renderItemImageBGStyles:{width: width, height: height},
 linearGradientaStyles :{
  height: height,
  width: width,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 50,
  paddingBottom: 90,
},
logoStyles:{
  width: 67,
  height: 81,
  resizeMode: 'contain',
  tintColor: theme?.white,
},
rennterItemTitleView:{
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: width
},
renderItemTitleStyles:{
  fontSize: 35,
  fontFamily: FONT_FAMILY?.IBMPlexBold,
  color: theme?.white,
  textAlign: 'left',
  flexWrap: 'wrap',
  width: '85%',
},
renderItemTextStyles:{
  fontSize: 15,
  fontFamily: FONT_FAMILY?.IBMPlexRegular,
  color: theme?.white,
  textAlign: 'left',
  width: '85%',
},
renderNextButtonViewStyles:{
  width: 60,
  height: 60,
  bottom: 8,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 60 / 2,
  backgroundColor: '#E5E5E5',
},
renderArrowIconStyles:{
  width: 10,
  height: 14,
},
skipButtonTO:{
  width: 60,
  height: 60,
  bottom: 8,
  justifyContent: 'center',
  alignItems: 'center',
},
skipButtonTextStyles:{
  fontSize: 16,
  color: theme?.white,
  fontFamily: FONT_FAMILY?.IBMPlexRegular,
},
doneButtonViewStyles:{
  width: 60,
  height: 60,
  bottom: 8,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 60 / 2,
  backgroundColor: '#E5E5E5',
},




};

