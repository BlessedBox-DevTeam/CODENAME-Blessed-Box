import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import CircularProgress from '../components/CircularProgress';
import LoadingOverlay from '../components/LoadingSpinner';
import GiftBoxIcon from '../components/icons/GiftBoxIcon';
import CategoryIcon from '../components/order/CategoryIcon';
import { SOCKET_EVENT_NEW_BOX_COUNT } from '../helpers/constants';
import { getRecollectionCenterBoxesCount, getUserBoxes } from '../services/services';
import { getSocket } from '../socketService';

export default function Index() {
  const GOAL_BOXES_COUNT = 3000;
  const [isLoading, setIsLoading] = useState(true);
  const [recollectionCenterBoxesCount, setRecollectionCenterBoxesCount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [userBoxesCount, setUserBoxesCount] = useState({
    totalBoxes: 0,
    femaleBoxes: 0,
    maleBoxes: 0,
    unlabeledBoxes: 0,
  });
  const fetchData = async () => {
    try {
      const [userBoxesResponse, countRCBoxesResponse] = await Promise.all([
        getUserBoxes(),
        getRecollectionCenterBoxesCount(),
      ]);
      const userBoxesData = userBoxesResponse.data;
      const countRCBoxesData = countRCBoxesResponse.data;
      setUserBoxesCount({
        totalBoxes: userBoxesData.response.totalBoxes,
        femaleBoxes: userBoxesData.response.femaleBoxes,
        maleBoxes: userBoxesData.response.maleBoxes,
        unlabeledBoxes: userBoxesData.response.unlabeledBoxes,
      });
      setRecollectionCenterBoxesCount(countRCBoxesData.response.totalBoxes);
      setPercentage(
        Number(((countRCBoxesData.response.totalBoxes / GOAL_BOXES_COUNT) * 100).toFixed(2))
      );
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleFetch = () => {
      fetchData();
    };
    socket.on(SOCKET_EVENT_NEW_BOX_COUNT, handleFetch);
    return () => {
      socket.off(SOCKET_EVENT_NEW_BOX_COUNT, handleFetch);
    };
  }, []);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: colors.surface.app, flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Overall Card */}
          <View
            style={[
              commonStyles.card,
              {
                position: 'relative',
                overflow: 'hidden',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.dashboard.goal.background,
                borderRadius: 20,
                padding: 16,
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                width: 120,
                height: 120,
                right: -48,
                bottom: -78,
                borderRadius: 60,
                backgroundColor: colors.dashboard.goal.decoration,
              }}
            />
            {/* Left Column */}
            <View style={{ flex: 1, gap: 8 }}>
              <Text
                style={[
                  commonStyles.paragraphRegular,
                  { color: colors.dashboard.goal.eyebrow, gap: 0.5 },
                ]}>
                ICB{' '}
                <Text
                  style={[
                    commonStyles.paragraphRegular,
                    { color: colors.dashboard.goal.eyebrow },
                  ]}>
                  2026
                </Text>
              </Text>
              {/* Yearly Goal */}
              <Text
                style={[
                  commonStyles.paragraphExtraBold,
                  { color: colors.dashboard.goal.text, fontSize: 16 },
                ]}>
                Yearly Goal
              </Text>
              <View style={{ gap: 6 }}>
                {/* Total Boxes Collected */}
                <Text
                  style={[
                    commonStyles.paragraph,
                    { color: colors.dashboard.goal.text, fontSize: 11 },
                  ]}>
                  Boxes Collected:{' '}
                  <Text
                    style={[
                      commonStyles.paragraphBold,
                      { color: colors.dashboard.goal.text },
                    ]}>
                    {recollectionCenterBoxesCount.toLocaleString()}
                  </Text>
                </Text>
                {/* Reaching Point */}
                <Text
                  style={[
                    commonStyles.paragraph,
                    { color: colors.dashboard.goal.text, fontSize: 11 },
                  ]}>
                  Our Goal:{' '}
                  <Text
                    style={[
                      commonStyles.paragraphBold,
                      { color: colors.dashboard.goal.text },
                    ]}>
                    {`${GOAL_BOXES_COUNT.toLocaleString()}`}{' '}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Right Column */}
            <View style={{ width: 76 }}>
              <CircularProgress percentage={percentage} />
            </View>
          </View>

          {/* User Contribution Card */}
          <View
            style={[
              commonStyles.card,
              {
                marginTop: 12,
                rowGap: 14,
                backgroundColor: colors.dashboard.contribution.background,
                borderWidth: 1,
                borderColor: colors.dashboard.contribution.border,
                borderRadius: 20,
                padding: 16,
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              },
            ]}>
            <Text
              style={[
                commonStyles.paragraph,
                {
                  color: colors.dashboard.contribution.title,
                  fontSize: 11,
                  textTransform: 'uppercase',
                },
              ]}>
              Your Contribution
            </Text>
            <Text
              style={[
                commonStyles.paragraphBold,
                { color: colors.dashboard.contribution.text, fontSize: 12 },
              ]}>
              You have deposited a total of{''}
              <Text style={commonStyles.paragraphBold}> {userBoxesCount.totalBoxes} </Text>
              boxes
            </Text>
            {/* Gender Categories */}
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
              }}>
              {/* Male Container */}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 48,
                  borderRadius: 14,
                  backgroundColor: colors.dashboard.contribution.maleBackground,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <CategoryIcon
                    gender="boy"
                    color={colors.dashboard.contribution.maleText}
                    size={16}
                  />
                  <Text
                    style={[
                      commonStyles.header,
                      { color: colors.dashboard.contribution.maleText, fontSize: 16 },
                    ]}>
                    {userBoxesCount?.maleBoxes || 0}
                  </Text>
                </View>
              </View>
              {/* Female Container */}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 48,
                  borderRadius: 14,
                  backgroundColor: colors.dashboard.contribution.femaleBackground,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <CategoryIcon
                    gender="girl"
                    color={colors.dashboard.contribution.femaleText}
                    size={16}
                  />
                  <Text
                    style={[
                      commonStyles.header,
                      { color: colors.dashboard.contribution.femaleText, fontSize: 16 },
                    ]}>
                    {userBoxesCount.femaleBoxes || 0}
                  </Text>
                </View>
              </View>
              {/* Unlabeled Container */}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 48,
                  borderRadius: 14,
                  backgroundColor: colors.dashboard.contribution.unlabeledBackground,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <GiftBoxIcon size={18} />
                  <Text
                    style={[
                      commonStyles.header,
                      { color: colors.dashboard.contribution.unlabeledText },
                    ]}>
                    {userBoxesCount.unlabeledBoxes || 0}
                  </Text>
                </View>
              </View>
            </View>

            {/* View Activity Button */}
            <Text style={commonStyles.paragraph}>
              {userBoxesCount.totalBoxes === 0
                ? 'Your first drop-off starts here!'
                : 'Great job! Keep it going!'}
            </Text>
            <TouchableOpacity
              style={[
                commonStyles.buttonNoShadow,
                { backgroundColor: colors.dashboard.contribution.action, borderRadius: 14 },
              ]}
              onPress={() => router.replace('/transactions')}>
              <Text style={[commonStyles.paragraphBold, { color: colors.text.inverse }]}>
                View Drop-offs
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              commonStyles.card,
              {
                position: 'relative',
                overflow: 'hidden',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
                padding: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.dashboard.centers.border,
                backgroundColor: colors.dashboard.centers.background,
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              },
            ]}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                width: 90,
                height: 90,
                left: -54,
                bottom: -62,
                borderRadius: 45,
                backgroundColor: colors.dashboard.centers.decoration,
              }}
            />
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={[
                  commonStyles.paragraphRegular,
                  { color: colors.dashboard.centers.eyebrow, fontSize: 10 },
                ]}>
                NEAR YOU
              </Text>
              <Text
                style={[
                  commonStyles.header,
                  { color: colors.dashboard.centers.title, fontSize: 17 },
                ]}>
                Drop-off centers
              </Text>
              <Text
                style={[
                  commonStyles.paragraph,
                  { color: colors.dashboard.centers.description, fontSize: 11 },
                ]}>
                Find the closest place to bring your boxes
              </Text>
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 2,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 10,
                  backgroundColor: colors.dashboard.centers.badgeBackground,
                }}>
                <Text
                  style={[
                    commonStyles.paragraphBold,
                    { color: colors.dashboard.centers.badgeText, fontSize: 9 },
                  ]}>
                  Coming Soon
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 44,
                height: 44,
                marginLeft: 12,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                backgroundColor: colors.dashboard.centers.iconBackground,
              }}>
              <Ionicons
                name="location-outline"
                size={23}
                color={colors.dashboard.centers.icon}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
