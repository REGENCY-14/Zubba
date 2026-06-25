import React from 'react';
import { Animated, ImageBackground, Modal, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import AnimatedSwitch from '../../components/ui/inputs/AnimatedSwitch';
import { TextAvatar } from '../../components/onboarding/TextAvatar';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

const mapImage = require('../../../assets/RawMap.png');

type MetricCardProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor: string;
  iconBackground: string;
  accentColor: string;
  label: string;
  value: string;
  caption: string;
};

type ActionRowProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconBackground: string;
  iconColor: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonBackground: string;
  buttonBorderColor?: string;
  buttonTextColor: string;
  rowBorderColor?: string;
  borderless?: boolean;
  onButtonPress?: () => void;
  cardBg: string;
  cardBorder: string;
  titleColor: string;
  subtitleColor: string;
};

function MetricCard({ icon, iconColor, iconBackground, accentColor, label, value, caption, cardBg, cardBorder, valueColor, captionColor }: MetricCardProps & { cardBg: string; cardBorder: string; valueColor: string; captionColor: string }) {
  return (
    <View
      style={{
        flex: 1,
        minHeight: 132,
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: cardBorder,
        backgroundColor: cardBg,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: iconBackground }}>
          <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={{ fontSize: 12, lineHeight: 14, letterSpacing: 1.2, fontWeight: '600', fontFamily: 'Poppins', color: accentColor }}>{label}</Text>
      </View>
      <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', fontFamily: 'Poppins', color: valueColor, marginBottom: 2 }}>{value}</Text>
      <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: '500', fontFamily: 'Poppins', color: captionColor }}>{caption}</Text>
    </View>
  );
}

function ActionRow({
  icon,
  iconBackground,
  iconColor,
  title,
  subtitle,
  buttonLabel,
  buttonBackground,
  buttonBorderColor,
  buttonTextColor,
  rowBorderColor,
  borderless,
  onButtonPress,
  cardBg,
  cardBorder,
  titleColor,
  subtitleColor,
}: ActionRowProps) {
  return (
    <View
      style={[
        {
          minHeight: 72,
          padding: 12,
          borderRadius: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        },
        !borderless
          ? {
              borderWidth: 1,
              backgroundColor: cardBg,
              borderColor: rowBorderColor ?? cardBorder,
            }
          : {},
      ]}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: iconBackground }}>
          <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', fontFamily: 'Poppins', color: titleColor }}>{title}</Text>
          <Text style={{ marginTop: 2, fontSize: 10, lineHeight: 16, fontWeight: '700', fontFamily: 'Poppins', color: subtitleColor }}>{subtitle}</Text>
        </View>
      </View>
      <Pressable
        onPress={onButtonPress}
        disabled={!onButtonPress}
        style={{
          minWidth: 100,
          height: 40,
          borderRadius: 24,
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          backgroundColor: buttonBackground,
          borderColor: buttonBorderColor ?? 'transparent',
        }}
      >
        <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', fontFamily: 'Plus Jakarta Sans', color: buttonTextColor }}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

