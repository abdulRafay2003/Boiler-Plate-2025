import {FONT_FAMILY} from '@/constants/fontFamily';
import i18next from 'i18next';
import {Dimensions, StatusBar} from 'react-native';
import theme from './theme';
let {width, height} = Dimensions.get('window');

export default {
    leadInternalContainer:{flexDirection: 'row', marginVertical: 5},
    leadTitle:{
        fontSize: 16,
        fontFamily: FONT_FAMILY?.IBMPlexMedium,
        color: theme?.textGrey,
        width: '40%',
      },
      leadData:{
        fontSize: 16,
        fontFamily: FONT_FAMILY?.IBMPlexMedium,
        color: theme?.black,
        width: '60%',
      }
}