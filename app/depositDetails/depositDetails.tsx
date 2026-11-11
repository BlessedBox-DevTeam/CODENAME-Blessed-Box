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
import { getUserPermissions, UserPermission } from '../helpers/helpers';
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
  ageCode: string | null;
  genderCode: string;
};

const STATUS_ID_BY_CODE: Record<string, number> = {
  [COMPLETED_STATUS_CODE]: COMPLETED_STATUS_ID,
  [DECLINED_STATUS_CODE]: DECLINED_STATUS_ID,
};

const STATUS_STYLE_BY_CODE: Record<string, { color: string; backgroundColor: string }> = {
  PENDING: { color: colors.status.pending, backgroundColor: colors.status.pendingBackground },
  [COMPLETED_STATUS_CODE]: {
    color: colors.brand.primary,
    backgroundColor: colors.status.completedBackground,
  },
  [DECLINED_STATUS_CODE]: { color: colors.status.danger, backgroundColor: colors.status.declinedBackground },
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
  const [confirmationStatus, setConfirmationStatus] = useState<number | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [boxes, setBoxes] = useState<BoxSummary[]>([]);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const { transactionId: transactionParam } = useLocalSearchParams<{ transactionId: string }>();
  const transactionId = JSON.parse(transactionParam);
  const canValidateDeposit =
    permissions.some((permission) => permission.code === EDIT_TRANSACTION__PERMISSION) &&
    transactionDetails?.statusId === PENDING_STATUS_ID;

  const fetchData = useCallback(async () => {
    try {
      const {
        data: { response },
      } = await getTransactionDetails(transactionId);
      const userPermissions = await getUserPermissions();
      const details = response.transactionDetails;
      setTransactionDetails({
        ...details,
        firstName: details.firstName ?? details.name ?? '',
        statusCode: details.statusCode,
        statusId: details.statusId,
      });
      setPermissions(userPermissions);
      const groupedBoxes = response.boxes.reduce(
        (map: Map<string, BoxSummary>, item: BoxResponse | null) => {
          if (!item) return map;
          const genderCode = getGenderCode(item.genderCode);
          const ageCode = item.ageCode ?? 'UNLABELED';
          const key = `${ageCode}-${genderCode}`;
          const current = map.get(key);
          map.set(
            key,
            current
              ? { ...current, quantity: current.quantity + 1 }
              : { ageCode, genderCode, quantity: 1 }
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
  const updateStatus = async (statusId: number) => {
    setIsLoading(true);
    await editTransactionStatus(transactionId, statusId);
    await fetchData();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.app }}>
        <Stack.Screen options={{ headerShown: false }} />
        <DepositHeader
          transaction={transactionDetails}
          totalBoxes={totalBoxes}
          boys={boys}
          girls={girls}
          unlabeled={unlabeled}
          statusLabel={transactionDetails.statusCode}
          statusColor={statusStyle.color}
          onBack={() => router.replace('/(protected)/transactions')}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.surface.card,
              borderBottomWidth: 1,
              borderBottomColor: colors.deposit.border,
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
                  borderBottomColor: activeTab === tab ? colors.brand.dark : colors.transparent,
                }}>
                <Text
                  style={[
                    commonStyles.paragraph,
                    {
                      color: activeTab === tab ? colors.brand.dark : colors.deposit.mutedBlue,
                      fontSize: 12,
                    },
                  ]}>
                  {tab === 'information' ? 'Drop-off Info' : 'Box Summary'}
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
                      color={colors.brand.dark}
                    />
                  ),
                  order: <Text style={{ color: colors.brand.dark, fontSize: 17 }}>#</Text>,
                  church: <Church width={18} height={18} />,
                }}
              />
            ) : (
              <BoxSummaryTable boxes={boxes} />
            )}
          </ScrollView>
          {canValidateDeposit && (
            <View
              style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 16 }}>
              <TouchableOpacity
                style={[
                  commonStyles.buttonNoShadow,
                  { flex: 1, minHeight: 44, paddingVertical: 8, paddingHorizontal: 6 },
                ]}
                onPress={() => setConfirmationStatus(COMPLETED_STATUS_ID)}>
                <Text
                  style={[
                    commonStyles.paragraphBold,
                    { color: colors.text.inverse, fontSize: 12, textAlign: 'center' },
                  ]}>
                  Confirm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  commonStyles.buttonNoShadow,
                  {
                    flex: 1,
                    minHeight: 44,
                    paddingVertical: 8,
                    paddingHorizontal: 6,
                    backgroundColor: colors.surface.card,
                    borderColor: colors.status.danger,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setConfirmationStatus(DECLINED_STATUS_ID)}>
                <Text
                  style={[
                    commonStyles.paragraphBold,
                    { color: colors.status.danger, fontSize: 12, textAlign: 'center' },
                  ]}>
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {!canValidateDeposit && transactionDetails.statusId === PENDING_STATUS_ID && (
            <Text
              style={[
                commonStyles.paragraphItalic,
                { color: colors.text.secondary, textAlign: 'center', padding: 16 },
              ]}>
              You do not have permissions to validate this deposit.
            </Text>
          )}
        </View>
        <Modal
          visible={confirmationStatus !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmationStatus(null)}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.effects.overlay,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                maxWidth: 400,
                borderRadius: 10,
                backgroundColor: colors.surface.card,
                padding: 32,
              }}>
              <Text style={[commonStyles.paragraph, { marginBottom: 32, textAlign: 'center' }]}>
                {confirmationStatus === COMPLETED_STATUS_ID
                  ? 'Are you sure you want to confirm this drop-off?'
                  : 'Are you sure you want to decline this drop-off?'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 32 }}>
                <TouchableOpacity
                  style={[
                    commonStyles.buttonNoShadow,
                    {
                      backgroundColor: colors.surface.card,
                      borderColor: colors.text.secondary,
                      borderWidth: 2,
                      flex: 1,
                    },
                  ]}
                  onPress={() => setConfirmationStatus(null)}>
                  <Text style={[commonStyles.header, { color: colors.text.secondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    commonStyles.buttonNoShadow,
                    {
                      backgroundColor:
                        confirmationStatus === COMPLETED_STATUS_ID
                          ? colors.brand.primary
                          : colors.status.danger,
                      flex: 1,
                    },
                  ]}
                  onPress={() => {
                    if (confirmationStatus === null) return;
                    const statusId = confirmationStatus;
                    setConfirmationStatus(null);
                    updateStatus(statusId);
                  }}>
                  <Text style={[commonStyles.header, { color: colors.text.inverse }]}>
                    {confirmationStatus === COMPLETED_STATUS_ID ? 'Confirm' : 'Decline'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
