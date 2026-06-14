import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBottomNav } from '../components';
import type { RootStackScreenProps } from '../navigation/types';

const mapImage = require('../../assets/RawMap.png');

const CARD_W = 280;
const CARD_GAP = 16;

const DRIVERS = [
  { id: 'mc', initials: 'MC', name: 'Marcus Chen', rating: '4.9', code: 'ZB-0248', dist: '0.5km away', eta: '3 mins', premium: true, border: '#31973D' },
  { id: 'sj', initials: 'SJ', name: 'Sarah J.', rating: '4.9', code: 'ZB-1248', dist: '0.8km away', eta: '5 mins', premium: false, border: '#E2E8F0' },
  { id: 'ka', initials: 'KA', name: 'Kwame A.', rating: '4.7', code: 'ZB-0748', dist: '1.2km away', eta: '8 mins', premium: false, border: '#E2E8F0' },
];

export function DriversFoundScreen({ navigation }: RootStackScreenProps<'DriversFound'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ImageBackground source={mapImage} style={styles.mapFill} resizeMode="cover">

        {/* Header overlaid on map */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.chevron}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Drivers found</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Route elements */}
        <View style={styles.userLocOuter}>
          <View style={styles.userLocInner} />
        </View>

        <View style={styles.routeLine} />

        <View style={styles.destGroup}>
          <View style={styles.etaBubble}>
            <Text style={styles.etaBubbleText}>5mins</Text>
          </View>
          <MaterialIcons name="location-on" size={36} color="#31973D" />
        </View>

        <View style={styles.tricycleWrap}>
          <Text style={styles.tricycleEmoji}>🛺</Text>
        </View>

        {/* Floating bottom panel */}
        <View style={styles.bottomPanel}>
          {/* Inner bordered card: Nearby Drivers header + carousel */}
          <View style={styles.innerCard}>
            <View style={styles.panelTitleRow}>
              <Text style={styles.panelTitle}>Nearby Drivers</Text>
              <View style={styles.liveViewPill}>
                <View style={styles.liveViewDot} />
                <Text style={styles.liveViewText}>Live view</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_W + CARD_GAP}
              decelerationRate="fast"
              style={styles.cardsScrollView}
              contentContainerStyle={styles.cardsScroll}
            >
              {DRIVERS.map(d => (
                <View key={d.id} style={[styles.driverCard, { borderColor: d.border }]}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.avatarShell}>
                      <View style={[styles.avatarCircle, d.premium && styles.avatarGreen]}>
                        <Text style={styles.avatarInitials}>{d.initials}</Text>
                      </View>
                      <View style={styles.verifiedBadge}>
                        <MaterialCommunityIcons name="check" size={9} color="#FFF" />
                      </View>
                    </View>
                    <View style={styles.cardNameCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.cardName}>{d.name}</Text>
                        {d.premium && (
                          <View style={styles.premiumBadge}>
                            <Text style={styles.premiumText}>Premium</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.ratingRow}>
                        <MaterialCommunityIcons name="star" size={11} color="#735C00" />
                        <Text style={styles.ratingVal}> {d.rating}</Text>
                        <Text style={styles.metaDot}> · </Text>
                        <Text style={[styles.codeText, d.premium && styles.codeGreen]}>{d.code}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardBottomRow}>
                    <View style={styles.distRow}>
                      <MaterialCommunityIcons name="map-marker-outline" size={13} color="#006B23" />
                      <Text style={styles.distText}>{d.dist}</Text>
                    </View>
                    <View style={styles.etaPill}>
                      <Text style={styles.etaPillText}>{d.eta}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Buttons outside inner card */}
          <View style={styles.buttonsSection}>
            <Pressable style={styles.proceedBtn} onPress={() => navigation.navigate('DriverArrives')}>
              <Text style={styles.proceedBtnText}>Proceed to request</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={() => navigation.navigate('PremiumHome')}>
              <View style={styles.cancelIconWrap}>
                <Text style={styles.cancelIconText}>✕</Text>
              </View>
              <Text style={styles.cancelBtnText}>Cancel pickup</Text>
            </Pressable>
          </View>
        </View>

        {/* Premium bottom nav */}
        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  mapFill: { flex: 1 },

  /* Header */
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    zIndex: 10,
  },
  backBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  chevron: { fontSize: 26, color: '#1F2A33', lineHeight: 30 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1F2A33' },
  headerSpacer: { width: 28 },

  /* Route elements */
  userLocOuter: {
    position: 'absolute',
    left: '14%',
    top: '52%',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(49,151,61,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#31973D',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  routeLine: {
    position: 'absolute',
    left: '19%',
    top: '54%',
    width: 220,
    height: 0,
    borderTopWidth: 2,
    borderTopColor: '#31973D',
    borderStyle: 'dashed',
    transform: [{ rotate: '15deg' }],
  },
  destGroup: {
    position: 'absolute',
    left: '13%',
    top: '20%',
    alignItems: 'center',
  },
  etaBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  etaBubbleText: { fontSize: 13, fontWeight: '700', color: '#1F2A33' },
  tricycleWrap: { position: 'absolute', right: '6%', top: '60%' },
  tricycleEmoji: { fontSize: 26 },

  /* Bottom panel */
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 90,
    gap: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },

  /* Inner bordered card wrapping title + carousel */
  innerCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 24,
    gap: 24,
    backgroundColor: '#FFFFFF',
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelTitle: { fontSize: 18, fontWeight: '700', color: '#1F2A33' },
  liveViewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,107,35,0.10)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveViewDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#31973D' },
  liveViewText: { fontSize: 13, color: '#31973D', fontWeight: '700' },

  /* Driver cards */
  cardsScrollView: { height: 149 },
  cardsScroll: { gap: CARD_GAP },

  /* Buttons section */
  buttonsSection: { gap: 12 },
  driverCard: {
    width: CARD_W,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  avatarShell: {
    width: 64,
    height: 64,
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGreen: { borderColor: '#90FA96', backgroundColor: '#C7E0C9' },
  avatarInitials: { fontSize: 16, fontWeight: '700', color: '#1F2A33' },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#006B23',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNameCol: { flex: 1, justifyContent: 'center', gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  cardName: { fontSize: 14, fontWeight: '700', color: '#1A1C1E' },
  premiumBadge: {
    backgroundColor: '#FFE088',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  premiumText: { fontSize: 10, fontWeight: '400', color: '#574500', letterSpacing: 0.48 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingVal: { fontSize: 12, color: '#1A1C1E', fontWeight: '700', letterSpacing: 0.48 },
  metaDot: { fontSize: 12, color: '#BECAB9', fontWeight: '700' },
  codeText: { fontSize: 14, color: '#64748A', fontWeight: '700' },
  codeGreen: { color: '#0D631B' },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#FAFAFA',
    paddingTop: 12,
  },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distText: { fontSize: 14, color: '#1A1C1E', fontWeight: '700', letterSpacing: 0.28 },
  etaPill: {
    backgroundColor: 'rgba(0,107,35,0.05)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  etaPillText: { fontSize: 12, fontWeight: '700', color: '#006B23', letterSpacing: 0.48 },

  /* Buttons */
  proceedBtn: {
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  cancelBtn: {
    height: 48,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  cancelIconWrap: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelIconText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700', lineHeight: 10 },
  cancelBtnText: { fontSize: 14, color: '#EF4444', fontWeight: '700' },
});

export default DriversFoundScreen;
