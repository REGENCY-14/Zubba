import React from 'react';
import {
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';

const mapImage = require('../../../assets/RawMap.png');

// AppBottomNav sits at bottom-5 (20px) with a nav pill ~52px tall
const NAV_BOTTOM = 20;
const NAV_HEIGHT = 52;
const PANEL_GAP = 10;

export function DriversFoundScreen({ navigation }: RootStackScreenProps<'DriversFound'>) {
  const insets = useSafeAreaInsets();
  const panelBottom = NAV_BOTTOM + Math.max(insets.bottom, 14) + NAV_HEIGHT + PANEL_GAP;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <ImageBackground source={mapImage} className="flex-1" resizeMode="cover">

        {/* Header */}
        <View
          className="absolute top-0 left-0 right-0 h-12 bg-white flex-row items-center px-4 justify-between z-10"
          style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.07)' }}
        >
          <Pressable className="w-7 h-7 items-center justify-center" onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#1F2A33" />
          </Pressable>
          <Text className="text-base font-bold text-[#1F2A33]">Driver found</Text>
          <View className="w-7" />
        </View>

        {/* 5mins ETA bubble */}
        <View className="absolute left-[13%] top-[22%] items-center">
          <View
            className="bg-white rounded-lg px-2.5 py-1 mb-0.5 border border-[#E2E8F0]"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text className="text-[13px] font-bold text-[#1F2A33]">5mins</Text>
          </View>
          <MaterialIcons name="location-on" size={36} color="#31973D" />
        </View>

        {/* User location dot */}
        <View className="absolute left-[14%] top-[52%] w-[26px] h-[26px] rounded-full bg-[rgba(49,151,61,0.28)] items-center justify-center">
          <View className="w-3.5 h-3.5 rounded-full bg-[#31973D] border-2 border-white" />
        </View>

        {/* Dashed route line */}
        <View className="absolute left-[19%] top-[54%] w-[220px] h-0 border-t-2 border-t-[#31973D] border-dashed rotate-[15deg]" />

        {/* Driver vehicle */}
        <View className="absolute right-[7%] top-[60%]">
          <Text className="text-[28px]">🛺</Text>
        </View>

        {/* Bottom driver panel */}
        <View
          className="absolute left-0 right-0 bg-white rounded-[22px] px-3 py-4 gap-5 items-center mx-3"
          style={{
            bottom: panelBottom,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: -4 },
            elevation: 12,
          }}
        >
          {/* Bordered driver card */}
          <View className="w-full border border-[#E2E8F0] rounded-[24px] p-6 gap-6 items-center bg-white">

            {/* Avatar: square container with circular photo inside */}
            <View className="w-16 h-16 bg-[#F4F4F5] rounded-xl items-center justify-center">
              <View className="w-[54px] h-[54px] rounded-full bg-[#C7E0C9] border-2 border-[#90FA96] items-center justify-center">
                <Text className="text-lg font-bold text-[#1F2A33]">MC</Text>
              </View>
            </View>

            {/* Centered text block */}
            <View className="items-center gap-1">
              <Text
                className="text-[#1F2A33] text-base text-center"
                style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', letterSpacing: 1.6 }}
              >
                MARCUS CHEN
              </Text>

              <Text className="text-base text-[#31973D] text-center" style={{ fontFamily: 'Inter' }}>
                GHS 10.00 / distance
              </Text>

              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons name="star" size={12} color="#0D631B" />
                <Text className="text-sm text-[#0D631B]" style={{ fontFamily: 'Inter' }}>
                  4.9 • ZB-0248
                </Text>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View className="w-full gap-3">
            <Pressable
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
              onPress={() => navigation.navigate('DriverArrives')}
            >
              <Text className="text-sm text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Proceed to request
              </Text>
            </Pressable>

            <Pressable
              className="h-12 rounded-full border border-[#E2E8F0] flex-row items-center justify-center gap-2 bg-white"
              onPress={() => navigation.navigate('Home')}
            >
              <MaterialCommunityIcons name="close-circle" size={16} color="#EF4444" />
              <Text className="text-sm text-[#EF4444]" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '500' }}>
                Cancel pickup
              </Text>
            </Pressable>
          </View>
        </View>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

export default DriversFoundScreen;
