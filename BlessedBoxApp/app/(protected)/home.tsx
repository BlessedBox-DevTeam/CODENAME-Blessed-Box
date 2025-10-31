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
const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL;
const API_PORT = extra?.PORT;

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [boxesCount, setBoxesCount] = useState({
    totalBoxes: 0,
    femaleBoxes: 0,
    maleBoxes: 0,
    unlabeledBoxes: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const { data } = await axios.get(`${API_URL}:${API_PORT}/api/boxes/userBoxes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBoxesCount({
          totalBoxes: data.response.totalBoxes,
          femaleBoxes: data.response.femaleBoxes,
          maleBoxes: data.response.maleBoxes,
          unlabeledBoxes: data.response.unlabeledBoxes,
        });
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  if (isLoading) {
    return <LoadingOverlay></LoadingOverlay>;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
        <ScrollView style={{ flex: 1, height: '100%', padding: 20 }}>
          <View style={[commonStyles.card, commonStyles.gridContainer]}>
            <View style={commonStyles.leftColumn}>
              <Text style={[commonStyles.paragraphExtraBold, { color: colors.green_label, gap: 0.5 }]}>
                ICB <Text style={[commonStyles.paragraphExtraBold, { color: colors.red_label }]}>2025</Text>
              </Text>
              <Text style={commonStyles.header}>Yearly Goal</Text>
              <Text style={commonStyles.paragraph}>
                Boxes Collected: <Text style={commonStyles.paragraphExtraBold}>6,000</Text>
              </Text>
              <Text style={commonStyles.paragraph}>Reaching Point: 12,000 Boxes</Text>
            </View>
            <View style={commonStyles.rightColumn}>
              <CircularProgress percentage={50} />
            </View>
          </View>
          <View style={[commonStyles.card, { marginTop: 20, rowGap: 16 }]}>
            <Text style={commonStyles.header}>Your Contribution</Text>
            <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>
              You have deposited a total of
              <Text style={commonStyles.paragraphExtraBold}> {boxesCount.totalBoxes} </Text>boxes
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.green_label,
                  width: 50,
                  flex: 1,
                  alignItems: 'center',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}>
                <Text style={[commonStyles.header, { color: colors.white }]}>{boxesCount?.maleBoxes}</Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.red_label,
                  width: 50,
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text style={[commonStyles.header, { color: colors.white }]}>{boxesCount.femaleBoxes}</Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.light_gray,
                  width: 50,
                  flex: 1,
                  alignItems: 'center',
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <Text style={[commonStyles.header, { color: colors.dark_gray }]}>{boxesCount.unlabeledBoxes}</Text>
              </View>
            </View>
            <Text style={commonStyles.paragraph}>Great job! Keep it going!</Text>
            <TouchableOpacity style={[commonStyles.buttonNoShadow, { backgroundColor: colors.dark_blue }]} onPress={() => router.replace('/transactions')}>
              <Text style={[commonStyles.paragraphBold, { color: colors.white }]}>View Activity</Text>
            </TouchableOpacity>
          </View>
          <View style={[commonStyles.card, { marginTop: 20, rowGap: 16 }]}>
            <Text style={commonStyles.header}>Your Church</Text>
            <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>
              Rejoice in the Lord always: and again I say, Rejoice. <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>(Philippians 4:4) </Text>
            </Text>
            <Text style={commonStyles.paragraph}>
              Iglesia Cristiana Bethlehem has collected <Text style={commonStyles.paragraphExtraBold}>10,000</Text> boxes
            </Text>
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue, alignSelf: 'flex-end' }]}>See details</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
