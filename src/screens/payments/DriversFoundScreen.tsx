import React from 'react';
import { ActivityIndicator, Animated, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';

const mapImage = require('../../../assets/RawMap.png');

const NEARBY_DRIVERS = [
  { name: 'Marcus Chen', initials: 'MC', rating: '4.9', code: 'ZB-0248', distance: '0.5km away', time: '3 mins', premium: true },
  { name: 'Sarah J.', initials: 'SJ', rating: '4.9', code: 'ZB-1248', distance: '0.8km away', time: '5 mins', premium: false },
  { name: 'Kwame B.', initials: 'KB', rating: '4.8', code: 'ZB-0748', distance: '1.2km away', time: '7 mins', premium: true },
];

type DriverInfo = (typeof NEARBY_DRIVERS)[number];

function DriverCard({ driver, selected, onPress }: { driver: DriverInfo; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 248,
        borderWidth: 1,
        borderColor: selected ? '#31973D' : '#E2E8F0',
        borderRadius: 24,
        padding: 16,
        gap: 16,
        backgroundColor: '#FFFFFF',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
        <View style={{ width: 64, height: 64, backgroundColor: '#F4F4F5', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 54, height: 54, borderRadius: 999, borderWidth: 2, borderColor: '#90FA96', backgroundColor: '#C7E0C9', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 14, color: '#1A1C1E' }}>{driver.initials}</Text>
          </View>
          <View style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 999, backgroundColor: '#006B23', borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
          </View>
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 14, color: '#1A1C1E' }}>{driver.name}</Text>
            {driver.premium && (
              <View style={{ backgroundColor: '#FFE088', borderRadius: 16, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 10, color: '#574500', letterSpacing: 0.48 }}>Premium</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialCommunityIcons name="star" size={11} color="#735C00" />
            <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 12, color: '#1A1C1E', letterSpacing: 0.48 }}>{driver.rating}</Text>
            <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 12, color: '#BECAB9' }}>·</Text>
            <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 14, color: '#0D631B', textTransform: 'uppercase' }}>{driver.code}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#FAFAFA' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color="#006B23" />
          <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 14, color: '#1A1C1E', letterSpacing: 0.28 }}>{driver.distance}</Text>
        </View>
        <View style={{ backgroundColor: 'rgba(0,107,35,0.05)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 12, color: '#006B23', letterSpacing: 0.48 }}>{driver.time}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function DriversFoundScreen({ navigation }: RootStackScreenProps<'DriversFound'>) {
  const insets = useSafeAreaInsets();
  const [selectedDriver, setSelectedDriver] = React.useState(0);
  const [isScanning, setIsScanning] = React.useState(true);
  const [confirmed, setConfirmed] = React.useState(false);
  const panelTranslateY = React.useRef(new Animated.Value(400)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      Animated.spring(panelTranslateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!confirmed) return;
    const timer = setTimeout(() => navigation.navigate('DriverArrives'), 5000);
    return () => clearTimeout(timer);
  }, [confirmed]);

  const navHeight = 52 + Math.max(insets.bottom, 14) + 20;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <ImageBackground source={mapImage} className="flex-1" resizeMode="cover" imageStyle={{ opacity: 0.8 }}>

        {/* Header */}
        <View
          className="h-12 bg-white flex-row items-center px-4 justify-between"
          style={{ borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.1)' }}
        >
          <Pressable className="w-7 h-7 items-center justify-center" onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={26} color="#1F2A33" />
          </Pressable>
          <Text className="text-base font-bold text-[#1F2A33]" style={{ fontFamily: 'Nexa Text-Trial' }}>Drivers found</Text>
          <View className="w-7" />
        </View>

        {/* Map overlay elements */}
        <View className="flex-1">
          {/* 5mins ETA + pin */}
          <View className="absolute left-[13%] top-[12%] items-center gap-1">
            <Text className="text-sm font-bold text-[#1F2A33]" style={{ fontFamily: 'Nexa Text-Trial' }}>5mins</Text>
            <MaterialCommunityIcons name="map-marker" size={32} color="#31973D" />
          </View>

          {/* User location dot */}
          <View className="absolute left-[14%] top-[42%] w-[34px] h-[34px] rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(49,151,61,0.25)' }}>
            <View className="w-[17px] h-[17px] rounded-full bg-[#31973D] border-2 border-white" />
          </View>

          {/* Dashed route — approximated with a rotated view */}
          <View
            className="absolute border-t-2 border-[#31973D]"
            style={{
              left: '18%',
              top: '48%',
              width: 160,
              borderStyle: 'dashed',
              transform: [{ rotate: '18deg' }],
            }}
          />
          <View
            className="absolute border-t-2 border-[#31973D]"
            style={{
              left: '52%',
              top: '46%',
              width: 110,
              borderStyle: 'dashed',
              transform: [{ rotate: '-20deg' }],
            }}
          />

          {/* Tricycle at destination */}
          <View className="absolute right-[8%] top-[52%]">
            <Text style={{ fontSize: 30 }}>🛺</Text>
          </View>
        </View>

        {/* Scanning overlay */}
        {isScanning && (
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.55)' }}>
            <ActivityIndicator size="large" color="#31973D" />
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: '#3F4A3D' }}>Finding nearby drivers...</Text>
          </View>
        )}

        {/* Bottom panel */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: navHeight,
            transform: [{ translateY: panelTranslateY }],
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            marginHorizontal: 8,
            paddingTop: 12,
            paddingBottom: 16,
            gap: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: -4 },
            elevation: 12,
          }}
        >
          {/* Handle */}
          <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#E2E8F0', alignSelf: 'center' }} />

          {confirmed ? (
            /* ── Driver detail card ── */
            <View style={{ paddingHorizontal: 12, gap: 20, alignSelf: 'stretch' }}>
              {/* White bordered card — centered column */}
              <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 24, alignItems: 'center', gap: 24 }}>

                {/* Avatar centered */}
                <View style={{ width: 64, height: 64, backgroundColor: '#F4F4F5', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 54, height: 54, borderRadius: 999, borderWidth: 2, borderColor: '#90FA96', backgroundColor: '#C7E0C9', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 14, color: '#1A1C1E' }}>{NEARBY_DRIVERS[selectedDriver].initials}</Text>
                  </View>
                  <View style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: 999, backgroundColor: '#006B23', borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
                  </View>
                </View>

                {/* Name + rating + Call/Message */}
                <View style={{ alignItems: 'center', gap: 4, alignSelf: 'stretch' }}>
                  <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 16, color: '#1F2A33', textTransform: 'uppercase', letterSpacing: 1.6, textAlign: 'center' }}>
                    {NEARBY_DRIVERS[selectedDriver].name}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="star" size={13} color="#0D631B" />
                    <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 14, color: '#0D631B' }}>
                      {NEARBY_DRIVERS[selectedDriver].rating} • ZB-Expert
                    </Text>
                  </View>

                  {/* Call + Message — 24px below rating */}
                  <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', paddingTop: 24 }}>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <MaterialCommunityIcons name="phone-outline" size={14} color="#171D14" />
                      <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 14, color: '#1F2A33' }}>Call</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <MaterialCommunityIcons name="message-outline" size={14} color="#171D14" />
                      <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 14, color: '#1F2A33' }}>Message</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Cancel pickup */}
              <Pressable
                style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 40, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onPress={() => navigation.navigate('PremiumHome')}
              >
                <MaterialCommunityIcons name="close-circle" size={16} color="#EF4444" />
                <Text style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 14, color: '#EF4444' }}>Cancel pickup</Text>
              </Pressable>
            </View>
          ) : (
            /* ── Carousel + action buttons ── */
            <>
              {/* Section header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
                <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 18, color: '#1F2A33' }}>Nearby Drivers</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,107,35,0.1)', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#31973D' }} />
                  <Text style={{ fontFamily: 'Nexa Text-Trial', fontWeight: '700', fontSize: 13, color: '#31973D' }}>Live view</Text>
                </View>
              </View>

              {/* Driver cards carousel */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              >
                {NEARBY_DRIVERS.map((driver, i) => (
                  <DriverCard
                    key={driver.code}
                    driver={driver}
                    selected={selectedDriver === i}
                    onPress={() => setSelectedDriver(i)}
                  />
                ))}
              </ScrollView>

              {/* Action buttons */}
              <View style={{ gap: 12, paddingHorizontal: 16 }}>
                <Pressable
                  style={{ backgroundColor: '#31973D', borderRadius: 40, paddingVertical: 14, alignItems: 'center' }}
                  onPress={() => setConfirmed(true)}
                >
                  <Text style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 14, color: '#FFFFFF' }}>Proceed to request</Text>
                </Pressable>
                <Pressable
                  style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 40, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onPress={() => navigation.navigate('PremiumHome')}
                >
                  <MaterialCommunityIcons name="close-circle" size={16} color="#EF4444" />
                  <Text style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 14, color: '#EF4444' }}>Cancel pickup</Text>
                </Pressable>
              </View>
            </>
          )}
        </Animated.View>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

export default DriversFoundScreen;
