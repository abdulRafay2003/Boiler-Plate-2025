import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {
  FilterPaymentPrdLinkage,
  formatValue,
  paymentPlanStatus,
  paymentRecieptLink,
} from '@/utils/business.helper';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface Props {
  item?: any | null;
  viewReciept?: any | null;
  clickedItem?: any | null;
  onClickedItem?: any | null;
}

const PaymentPlanItem = (props: Props) => {
  const {item, viewReciept, clickedItem, onClickedItem} = props;
  return (
    <View
      style={{
        height: 150,
        justifyContent: 'space-between',
        backgroundColor: theme?.paymentPlanGrey,
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: StyleSheet?.hairlineWidth,
        borderColor: theme?.greyText,
      }}>
      <View
        style={{
          justifyContent: 'space-between',
          width: '100%',
          flexDirection: 'row',
        }}>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            width: '70%',
          }}>
          {item?.installmentNo}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
          }}>
          AED {formatValue(item?.scheduleAmt)}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          width: '100%',
          flexDirection: 'row',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 13,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.greyText,
          }}>
          Due Date
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 13,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
          }}>
          {item?.dueDate}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          width: '100%',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.greyText,
          }}>
          Recieved Amount
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 13,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
          }}>
          AED {formatValue(item?.receivedAmount)}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          width: '100%',
          flexDirection: 'row',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 13,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.greyText,
          }}>
          Realized Amount
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 13,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
          }}>
          AED {formatValue(item?.realisedAmount)}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'flex-end',

          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {paymentRecieptLink(item?.PaymentPrdLinkage, item?.paymentStatus) ==
        true ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{height: 30, justifyContent: 'center'}}
            onPress={viewReciept}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
                textDecorationLine: 'underline',
              }}
              allowFontScaling={false}>
              View Reciept
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{height: 30, width: 70, justifyContent: 'center'}} />
        )}
        {paymentPlanStatus(item?.paymentStatus) ? (
          <>
            {item?.allowPayment ? (
              <>
                {item?.enable == true ? (
                  <TouchableOpacity
                    style={{
                      height: 26,
                      width: 78,
                      backgroundColor: theme?.logoColor,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    activeOpacity={1}
                    onPress={onClickedItem}
                    disabled={clickedItem > 0}>
                    {clickedItem == item?.id ? (
                      <ActivityIndicator size={'small'} color={theme?.white} />
                    ) : (
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 12,
                          fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          color: theme?.white,
                        }}>
                        Pay Now
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      height: 26,
                      width: 78,
                      backgroundColor: theme?.greyText,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 12,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                        color: theme?.white,
                      }}>
                      Pay Now
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View
                style={{
                  height: 26,
                  width: 200,
                  backgroundColor: theme?.transparent,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 11,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                    color: theme?.logoColor,
                  }}>
                  {item?.unallowPaymentText}
                </Text>
              </View>
            )}
          </>
        ) : (
          <View
            style={{
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.logoColor,
              }}
              allowFontScaling={false}>
              {item?.shouldBeDisabled
                ? item?.shouldBeDisabledText
                : item?.paymentStatusText}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PaymentPlanItem;
