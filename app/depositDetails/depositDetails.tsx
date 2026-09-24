import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import {
  BoxSummaryTable,
  DepositHeader,
  DepositInfo,
} from '../components/depositDetails/DepositDetailsContent';
import Church from '../components/icons/Church';
import Mail from '../components/icons/Mail';
import UserAvatar from '../components/icons/UserAvatar';
import LoadingOverlay from '../components/LoadingSpinner';
import {
  COMPLETED_STATUS_CODE,
  COMPLETED_STATUS_ID,
  DECLINED_STATUS_CODE,
  DECLINED_STATUS_ID,
  EDIT_TRANSACTION__PERMISSION,
  FEMALE_GENDER_CODE,
  GenderCode,
  MALE_GENDER_CODE,
  PENDING_STATUS_ID,
  UNLABELED_GENDER_CODE,
  SOCKET_EVENT_TRANSACTION_UPDATED,
} from '../helpers/constants';
import { getUserPermissions } from '../helpers/helpers';
import { editTransactionStatus, getTransactionDetails } from '../services/services';
import { getSocket } from '../socketService';

type TransactionDetails = {
  transactionId: number;
  statusCode: string;
  statusId: number;
  firstName: string;
  lastName: string;
  email: string;
  transactionDate: string;
  recollectionCenterName: string;
  transactionNumber: string;
};

type BoxSummary = { ageCode: string; genderCode: GenderCode; quantity: number };
type BoxResponse = {
  ageCode: string;
  genderCode: string;
};

const STATUS_ID_BY_CODE: Record<string, number> = {
  [COMPLETED_STATUS_CODE]: COMPLETED_STATUS_ID,
  [DECLINED_STATUS_CODE]: DECLINED_STATUS_ID,
};

const STATUS_STYLE_BY_CODE: Record<string, { color: string; backgroundColor: string }> = {
  PENDING: { color: '#F08A00', backgroundColor: '#FFF4D7' },
  [COMPLETED_STATUS_CODE]: { color: colors.green_label, backgroundColor: '#E2F4E6' },
  [DECLINED_STATUS_CODE]: { color: colors.red_label, backgroundColor: '#FBE3E3' },
};

function getGenderCode(genderCode: string): GenderCode {
  if (genderCode === MALE_GENDER_CODE) return MALE_GENDER_CODE;
  if (genderCode === FEMALE_GENDER_CODE) return FEMALE_GENDER_CODE;
  return UNLABELED_GENDER_CODE;
}

