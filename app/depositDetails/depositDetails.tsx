import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import {
  BoxSummaryTable,
  DepositHeader,
  DepositInfo,
} from '../components/depositDetails/DepositDetailsContent';
import CalendarIcon from '../components/icons/CalendarIcon';
import Church from '../components/icons/Church';
import Mail from '../components/icons/Mail';
import UserAvatar from '../components/icons/UserAvatar';
import LoadingOverlay from '../components/LoadingSpinner';
import {
  ADMIN_ROLE_TYPE_ID,
  COMPLETED_STATUS_ID,
  DECLINED_STATUS_ID,
  FEMALE_GENDER_ID,
  MALE_GENDER_ID,
  PENDING_STATUS_ID,
  SOCKET_EVENT_TRANSACTION_UPDATED,
  UNLABELED_GENDER_ID,
} from '../helpers/constants';
import { getUserRoles, UserRole } from '../helpers/helpers';
import { editTransactionStatus, getTransactionDetails } from '../services/services';
import { getSocket } from '../socketService';

type TransactionDetails = {
  transactionId: number;
  statusCode: number;
  name: string;
  lastName: string;
  secondLastName: string;
  email: string;
  transactionDate: string;
  recollectionCenterName: string;
};

type BoxSummary = { age: string | number | false; genderId: number; quantity: number };

export default function Index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'information' | 'summary'>('information');
  const [isLoading, setIsLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [boxes, setBoxes] = useState<BoxSummary[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const { transactionId: transactionParam } = useLocalSearchParams<{ transactionId: string }>();
  const transactionId = JSON.parse(transactionParam);
  const canValidateDeposit = roles.some(
    (role) =>
      role.roleId === ADMIN_ROLE_TYPE_ID && transactionDetails?.statusCode === PENDING_STATUS_ID
  );

  const fetchData = async () => {
    try {
      const [userRoles, { response }] = await Promise.all([
        getUserRoles(),
        getTransactionDetails(transactionId).then(({ data }) => data),
      ]);
      setRoles(userRoles ?? []);
      setTransactionDetails(response.transactionDetails);
      const groupedBoxes = response.boxes.reduce(
        (map: Map<string, BoxSummary>, item: BoxSummary | null) => {
          if (!item) return map;
          const age = item.age ?? false;
          const genderId = item.genderId ?? UNLABELED_GENDER_ID;
          const key = `${age}-${genderId}`;
          const current = map.get(key);
          map.set(
            key,
            current
              ? { ...current, quantity: current.quantity + 1 }
              : { age, genderId, quantity: 1 }
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleStatusUpdate = (updatedTransaction: { id: number; statusCode: string }) => {
      if (transactionDetails?.transactionId === updatedTransaction.id) {
        setTransactionDetails((previous) =>
          previous ? { ...previous, statusCode: Number(updatedTransaction.statusCode) } : previous
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
    .filter((box) => box.genderId === MALE_GENDER_ID)
    .reduce((sum, box) => sum + box.quantity, 0);
  const girls = boxes
    .filter((box) => box.genderId === FEMALE_GENDER_ID)
    .reduce((sum, box) => sum + box.quantity, 0);
  const statusLabel =
    transactionDetails.statusCode === DECLINED_STATUS_ID
      ? 'Cancelled'
      : transactionDetails.statusCode === COMPLETED_STATUS_ID
        ? 'Confirmed'
        : 'Pending';
  const statusColor =
    transactionDetails.statusCode === DECLINED_STATUS_ID ? colors.red_label : colors.dark_green;
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
          statusLabel={statusLabel}
          statusColor={statusColor}
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
                  {tab === 'information' ? 'Deposit Info' : 'Box Summary'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
            {activeTab === 'information' ? (
              <DepositInfo
                transaction={transactionDetails}
                icons={{
                  contact: <UserAvatar width={18} height={18} />,
                  email: <Mail width={18} height={18} />,
                  date: <CalendarIcon size={18} />,
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
          {!canValidateDeposit && transactionDetails.statusCode === PENDING_STATUS_ID && (
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
