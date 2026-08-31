import axios from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import CircularProgress from '../components/CircularProgress';
import { getAccessToken } from '../helpers/helpers';
import LoadingOverlay from '../components/LoadingSpinner';
import Person from '../components/icons/Person';
import Church from '../components/icons/Church';
import BackArrow from '../components/icons/BackArrow';
import TargetArrow from '../components/icons/TargetArrow';
import { getSocket } from '../socketService';
import { getRecollectionCenterBoxesCount, getUserBoxes } from '../services/services';

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
    socket.on('transaction:statusUpdated', handleFetch);
    socket.on('transaction:new', handleFetch);
    return () => {
      socket.off('transaction:statusUpdated', handleFetch);
      socket.off('transaction:new', handleFetch);
    };
  }, []);

  if (isLoading) {
    return <LoadingOverlay></LoadingOverlay>;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {/* Overall Card */}
          <View style={[commonStyles.card, { flexDirection: 'row', alignItems: 'center' }]}>
            {/* Left Column */}
            <View style={{ flex: 2, gap: 10 }}>
              <Text
                style={[commonStyles.paragraphExtraBold, { color: colors.green_label, gap: 0.5 }]}>
                ICB{' '}
                <Text style={[commonStyles.paragraphExtraBold, { color: colors.red_label }]}>
                  2025
                </Text>
              </Text>
              {/* Yearly Goal */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <TargetArrow height={25} width={25}></TargetArrow>
                <Text style={commonStyles.header}>Yearly Goal</Text>
              </View>
              <View style={{ gap: 6 }}>
                {/* Total Boxes Collected */}
                <Text style={commonStyles.paragraph}>
                  Boxes Collected:{' '}
                  <Text style={commonStyles.paragraphExtraBold}>
                    {recollectionCenterBoxesCount.toLocaleString()}
                  </Text>
                </Text>
                {/* Reaching Point */}
                <Text style={commonStyles.paragraph}>
                  Reaching Point:{' '}
                  <Text style={[commonStyles.paragraphExtraBold, { color: colors.dark_blue }]}>
                    {`${GOAL_BOXES_COUNT.toLocaleString()}`}{' '}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Right Column */}
            <View style={[{ flex: 1 }]}>
              <CircularProgress percentage={percentage} />
            </View>
          </View>

          {/* User Contribution Card */}
          <View style={[commonStyles.card, { marginTop: 20, rowGap: 16 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Person width={25} height={25}></Person>
              <Text style={commonStyles.header}>Your Contribution</Text>
            </View>
            <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>
              You have deposited a total of{' '}
              <Text style={commonStyles.paragraphExtraBold}> {userBoxesCount.totalBoxes} </Text>
              boxes
            </Text>
            {/* Gender Categories */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* Male Container */}
              <View
                style={{
                  backgroundColor: colors.green_label,
                  width: 50,
                  flex: 1,
                  alignItems: 'center',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}>
                <Text style={[commonStyles.header, { color: colors.white }]}>
                  {userBoxesCount?.maleBoxes || 0}
                </Text>
              </View>
              {/* Female Container */}
              <View
                style={{
                  backgroundColor: colors.red_label,
                  width: 50,
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text style={[commonStyles.header, { color: colors.white }]}>
                  {userBoxesCount.femaleBoxes || 0}
                </Text>
              </View>
              {/* Unlabeled Container */}
              <View
                style={{
                  backgroundColor: colors.light_gray,
                  width: 50,
                  flex: 1,
                  alignItems: 'center',
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <Text style={[commonStyles.header, { color: colors.dark_gray }]}>
                  {userBoxesCount.unlabeledBoxes || 0}
                </Text>
              </View>
            </View>

            {/* View Activity Button */}
            <Text style={commonStyles.paragraph}>Great job! Keep it going!</Text>
            <TouchableOpacity
              style={[commonStyles.buttonNoShadow, { backgroundColor: colors.dark_blue }]}
              onPress={() => router.replace('/transactions')}>
              <Text style={[commonStyles.paragraphBold, { color: colors.white }]}>
                View Activity
              </Text>
            </TouchableOpacity>
          </View>

          {/* Your Church Card  */}
          <View style={[commonStyles.card, { marginTop: 20, rowGap: 12 }]}>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Church height={25} width={25}></Church>
                <Text style={commonStyles.header}>Your Church</Text>
              </View>
              {/* Bible Verse */}
              <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>
                Rejoice in the Lord always: and again I say, Rejoice.{' '}
                <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>(Philippians 4:4) </Text>
              </Text>
            </View>
            <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>
              Iglesia Cristiana Bethlehem has collected{' '}
              <Text style={commonStyles.paragraphExtraBold}>{recollectionCenterBoxesCount}</Text>{' '}
              boxes
            </Text>
            {/* See details button */}
            <View
              style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: 6 }}>
              <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>
                See details
              </Text>
              <BackArrow height={25} width={25} style={{ transform: [{ scaleX: -1 }] }}></BackArrow>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
