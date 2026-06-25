import React from 'react';
import { Animated, ImageBackground, Modal, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import AnimatedSwitch from '../../components/ui/inputs/AnimatedSwitch';
import { TextAvatar } from '../../components/onboarding/TextAvatar';
import type { RootStackScreenProps } from '../../navigation/types';

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
};

function MetricCard({ icon, iconColor, iconBackground, accentColor, label, value, caption }: MetricCardProps) {
  return (
    <View className="flex-1 min-h-[132px] p-4 rounded-3xl border border-[#E2E8F0]" style={{ backgroundColor: 'rgba(255,255,255,0.96)' }}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="w-[22px] h-[22px] rounded-full items-center justify-center" style={{ backgroundColor: iconBackground }}>
          <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
        </View>
        <Text className="text-xs leading-[14px] tracking-[1.2px] font-semibold" style={{ fontFamily: 'Poppins', color: accentColor }}>{label}</Text>
      </View>
      <Text className="text-xl leading-7 font-semibold text-[#1F2A33] mb-[2px]" style={{ fontFamily: 'Poppins' }}>{value}</Text>
      <Text className="text-sm leading-[21px] font-medium text-[#6F7A6C]" style={{ fontFamily: 'Poppins' }}>{caption}</Text>
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
}: ActionRowProps) {
  return (
    <View
      className={`min-h-[72px] p-3 rounded-[40px] flex-row items-center justify-between gap-3 ${borderless ? 'border-0' : 'border bg-white'}`}
      style={!borderless ? { borderColor: rowBorderColor ?? '#E2E8F0' } : undefined}
    >
      <View className="flex-1 flex-row items-center gap-2 min-w-0">
        <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: iconBackground }}>
          <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-sm leading-5 font-medium text-[#1F2A33]" style={{ fontFamily: 'Poppins' }}>{title}</Text>
          <Text className="mt-[2px] text-[10px] leading-4 font-bold text-[#64748A]" style={{ fontFamily: 'Poppins' }}>{subtitle}</Text>
        </View>
      </View>
      <Pressable
        onPress={onButtonPress}
        disabled={!onButtonPress}
        className="min-w-[100px] h-10 rounded-3xl px-4 items-center justify-center border active:opacity-[0.88]"
        style={{ backgroundColor: buttonBackground, borderColor: buttonBorderColor ?? 'transparent' }}
      >
        <Text className="text-sm leading-5 font-medium" style={{ fontFamily: 'Plus Jakarta Sans', color: buttonTextColor }}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

export function PremiumHomeScreen({ navigation }: RootStackScreenProps<'PremiumHome'>) {
  const [searchQuery, setSearchQuery] = React.useState('Tarkwa, UMaT Campus, Hall 3');
  const [activeTab, setActiveTab] = React.useState<'pickup' | 'driver'>('pickup');
  const [binFull, setBinFull] = React.useState(true);
  const [showBusyModal, setShowBusyModal] = React.useState(false);
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
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ImageBackground source={mapImage} resizeMode="cover" className="flex-1 bg-[#F8FAFC]" imageStyle={{ opacity: 0.72 }}>
        <View className="h-12 px-4 flex-row items-center justify-between">
          <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10} className="w-8 h-8 items-start justify-center">
            <MaterialIcons name="menu" size={22} color="#111827" />
          </Pressable>

          <View className="flex-row items-center gap-[6px]">
            <Text className="text-[9px] font-semibold text-[#3F4A3D] leading-[14px]" style={{ fontFamily: 'Poppins' }}>Bin Full?</Text>
            <AnimatedSwitch value={binFull} onChange={handleBinFull} />
          </View>

          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            hitSlop={10}
            className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] items-center justify-center"
            style={{ shadowColor: '#000000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color="#1F2937" />
            <View className="absolute top-2 right-[9px] w-2 h-2 rounded-full bg-[#EF4444]" />
          </Pressable>
        </View>

        <View className="mx-[10px] mt-1 bg-white/95 border border-[#E2E8F0] rounded-2xl p-3 gap-3">
          <View className="flex-row bg-[#F3F3F6] rounded-[39px] p-[10px] gap-2">
            <Pressable
              className={`flex-1 h-10 rounded-[29px] items-center justify-center ${activeTab === 'pickup' ? 'bg-white border border-[#E2E8F0]' : ''}`}
              onPress={() => { setActiveTab('pickup'); setSearchQuery('Tarkwa, UMaT Campus, Hall 3'); }}
            >
              <Text className={`text-sm leading-5 text-[#1F2A33] ${activeTab === 'pickup' ? 'font-semibold' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>Pickup location</Text>
            </Pressable>
            <Pressable
              className={`flex-1 h-10 rounded-[29px] items-center justify-center ${activeTab === 'driver' ? 'bg-white border border-[#E2E8F0]' : ''}`}
              onPress={() => { setActiveTab('driver'); setSearchQuery(''); }}
            >
              <Text className={`text-sm leading-5 text-[#1F2A33] ${activeTab === 'driver' ? 'font-semibold' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>Find Driver</Text>
            </Pressable>
          </View>

          <View className="h-[54px] rounded-[27px] border bg-white px-4 flex-row items-center gap-2" style={{ borderColor: 'rgba(0,0,0,0.11)' }}>
            <TextInput
              className="flex-1 text-sm leading-[17px] py-0 px-0 m-0"
              style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.5)' }}
              placeholder={activeTab === 'driver' ? 'search driver by name, unique....' : 'Where is your waste?'}
              placeholderTextColor="rgba(0,0,0,0.4)"
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

          <View className="flex-row items-center px-1 gap-3">
            <View className="flex-row w-10">
              <TextAvatar name="A B" size={24} bgColor="#90FA96" />
              <View className="-ml-2">
                <TextAvatar name="B C" size={24} bgColor="#FFE088" />
              </View>
            </View>
            <Text className="text-xs font-medium text-[#3F4A3D] leading-4" style={{ fontFamily: 'Poppins' }}>3 verified drivers nearby</Text>
            <View className="flex-1" />
            <View className="bg-[#148732] rounded-full px-2 py-[2px]">
              <Text className="text-[10px] text-white leading-[15px]" style={{ fontFamily: 'Poppins' }}>NEW</Text>
            </View>
          </View>

          <View className="flex-row gap-[10px] mt-1">
            <MetricCard
              icon="recycle"
              iconColor="#2F9E44"
              iconBackground="rgba(47, 158, 68, 0.08)"
              accentColor="#31973D"
              label="ACTIVE"
              value="42kg"
              caption="Recycled this month"
            />
            <MetricCard
              icon="star-circle-outline"
              iconColor="#8B6B00"
              iconBackground="rgba(255, 224, 136, 0.38)"
              accentColor="#8B6B00"
              label="POINTS"
              value="1,250"
              caption="Eco Credits earned"
            />
          </View>
        </View>

        <View className="flex-1" />

        <View className="px-[10px] py-[10px] bg-[#F9F9F9] rounded-[21px] gap-1">
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
          />
        </View>

        <View className="h-[92px]" />

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
            className="flex-row items-center gap-3 rounded-full"
            style={{ backgroundColor: '#31973D', paddingHorizontal: 24, paddingVertical: 12, width: 304 }}
          >
            <MaterialCommunityIcons name="check-circle-outline" size={20} color="#FFFFFF" />
            <Text className="text-xs leading-5 text-white" style={{ fontFamily: 'Inter', fontWeight: '500' }}>
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

      <Modal visible={showBusyModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center px-5" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <View className="w-[350px] bg-white rounded-2xl p-6 items-center gap-3">
            <View className="w-16 h-16 rounded-full bg-[#EEEEF0] items-center justify-center mb-1">
              <MaterialCommunityIcons name="calendar-remove-outline" size={30} color="#31973D" />
            </View>

            <Text className="text-2xl font-medium leading-7 text-[#1A1C1E] text-center" style={{ fontFamily: 'Poppins' }}>Driver is currently busy</Text>

            <Text className="text-sm leading-[21px] text-[#3F4A3D] text-center px-2" style={{ fontFamily: 'Inter' }}>
              This driver just started another waste collection task. You can schedule your pickup for later or find another available partner nearby.
            </Text>

            <View className="self-stretch gap-2 mt-1">
              <Pressable className="h-12 bg-[#31973D] rounded-[40px] flex-row items-center justify-center gap-2">
                <MaterialCommunityIcons name="calendar-outline" size={16} color="#FFFFFF" />
                <Text className="text-sm leading-5 text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>Schedule for later</Text>
              </Pressable>
              <Pressable className="h-12 bg-white border border-[#E2E8F0] rounded-[40px] flex-row items-center justify-center gap-2" onPress={() => setShowBusyModal(false)}>
                <MaterialCommunityIcons name="account-search-outline" size={16} color="#1F2A33" />
                <Text className="text-sm font-medium leading-5 text-[#1F2A33]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Choose another driver</Text>
              </Pressable>
              <Pressable className="h-12 flex-row items-center justify-center gap-2" onPress={() => setShowBusyModal(false)}>
                <MaterialCommunityIcons name="close-circle-outline" size={16} color="#EA0707" />
                <Text className="text-sm leading-5 text-[#EA0707]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Cancel request</Text>
              </Pressable>
            </View>

            <View className="self-stretch border-t border-t-[#E2E8F0] mt-1" />

            <View className="self-stretch gap-0">
              <View className="flex-row items-start gap-4 pb-3">
                <View className="w-16 h-16 bg-[#F4F4F5] rounded-xl items-center justify-center">
                  <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] bg-[#C7E0C9] items-center justify-center">
                    <Text className="text-base font-bold text-[#1A1C1E]" style={{ fontFamily: 'Inter' }}>MC</Text>
                  </View>
                  <View className="absolute bottom-[-2px] right-[-2px] w-[22px] h-[22px] rounded-full bg-[#006B23] border-2 border-white items-center justify-center">
                    <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
                  </View>
                </View>

                <View className="flex-1 justify-center gap-[6px]">
                  <Text className="text-sm leading-6 text-[#1A1C1E]" style={{ fontFamily: 'Inter' }}>Marcus Chen</Text>
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons name="star" size={12} color="#735C00" />
                    <Text className="text-xs font-bold text-[#1A1C1E] tracking-[0.48px]" style={{ fontFamily: 'Inter' }}>4.9</Text>
                    <Text className="text-xs text-[#BECAB9]" style={{ fontFamily: 'Inter' }}>·</Text>
                    <Text className="text-sm leading-5 text-[#0D631B] uppercase" style={{ fontFamily: 'Inter' }}>ZB-0248</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-3 border-t border-t-[#FAFAFA]">
                <View className="flex-row items-center gap-[6px]">
                  <MaterialCommunityIcons name="map-marker-outline" size={14} color="#006B23" />
                  <Text className="text-sm font-bold text-[#1A1C1E] tracking-[0.28px]" style={{ fontFamily: 'Nexa Text-Trial' }}>0.5km away</Text>
                </View>
                <View className="rounded-[40px] px-[10px] py-[3px]" style={{ backgroundColor: 'rgba(0,107,35,0.05)' }}>
                  <Text className="text-xs font-bold text-[#006B23] tracking-[0.48px]" style={{ fontFamily: 'Inter' }}>3 mins</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