export function PremiumHomeScreen({ navigation }: RootStackScreenProps<'PremiumHome'>) {
  const [searchQuery, setSearchQuery] = React.useState('Tarkwa, UMaT Campus, Hall 3');
  const [activeTab, setActiveTab] = React.useState<'pickup' | 'driver'>('pickup');
  const [binFull, setBinFull] = React.useState(true);
  const [showBusyModal, setShowBusyModal] = React.useState(false);
  const { colors } = useTheme();
  const toastOpacity = React.useRef(new Animated.Value(0)).current;
  const toastTranslateY = React.useRef(new Animated.Value(-12)).current;
  const toastTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
    toastTimeout.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(toastTranslateY, { toValue: -12, duration: 200, useNativeDriver: true }),
      ]).start();
    }, 3000);
  };

  const handleBinFull = (value: boolean) => {
    setBinFull(value);
    if (value) showToast();
  };

  React.useEffect(() => {
    if (activeTab === 'driver' && searchQuery.trim().toLowerCase().includes('marcus chen')) {
      setShowBusyModal(true);
    }
  }, [searchQuery, activeTab]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ImageBackground source={mapImage} resizeMode="cover" style={{ flex: 1, backgroundColor: colors.surface }} imageStyle={{ opacity: 0.72 }}>
        {/* Top bar */}
        <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10} style={{ width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' }}>
            <MaterialIcons name="menu" size={22} color={colors.iconColor} />
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 9, fontWeight: '600', color: colors.textSub, lineHeight: 14, fontFamily: 'Poppins' }}>Bin Full?</Text>
            <AnimatedSwitch value={binFull} onChange={handleBinFull} />
          </View>

          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            hitSlop={10}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.iconColor} />
            <View style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
          </Pressable>
        </View>

        {/* Search / pill card */}
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 4,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 16,
            padding: 12,
            gap: 12,
            opacity: 0.97,
          }}
        >
          {/* Tab pills */}
          <View style={{ flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 39, padding: 10, gap: 8 }}>
            <Pressable
              style={[
                { flex: 1, height: 40, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
                activeTab === 'pickup' ? { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border } : {},
              ]}
              onPress={() => { setActiveTab('pickup'); setSearchQuery('Tarkwa, UMaT Campus, Hall 3'); }}
            >
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text, fontFamily: 'Plus Jakarta Sans', fontWeight: activeTab === 'pickup' ? '600' : '400' }}>Pickup location</Text>
            </Pressable>
            <Pressable
              style={[
                { flex: 1, height: 40, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
                activeTab === 'driver' ? { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border } : {},
              ]}
              onPress={() => { setActiveTab('driver'); setSearchQuery(''); }}
            >
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text, fontFamily: 'Plus Jakarta Sans', fontWeight: activeTab === 'driver' ? '600' : '400' }}>Find Driver</Text>
            </Pressable>
          </View>

          {/* Search input */}
          <View
            style={{
              height: 54,
              borderRadius: 27,
              borderWidth: 1,
              backgroundColor: colors.card,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              borderColor: colors.border,
            }}
          >
            <TextInput
              style={{ flex: 1, fontSize: 14, lineHeight: 17, paddingVertical: 0, paddingHorizontal: 0, margin: 0, fontFamily: 'Inter', color: colors.text }}
              placeholder={activeTab === 'driver' ? 'search driver by name, unique....' : 'Where is your waste?'}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              selectionColor="#31973D"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={10}>
                <MaterialIcons name="cancel" size={18} color="#EF4444" />
              </Pressable>
            )}
          </View>

          {/* Driver avatars row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, gap: 12 }}>
            <View style={{ flexDirection: 'row', width: 40 }}>
              <TextAvatar name="A B" size={24} bgColor="#90FA96" />
              <View style={{ marginLeft: -8 }}>
                <TextAvatar name="B C" size={24} bgColor="#FFE088" />
              </View>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.textSub, lineHeight: 16, fontFamily: 'Poppins' }}>3 verified drivers nearby</Text>
            <View style={{ flex: 1 }} />
            <View style={{ backgroundColor: '#148732', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 10, color: '#FFFFFF', lineHeight: 15, fontFamily: 'Poppins' }}>NEW</Text>
            </View>
          </View>

          {/* Metric cards */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <MetricCard
              icon="recycle"
              iconColor="#2F9E44"
              iconBackground="rgba(47, 158, 68, 0.08)"
              accentColor="#31973D"
              label="ACTIVE"
              value="42kg"
              caption="Recycled this month"
              cardBg={colors.card}
              cardBorder={colors.border}
              valueColor={colors.text}
              captionColor={colors.textSub}
            />
            <MetricCard
              icon="star-circle-outline"
              iconColor="#8B6B00"
              iconBackground="rgba(255, 224, 136, 0.38)"
              accentColor="#8B6B00"
              label="POINTS"
              value="1,250"
              caption="Eco Credits earned"
              cardBg={colors.card}
              cardBorder={colors.border}
              valueColor={colors.text}
              captionColor={colors.textSub}
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* Action rows */}
        <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colors.surface, borderRadius: 21, gap: 4 }}>
          <ActionRow
            icon="truck-outline"
            iconBackground="rgba(47, 158, 68, 0.08)"
            iconColor="#2F9E44"
            title="Find nearby tricycles"
            subtitle="Instant pickup"
            buttonLabel="Request now"
            buttonBackground="#31973D"
            buttonTextColor="#FFFFFF"
            onButtonPress={() => navigation.navigate('DriversFound')}
            cardBg={colors.card}
            cardBorder={colors.border}
            titleColor={colors.text}
            subtitleColor={colors.textSub}
          />
          <ActionRow
            icon="calendar-month-outline"
            iconBackground="#EFF5FF"
            iconColor="#508BFE"
            title="Plan future pickup"
            subtitle="Future service"
            buttonLabel="Plan for later"
            buttonBackground="#FFE088"
            buttonTextColor="#1F2A33"
            rowBorderColor="#FFE088"
            onButtonPress={() => navigation.navigate('PlanForLater')}
            cardBg={colors.card}
            cardBorder={colors.border}
            titleColor={colors.text}
            subtitleColor={colors.textSub}
          />
        </View>

        <View style={{ height: 92 }} />

        {/* Toast */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 56,
            alignSelf: 'center',
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslateY }],
          }}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 999, backgroundColor: '#31973D', paddingHorizontal: 24, paddingVertical: 12, width: 304 }}
          >
            <MaterialCommunityIcons name="check-circle-outline" size={20} color="#FFFFFF" />
            <Text style={{ fontSize: 12, lineHeight: 20, color: '#FFFFFF', fontFamily: 'Inter', fontWeight: '500' }}>
              Bin Signal Sent. Your driver will call you.
            </Text>
          </View>
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

      {/* Busy driver modal */}
      <Modal visible={showBusyModal} transparent animationType="fade">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <View style={{ width: 350, backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: 'center', gap: 12 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
              <MaterialCommunityIcons name="calendar-remove-outline" size={30} color="#31973D" />
            </View>

            <Text style={{ fontSize: 24, fontWeight: '500', lineHeight: 28, color: colors.text, textAlign: 'center', fontFamily: 'Poppins' }}>Driver is currently busy</Text>

            <Text style={{ fontSize: 14, lineHeight: 21, color: colors.textSub, textAlign: 'center', paddingHorizontal: 8, fontFamily: 'Inter' }}>
              This driver just started another waste collection task. You can schedule your pickup for later or find another available partner nearby.
            </Text>

            <View style={{ alignSelf: 'stretch', gap: 8, marginTop: 4 }}>
              <Pressable style={{ height: 48, backgroundColor: '#31973D', borderRadius: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <MaterialCommunityIcons name="calendar-outline" size={16} color="#FFFFFF" />
                <Text style={{ fontSize: 14, lineHeight: 20, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>Schedule for later</Text>
              </Pressable>
              <Pressable
                style={{ height: 48, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onPress={() => setShowBusyModal(false)}
              >
                <MaterialCommunityIcons name="account-search-outline" size={16} color={colors.text} />
                <Text style={{ fontSize: 14, fontWeight: '500', lineHeight: 20, color: colors.text, fontFamily: 'Plus Jakarta Sans' }}>Choose another driver</Text>
              </Pressable>
              <Pressable style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }} onPress={() => setShowBusyModal(false)}>
                <MaterialCommunityIcons name="close-circle-outline" size={16} color="#EA0707" />
                <Text style={{ fontSize: 14, lineHeight: 20, color: '#EA0707', fontFamily: 'Plus Jakarta Sans' }}>Cancel request</Text>
              </Pressable>
            </View>

            <View style={{ alignSelf: 'stretch', borderTopWidth: 1, borderTopColor: colors.borderLight, marginTop: 4 }} />

            <View style={{ alignSelf: 'stretch', gap: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingBottom: 12 }}>
                <View style={{ width: 64, height: 64, backgroundColor: colors.iconBg, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#90FA96', backgroundColor: '#C7E0C9', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: 'Inter' }}>MC</Text>
                  </View>
                  <View style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#006B23', borderWidth: 2, borderColor: colors.card, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
                  </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 14, lineHeight: 24, color: colors.text, fontFamily: 'Inter' }}>Marcus Chen</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="star" size={12} color="#735C00" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, letterSpacing: 0.48, fontFamily: 'Inter' }}>4.9</Text>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: 'Inter' }}>·</Text>
                    <Text style={{ fontSize: 14, lineHeight: 20, color: '#0D631B', textTransform: 'uppercase', fontFamily: 'Inter' }}>ZB-0248</Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.borderLight }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialCommunityIcons name="map-marker-outline" size={14} color="#006B23" />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, letterSpacing: 0.28, fontFamily: 'Nexa Text-Trial' }}>0.5km away</Text>
                </View>
                <View style={{ borderRadius: 40, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: 'rgba(0,107,35,0.05)' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#006B23', letterSpacing: 0.48, fontFamily: 'Inter' }}>3 mins</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
