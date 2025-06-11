import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React from 'react';
import {FONT_FAMILY} from '@/constants/fontFamily';
import theme from '@/assets/stylesheet/theme';
import renderOverviewStyles from '@/assets/stylesheet/renderOverview.styles';
import moment from 'moment';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

interface Props {
  data?: any | null;
  onPressEdit?: any | null;
  onPressEditNot?: any | null;
  onPressResetNot?: any | null;
}
const RenderOverview = (props: Props) => {
  const {data, onPressEdit, onPressEditNot, onPressResetNot} = props;
  return (
    <ScrollView
      bounces={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: screenHeight * 0.4,
      }}
      style={{
        flex: 1,
      }}>
      <View style={{}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
            }}>
            About Lead
          </Text>
          {
            data?.leadAction == 2 && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPressResetNot}
                style={{
                  paddingHorizontal: 8,
                  height: 25,
                  backgroundColor: theme?.logoColor,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 15,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.white,
                  }}>
                  Re-Engage Lead
                </Text>
              </TouchableOpacity>
            )
            // : (
            //   data?.leadAction == 1 && (
            //     <Text
            // allowFontScaling={false}

            //       style={{
            //         fontSize: 15,
            //         fontFamily: FONT_FAMILY?.IBMPlexMedium,
            //         color: theme?.logoColor,
            //       }}>
            //       Lead Interested
            //     </Text>
            //   )
            // )
          }
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
          }}>
          {data?.leadAction == null || data?.leadAction == 5 ? (
            <>
              <TouchableOpacity
                style={{
                  height: 34,
                  width: '48%',
                  backgroundColor: theme?.logoColor,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={1}
                onPress={onPressEdit}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.white,
                  }}>
                  Lead Interested
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 34,
                  width: '48%',
                  backgroundColor: theme?.logoColor,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={1}
                onPress={onPressEditNot}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.white,
                  }}>
                  Lead Not Interested
                </Text>
              </TouchableOpacity>
            </>
          ) : data?.leadAction == 1 ? (
            <>
              <View
                style={{
                  height: 34,
                  width: '100%',
                  borderRadius: 8,
                  justifyContent: 'center',
                  // alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: theme?.logoColor,
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexBold,
                  }}>
                  Lead Interested
                </Text>
              </View>
            </>
          ) : data?.leadAction == 2 ? (
            <View
              style={{
                height: 34,
                width: '100%',
                borderRadius: 8,
                justifyContent: 'center',
                // alignItems: 'center',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.logoColor,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                }}>
                Lead Not Interested
              </Text>
            </View>
          ) : (
            <>
              <View
                style={{
                  height: 34,
                  width: '100%',
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: theme?.brightRed,
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexBold,
                  }}>
                  Net Suite Issue
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
      <View style={{marginTop: 20}}>
        {/* -------------------Primary Information--------------- */}
        <View
          style={{
            borderBottomWidth: StyleSheet?.hairlineWidth,
            paddingBottom: 15,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            Primary Information
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Lead ID
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            {data?.entityNumber}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Name
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              width: '43%',
              flexWrap: 'wrap',
            }}>
            {data?.name}
          </Text>
        </View>
        {/* -------------------Lead Related--------------- */}
        <View
          style={{
            borderBottomWidth: StyleSheet?.hairlineWidth,
            paddingBottom: 15,
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            Lead Related
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Lead Status
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              width: '60%',
            }}>
            {data?.leadStatus}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Lead Source
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              width: '60%',
            }}>
            {data?.leadSource}
          </Text>
        </View>
        {/* -------------------Classification--------------- */}
        <View
          style={{
            borderBottomWidth: StyleSheet?.hairlineWidth,
            paddingBottom: 15,
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            Classification
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Created By
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              width: '60%',
            }}>
            {data?.leadCreatedBy}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Created Date & Time
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              width: '40%',
            }}>
            {data?.leadCreationDate
              ? moment(data?.leadCreationDate)?.format('DD/MM/YYYY hh:mm:ss a')
              : null}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Lead Assign Date
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              width: '40%',
            }}>
            {data?.leadAssignedDate
              ? moment(data?.leadAssignedDate)?.format('DD/MM/YYYY hh:mm:ss a')
              : null}
          </Text>
        </View>
        {data?.updatedAt != null && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.black,
                width: '60%',
              }}>
              Lead Modification Date
            </Text>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 15,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
                width: '40%',
              }}>
              {data?.updatedAt
                ? moment(data?.updatedAt)?.format('DD/MM/YYYY hh:mm:ss a')
                : null}
            </Text>
          </View>
        )}
        {/* -------------------Address And Contact--------------- */}
        <View
          style={{
            borderBottomWidth: StyleSheet?.hairlineWidth,
            paddingBottom: 15,
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            Address and Contact
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Email
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              flexWrap: 'wrap',
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              width: '40%',
            }}>
            {data?.email}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
              width: '60%',
            }}>
            Phone Number
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
              width: '60%',
            }}>
            {data?.phoneNumber}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RenderOverview;
