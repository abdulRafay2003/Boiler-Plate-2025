import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {
  formatValue,
  isDateOlderThanCurrentDate,
  fianacialpaymentRecieptLink,
  invoiceLink,
  buttonHeight,
  buttonWidth,
  buttonBackgroundColor,
  buttonText,
} from '@/utils/business.helper';
import moment from 'moment';
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
  viewInvoice?: any | null;
  clickedItem?: any | null;
  onClickedItem?: any | null;
  from?: any | null;
}

const FinancialsListingItem = (props: Props) => {
  const {item, viewReciept, viewInvoice, clickedItem, onClickedItem, from} =
    props;
  return (
    <View
      style={{
        minHeight: 160,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: theme?.paymentPlanGrey,
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: StyleSheet?.hairlineWidth,
        borderColor: theme?.greyText,
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            width: '65%',
          }}>
          {item?.transactionId}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
          }}>
          {`${item?.currency} ${formatValue(item?.foreignamount)}`}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.textGrey,
            width: '50%',
          }}>
          {item?.invoiceType}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
            color:
              isDateOlderThanCurrentDate(item?.invoiceStatus, item?.dueDate) ==
                'Less than a day' &&
              isDateOlderThanCurrentDate(item?.invoiceStatus, item?.dueDate) ==
                ''
                ? theme?.lightGreen
                : theme?.brightRed,
          }}>
          {item?.invoiceStatus == 'Invoice : Open'
            ? isDateOlderThanCurrentDate(item?.invoiceStatus, item?.dueDate)
            : isDateOlderThanCurrentDate(item?.invoiceStatus, new Date())}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{}}>
          {item?.createdAt != null && (
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.textGrey,
              }}>
              {`Invoice Date: ${moment(item?.createdAt).format('DD MMM YYYY')}`}
            </Text>
          )}
          {item?.dueDate != null && (
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.textGrey,
              }}>
              {`Due Date: ${moment(item?.dueDate).format('DD MMM YYYY')}`}
            </Text>
          )}
          {item?.paymentDate != null && (
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.textGrey,
              }}>
              {`Transaction Date: ${moment(item?.paymentDate).format(
                'DD MMM YYYY',
              )}`}
            </Text>
          )}
        </View>

        {fianacialpaymentRecieptLink(
          item?.paymentRecieptUrl,
          item?.invoiceStatus,
        ) == true ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{height: 30, justifyContent: 'center'}}
            onPress={viewReciept}>
            <Text
              style={{
                fontSize: 12,
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
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {invoiceLink(item?.invoiceUrl) == true ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{height: 30, width: 70, justifyContent: 'center'}}
            onPress={viewInvoice}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
                textDecorationLine: 'underline',
              }}>
              View Invoice
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{height: 30, width: 70, justifyContent: 'center'}} />
        )}
        <>
          {item?.allowPayment ? (
            <>
              {item?.invoiceStatus == 'Invoice : Open' ? (
                <TouchableOpacity
                  style={{
                    height: buttonHeight(item?.invoiceStatus),
                    width: buttonWidth(item?.invoiceStatus),
                    backgroundColor: buttonBackgroundColor(item?.invoiceStatus),
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={1}
                  disabled={clickedItem > 0}
                  onPress={onClickedItem}>
                  {clickedItem == item?.id ? (
                    <ActivityIndicator size={'small'} color={theme?.white} />
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 12,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                        color:
                          item?.invoiceStatus == 'Invoice : Open'
                            ? theme?.white
                            : theme?.white,
                      }}>
                      {buttonText(item?.invoiceStatus)}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    height: buttonHeight(item?.invoiceStatus),
                    width: buttonWidth(item?.invoiceStatus),
                    backgroundColor: buttonBackgroundColor(item?.invoiceStatus),
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={1}
                  disabled={true}
                  onPress={onClickedItem}>
                  {clickedItem == item?.id ? (
                    <ActivityIndicator size={'small'} color={theme?.white} />
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 12,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                        color:
                          item?.invoiceStatus == 'Invoice : Open'
                            ? theme?.white
                            : theme?.white,
                      }}>
                      {buttonText(item?.invoiceStatus)}
                    </Text>
                  )}
                </TouchableOpacity>
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
      </View>
      {from == 'Dashboard' && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.logoColor,
              maxWidth: '70%',
            }}>
            {item?.propertyText}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
            }}>
            Unit no: {item?.unit?.unitCode}
          </Text>
        </View>
      )}
    </View>
  );
};

export default FinancialsListingItem;
