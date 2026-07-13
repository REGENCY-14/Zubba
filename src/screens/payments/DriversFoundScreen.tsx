import React from 'react';
import { ActivityIndicator, Animated, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

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
        width: 312,
        height: 134,
        borderWidth: 1,
        borderColor: selected ? '#31973D' : '#E2E8F0',
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Avatar */}
      <View style={{ position: 'relative', width: 40, height: 40 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 11, color: '#FFFFFF', letterSpacing: -0.03 * 11 }}>{driver.initials}</Text>
        </View>
        <View style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#419E6A' }} />
        </View>
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 4 }}>
        {/* Name + badge */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 28, letterSpacing: -0.48, color: '#0F1621' }}>{driver.name}</Text>
          {driver.premium && (
            <View style={{ backgroundColor: '#FFE088', borderRadius: 16, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 10, lineHeight: 14, letterSpacing: 0.48, color: '#574500' }}>Premium</Text>
            </View>
          )}
        </View>

        {/* Rating + code */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MaterialCommunityIcons name="star" size={11} color="#735C00" />
          <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 12, letterSpacing: 0.48, color: '#1A1C1E' }}>{driver.rating}</Text>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 12, letterSpacing: 0.48, color: '#BECAB9' }}>•</Text>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 14, color: '#0D631B', textTransform: 'uppercase' }}>{driver.code}</Text>
        </View>

        {/* Divider */}
        <View style={{ borderTopWidth: 1, borderTopColor: '#FAFAFA', marginTop: 4, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="map-marker-outline" size={13} color="#006B23" />
            <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 14, letterSpacing: 0.28, color: '#1A1C1E' }}>{driver.distance}</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(0,107,35,0.05)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 12, letterSpacing: 0.48, color: '#006B23' }}>{driver.time}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function DriversFoundScreen({ navigation }: RootStackScreenProps<'DriversFound'>) {
  const { colors } = useTheme();
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

  // bottomOffset(8) + paddingBottom + pill(48) + gap(40)
  const navHeight = 8 + Math.max(insets.bottom, 14) + 48 + 40;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <ImageBackground source={mapImage} style={{ flex: 1 }} resizeMode="cover" imageStyle={{ opacity: 0.8 }}>

        {/* Header */}
        <View
          style={{ height: 48, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: colors.border }}
        >
          <Pressable style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={26} color={colors.text} />
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text, fontFamily: 'Poppins' }}>Drivers found</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Map overlay elements */}
        <View style={{ flex: 1 }}>
          {/* 5mins ETA + pin */}
          <View style={{ position: 'absolute', left: '13%', top: '12%', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1F2A33', fontFamily: 'Poppins' }}>5mins</Text>
            <MaterialCommunityIcons name="map-marker" size={32} color="#31973D" />
          </View>

          {/* User location dot */}
          <View style={{ position: 'absolute', left: '14%', top: '42%', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(49,151,61,0.25)' }}>
            <View style={{ width: 17, height: 17, borderRadius: 8.5, backgroundColor: '#31973D', borderWidth: 2, borderColor: '#FFFFFF' }} />
          </View>

          {/* Dashed route — approximated with a rotated view */}
          <View
            style={{
              position: 'absolute',
              left: '18%',
              top: '48%',
              width: 160,
              borderTopWidth: 2,
              borderColor: '#31973D',
              borderStyle: 'dashed',
              transform: [{ rotate: '18deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: '52%',
              top: '46%',
              width: 110,
              borderTopWidth: 2,
              borderColor: '#31973D',
              borderStyle: 'dashed',
              transform: [{ rotate: '-20deg' }],
            }}
          />

          {/* Tricycle at destination */}
          <View style={{ position: 'absolute', right: '8%', top: '52%' }}>
            <Text style={{ fontSize: 30 }}>🛺</Text>
          </View>
        </View>

        {/* Scanning overlay */}
        {isScanning && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.55)' }}>
            <ActivityIndicator size="large" color="#31973D" />
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: '#3F4A3D' }}>Finding nearby drivers...</Text>
          </View>
        )}

        {/* Bottom panel */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: navHeight,
            transform: [{ translateY: panelTranslateY }],
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            paddingTop: 12,
            paddingBottom: 24,
            paddingHorizontal: 0,
            gap: 16,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: -4 },
            elevation: 10,
          }}
        >
          {/* Handle */}
          <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#E2E8F0', alignSelf: 'center' }} />

          {confirmed ? (
            /* ── Driver selected ── */
            <>
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 }}>
                <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 16, lineHeight: 24, color: '#000000' }}>Driver selected</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,107,35,0.1)', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#31973D' }} />
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 13, color: '#31973D' }}>Live view</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: '#E2E8F0' }} />

              {/* Centered driver info */}
              <View style={{ alignItems: 'center', gap: 12, paddingHorizontal: 24 }}>
                {/* Avatar */}
                <View style={{ position: 'relative', width: 40, height: 40 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 11, color: '#FFFFFF' }}>{NEARBY_DRIVERS[selectedDriver].initials}</Text>
                  </View>
                  <View style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#419E6A' }} />
                  </View>
                </View>

                {/* Name + price + rating */}
                <View style={{ alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 16, lineHeight: 24, letterSpacing: 1.6, textTransform: 'uppercase', color: '#1F2A33', textAlign: 'center' }}>
                    {NEARBY_DRIVERS[selectedDriver].name}
                  </Text>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 16, lineHeight: 24, color: '#31973D', textAlign: 'center' }}>
                    GHS 20.00 / distance
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="star" size={12} color="#0D631B" />
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 14, lineHeight: 20, color: '#0D631B' }}>
                      {NEARBY_DRIVERS[selectedDriver].rating} • ZB-Expert
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action row: X + Proceed to request */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24 }}>
                <Pressable
                  style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFE2E2', alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => navigation.navigate('PremiumHome')}
                >
                  <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
                </Pressable>
                <Pressable
                  style={{ flex: 1, height: 40, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => navigation.navigate('DriverArrives')}
                >
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, lineHeight: 20, color: '#FFFFFF' }}>Proceed to request</Text>
                </Pressable>
              </View>
            </>
          ) : (
            /* ── Carousel + action buttons ── */
            <>
              {/* Section header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 }}>
                <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 16, lineHeight: 24, color: '#000000' }}>Nearby drivers</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,107,35,0.1)', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#31973D' }} />
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 13, color: '#31973D' }}>Live view</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: '#E2E8F0' }} />

              {/* Driver cards carousel */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 4 }}
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

              {/* Action row: X + Proceed */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24 }}>
                <Pressable
                  style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFE2E2', alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => navigation.navigate('PremiumHome')}
                >
                  <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
                </Pressable>
                <Pressable
                  style={{ flex: 1, height: 40, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => setConfirmed(true)}
                >
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, lineHeight: 20, color: '#FFFFFF' }}>Proceed</Text>
                </Pressable>
              </View>
            </>
          )}
        </Animated.View>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          showCalendar
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Pickups')}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Schedule')}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

export default DriversFoundScreen;