export default function Index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'information' | 'summary'>('information');
  const [isLoading, setIsLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [boxes, setBoxes] = useState<BoxSummary[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const { transactionId: transactionParam } = useLocalSearchParams<{ transactionId: string }>();
  const transactionId = JSON.parse(transactionParam);
  const canValidateDeposit =
    permissions.includes(EDIT_TRANSACTION__PERMISSION) &&
    transactionDetails?.statusId === PENDING_STATUS_ID;

  const fetchData = useCallback(async () => {
    try {
      const [userPermissions, { response }] = await Promise.all([
        getUserPermissions(),
        getTransactionDetails(transactionId).then(({ data }) => data),
      ]);
      setPermissions(userPermissions);
      console.log('Transaction details response:', response);
      const details = response.transactionDetails;
      setTransactionDetails({
        ...details,
        firstName: details.firstName ?? details.name ?? '',
        statusCode: details.statusCode,
        statusId: details.statusId,
      });
      const groupedBoxes = response.boxes.reduce(
        (map: Map<string, BoxSummary>, item: BoxResponse | null) => {
          if (!item) return map;
          const genderCode = getGenderCode(item.genderCode);
          const key = `${item.ageCode}-${genderCode}`;
          const current = map.get(key);
          map.set(
            key,
            current
              ? { ...current, quantity: current.quantity + 1 }
              : { ageCode: item.ageCode, genderCode, quantity: 1 }
          );
          return map;
        },
        new Map<string, BoxSummary>()
      );
      setBoxes([...groupedBoxes.values()]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleStatusUpdate = (updatedTransaction: { id: number; statusCode: string }) => {
      if (transactionDetails?.transactionId === updatedTransaction.id) {
        setTransactionDetails((previous) =>
          previous
            ? {
                ...previous,
                statusCode: updatedTransaction.statusCode,
                statusId: STATUS_ID_BY_CODE[updatedTransaction.statusCode] ?? previous.statusId,
              }
            : previous
        );
      }
    };
    socket.on(SOCKET_EVENT_TRANSACTION_UPDATED, handleStatusUpdate);
    return () => {
      socket.off(SOCKET_EVENT_TRANSACTION_UPDATED, handleStatusUpdate);
    };
  }, [transactionDetails]);

  if (isLoading) return <LoadingOverlay visible />;
  if (!transactionDetails) return null;

  const totalBoxes = boxes.reduce((sum, box) => sum + box.quantity, 0);
  const boys = boxes
    .filter((box) => box.genderCode === MALE_GENDER_CODE)
    .reduce((sum, box) => sum + box.quantity, 0);
  const girls = boxes
    .filter((box) => box.genderCode === FEMALE_GENDER_CODE)
    .reduce((sum, box) => sum + box.quantity, 0);
  const unlabeled = boxes
    .filter((box) => box.genderCode === UNLABELED_GENDER_CODE)
    .reduce((sum, box) => sum + box.quantity, 0);
  const statusStyle =
    STATUS_STYLE_BY_CODE[transactionDetails.statusCode] ?? STATUS_STYLE_BY_CODE.DECLINED;
  const updateStatus = async (statusCode: number) => {
    setIsLoading(true);
    await editTransactionStatus(transactionId, statusCode);
    await fetchData();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
        <Stack.Screen options={{ headerShown: false }} />
        <DepositHeader
          transaction={transactionDetails}
          totalBoxes={totalBoxes}
          boys={boys}
          girls={girls}
          unlabeled={unlabeled}
          statusLabel={transactionDetails.statusCode}
          statusColor={statusStyle.color}
          statusBackgroundColor={statusStyle.backgroundColor}
          onBack={() => router.replace('/(protected)/transactions')}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.white,
              borderBottomWidth: 1,
              borderBottomColor: '#D4DCE9',
            }}>
            {(['information', 'summary'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 17,
                  borderBottomWidth: 2,
                  borderBottomColor: activeTab === tab ? colors.dark_blue : 'transparent',
                }}>
                <Text
                  style={[
                    commonStyles.paragraph,
                    { color: activeTab === tab ? colors.dark_blue : '#58719B', fontSize: 12 },
                  ]}>
                  {tab === 'information' ? 'Order Info' : 'Box Summary'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
            {activeTab === 'information' ? (
              <DepositInfo
                transaction={transactionDetails}
                icons={{
                  contact: <UserAvatar width={18} height={18} />,
                  email: <Mail width={18} height={18} />,
                  date: (
                    <MaterialCommunityIcons
                      name="calendar-outline"
                      size={18}
                      color={colors.dark_blue}
                    />
                  ),
                  order: <Text style={{ color: colors.dark_blue, fontSize: 17 }}>#</Text>,
                  church: <Church width={18} height={18} />,
                }}
              />
            ) : (
              <BoxSummaryTable boxes={boxes} />
            )}
          </ScrollView>
          {canValidateDeposit && (
            <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
              <TouchableOpacity
                style={commonStyles.buttonNoShadow}
                onPress={() => updateStatus(COMPLETED_STATUS_ID)}>
                <Text style={[commonStyles.header, { color: colors.white }]}>Confirm Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  commonStyles.buttonNoShadow,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.red_label,
                    borderWidth: 2,
                    marginTop: 10,
                  },
                ]}
                onPress={() => setShowWarning(true)}>
                <Text style={[commonStyles.header, { color: colors.red_label }]}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
          {!canValidateDeposit && transactionDetails.statusId === PENDING_STATUS_ID && (
            <Text
              style={[
                commonStyles.paragraphItalic,
                { color: colors.dark_gray, textAlign: 'center', padding: 16 },
              ]}>
              You do not have permissions to validate this deposit.
            </Text>
          )}
        </View>
        <Modal
          visible={showWarning}
          transparent
          animationType="fade"
          onRequestClose={() => setShowWarning(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                maxWidth: 400,
                borderRadius: 10,
                backgroundColor: colors.white,
                padding: 32,
              }}>
              <Text style={[commonStyles.paragraph, { marginBottom: 32, textAlign: 'center' }]}>
                Are you sure you want to decline this deposit?
              </Text>
              <View style={{ flexDirection: 'row', gap: 32 }}>
                <TouchableOpacity
                  style={[
                    commonStyles.buttonNoShadow,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.dark_gray,
                      borderWidth: 2,
                      flex: 1,
                    },
                  ]}
                  onPress={() => setShowWarning(false)}>
                  <Text style={[commonStyles.header, { color: colors.dark_gray }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    commonStyles.buttonNoShadow,
                    { backgroundColor: colors.red_label, flex: 1 },
                  ]}
                  onPress={() => {
                    setShowWarning(false);
                    updateStatus(DECLINED_STATUS_ID);
                  }}>
                  <Text style={[commonStyles.header, { color: colors.white }]}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
