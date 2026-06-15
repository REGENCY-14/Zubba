import React from 'react';
import { ImageBackground, Modal, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../components';
import type { RootStackScreenProps } from '../navigation/types';

const mapImage = require('../../assets/RawMap.png');

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
  borderless?: boolean;
  onButtonPress?: () => void;
};

function MetricCard({ icon, iconColor, iconBackground, accentColor, label, value, caption }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeaderRow}>
        <View style={[styles.metricIconWrap, { backgroundColor: iconBackground }]}>
          <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[styles.metricLabel, { color: accentColor }]}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricCaption}>{caption}</Text>
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
  borderless,
  onButtonPress,
}: ActionRowProps) {
  return (
    <View style={[styles.actionRow, borderless && styles.actionRowBorderless]}>
      <View style={styles.actionInfoRow}>
        <View style={[styles.actionIconWrap, { backgroundColor: iconBackground }]}>
          <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.actionTextColumn}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Pressable
        onPress={onButtonPress}
        disabled={!onButtonPress}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: buttonBackground, borderColor: buttonBorderColor ?? 'transparent' },
          pressed && onButtonPress && styles.actionButtonPressed,
        ]}
      >
        <Text style={[styles.actionButtonLabel, { color: buttonTextColor }]}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

export function PremiumHomeScreen({ navigation }: RootStackScreenProps<'PremiumHome'>) {
  const [searchQuery, setSearchQuery] = React.useState('Tarkwa, UMaT Campus, Hall 3');
  const [activeTab, setActiveTab] = React.useState<'pickup' | 'driver'>('pickup');
  const [binFull, setBinFull] = React.useState(true);
  const [showBusyModal, setShowBusyModal] = React.useState(false);

  React.useEffect(() => {
    if (activeTab === 'driver' && searchQuery.trim().toLowerCase().includes('marcus chen')) {
      setShowBusyModal(true);
    }
  }, [searchQuery, activeTab]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ImageBackground source={mapImage} resizeMode="cover" style={styles.background} imageStyle={styles.backgroundImage}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10} style={styles.iconButton}>
            <MaterialIcons name="menu" size={22} color="#111827" />
          </Pressable>

          <View style={styles.binFullRow}>
            <Text style={styles.binFullLabel}>Bin Full?</Text>
            <Pressable onPress={() => setBinFull(v => !v)} style={[styles.toggleTrack, binFull && styles.toggleTrackActive]}>
              <View style={[styles.toggleKnob, binFull && styles.toggleKnobActive]} />
            </Pressable>
          </View>

          <Pressable onPress={() => navigation.navigate('Notifications')} hitSlop={10} style={styles.bellButton}>
            <MaterialCommunityIcons name="bell-outline" size={22} color="#1F2937" />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* Floating search panel */}
        <View style={styles.searchPanel}>
          {/* Tab selector */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === 'pickup' && styles.tabActive]}
              onPress={() => { setActiveTab('pickup'); setSearchQuery('Tarkwa, UMaT Campus, Hall 3'); }}
            >
              <Text style={[styles.tabText, activeTab === 'pickup' && styles.tabTextActive]}>Pickup location</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'driver' && styles.tabActive]}
              onPress={() => { setActiveTab('driver'); setSearchQuery(''); }}
            >
              <Text style={[styles.tabText, activeTab === 'driver' && styles.tabTextActive]}>Find Driver</Text>
            </Pressable>
          </View>

          {/* Location box */}
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
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

          {/* Driver availability row */}
          <View style={styles.driverRow}>
            <View style={styles.avatarGroup}>
              <View style={[styles.avatar, { backgroundColor: '#90FA96' }]}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <View style={[styles.avatar, { backgroundColor: '#FFE088', marginLeft: -8 }]}>
                <Text style={styles.avatarText}>B</Text>
              </View>
            </View>
            <Text style={styles.driversText}>3 verified drivers nearby</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          </View>
        </View>

        {/* Stats bento grid */}
        <View style={styles.statsRow}>
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

        {/* Map spacer */}
        <View style={{ flex: 1 }} />

        {/* Action rows panel */}
        <View style={styles.actionsSection}>
          <ActionRow
            icon="truck-outline"
            iconBackground="rgba(47, 158, 68, 0.08)"
            iconColor="#2F9E44"
            title="Find nearby tricycles"
            subtitle="Instant pickup"
            buttonLabel="Request now"
            buttonBackground="#31973D"
            buttonTextColor="#FFFFFF"
            onButtonPress={() => navigation.navigate('Scanning')}
          />
          <ActionRow
            icon="shopping-outline"
            iconBackground="#EFF5FF"
            iconColor="#508BFE"
            title="Plan future pickup"
            subtitle="Future service"
            buttonLabel="Plan for later"
            buttonBackground="#FFE088"
            buttonTextColor="#1F2A33"
            borderless
          />
        </View>

        {/* Nav spacer */}
        <View style={{ height: 92 }} />

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </ImageBackground>

      {/* Driver busy modal */}
      <Modal visible={showBusyModal} transparent animationType="fade">
        <View style={busyStyles.overlay}>
          <View style={busyStyles.card}>
            {/* Status icon */}
            <View style={busyStyles.statusIconWrap}>
              <MaterialCommunityIcons name="calendar-remove-outline" size={30} color="#31973D" />
            </View>

            {/* Heading */}
            <Text style={busyStyles.heading}>Driver is currently busy</Text>

            {/* Subtitle */}
            <Text style={busyStyles.subtitle}>
              This driver just started another waste collection task. You can schedule your pickup for later or find another available partner nearby.
            </Text>

            {/* Action buttons */}
            <View style={busyStyles.buttons}>
              <Pressable style={busyStyles.primaryBtn}>
                <MaterialCommunityIcons name="calendar-outline" size={16} color="#FFFFFF" />
                <Text style={busyStyles.primaryBtnText}>Schedule for later</Text>
              </Pressable>
              <Pressable style={busyStyles.secondaryBtn} onPress={() => setShowBusyModal(false)}>
                <MaterialCommunityIcons name="account-search-outline" size={16} color="#1F2A33" />
                <Text style={busyStyles.secondaryBtnText}>Choose another driver</Text>
              </Pressable>
              <Pressable style={busyStyles.cancelBtn} onPress={() => setShowBusyModal(false)}>
                <MaterialCommunityIcons name="close-circle-outline" size={16} color="#EA0707" />
                <Text style={busyStyles.cancelBtnText}>Cancel request</Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={busyStyles.divider} />

            {/* Driver preview card */}
            <View style={busyStyles.driverCard}>
              <View style={busyStyles.driverCardTop}>
                {/* Photo */}
                <View style={busyStyles.photoOuter}>
                  <View style={busyStyles.photoCircle}>
                    <Text style={busyStyles.photoInitials}>MC</Text>
                  </View>
                  <View style={busyStyles.verifiedBadge}>
                    <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
                  </View>
                </View>

                {/* Driver info */}
                <View style={busyStyles.driverInfo}>
                  <Text style={busyStyles.driverName}>Marcus Chen</Text>
                  <View style={busyStyles.driverMeta}>
                    <MaterialCommunityIcons name="star" size={12} color="#735C00" />
                    <Text style={busyStyles.ratingText}>4.9</Text>
                    <Text style={busyStyles.metaDot}>·</Text>
                    <Text style={busyStyles.driverCode}>ZB-0248</Text>
                  </View>
                </View>
              </View>

              {/* Bottom row */}
              <View style={busyStyles.driverCardBottom}>
                <View style={busyStyles.distanceRow}>
                  <MaterialCommunityIcons name="map-marker-outline" size={14} color="#006B23" />
                  <Text style={busyStyles.distanceText}>0.5km away</Text>
                </View>
                <View style={busyStyles.timePill}>
                  <Text style={busyStyles.timePillText}>3 mins</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  background: { flex: 1, backgroundColor: '#F8FAFC' },
  backgroundImage: { opacity: 0.72 },

  /* Header */
  headerRow: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
  binFullRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  binFullLabel: {
    fontFamily: 'Poppins',
    fontSize: 9,
    fontWeight: '600',
    color: '#3F4A3D',
    lineHeight: 14,
  },
  toggleTrack: {
    width: 36,
    height: 20,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackActive: { borderColor: '#31973D' },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: '#D1D5DB',
    alignSelf: 'flex-start',
  },
  toggleKnobActive: { backgroundColor: '#31973D', alignSelf: 'flex-end' },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: '#EF4444',
  },

  /* Search panel */
  searchPanel: {
    marginHorizontal: 10,
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F6',
    borderRadius: 39,
    padding: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#1F2A33',
  },
  tabTextActive: { fontWeight: '600' },
  searchBox: {
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.11)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(0,0,0,0.5)',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 12,
  },
  avatarGroup: { flexDirection: 'row', width: 40 },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1C1E',
    lineHeight: 15,
  },
  driversText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: '#3F4A3D',
    lineHeight: 16,
  },
  newBadge: {
    backgroundColor: '#148732',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 15,
  },

  /* Stats */
  statsRow: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minHeight: 132,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  metricHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  metricValue: {
    fontFamily: 'Poppins',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#1F2A33',
    marginBottom: 2,
  },
  metricCaption: {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#6F7A6C',
  },

  /* Actions */
  actionsSection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 21,
    gap: 4,
  },
  actionRow: {
    minHeight: 72,
    padding: 12,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionRowBorderless: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
  actionInfoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextColumn: { flex: 1, minWidth: 0 },
  actionTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#1F2A33',
  },
  actionSubtitle: {
    marginTop: 2,
    fontFamily: 'Poppins',
    fontSize: 10,
    lineHeight: 16,
    color: '#64748A',
  },
  actionButton: {
    minWidth: 100,
    height: 40,
    borderRadius: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionButtonPressed: { opacity: 0.88 },
  actionButtonLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});

const busyStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },

  /* Status icon */
  statusIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: '#EEEEF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  /* Text */
  heading: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 28,
    color: '#1A1C1E',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 21,
    color: '#3F4A3D',
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  /* Buttons */
  buttons: { alignSelf: 'stretch', gap: 8, marginTop: 4 },
  primaryBtn: {
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#1F2A33',
  },
  cancelBtn: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    lineHeight: 20,
    color: '#EA0707',
  },

  /* Divider */
  divider: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 4,
  },

  /* Driver card */
  driverCard: { alignSelf: 'stretch', gap: 0 },
  driverCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingBottom: 12,
  },
  photoOuter: {
    width: 64,
    height: 64,
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCircle: {
    width: 54,
    height: 54,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#90FA96',
    backgroundColor: '#C7E0C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitials: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 9999,
    backgroundColor: '#006B23',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  driverName: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 24,
    color: '#1A1C1E',
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1C1E',
    letterSpacing: 0.48,
  },
  metaDot: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#BECAB9',
  },
  driverCode: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    color: '#0D631B',
    textTransform: 'uppercase',
  },

  /* Bottom row */
  driverCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FAFAFA',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distanceText: {
    fontFamily: 'Nexa Text-Trial',
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
    letterSpacing: 0.28,
  },
  timePill: {
    backgroundColor: 'rgba(0,107,35,0.05)',
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  timePillText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#006B23',
    letterSpacing: 0.48,
  },
});
