import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

const mapImage = require('../../assets/RawMap.png');
const logo = require('../../assets/zubba icon.png');

export function LocationSharingScreen({ navigation }: RootStackScreenProps<'LocationSharing'>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ImageBackground source={mapImage} style={styles.map} resizeMode="cover">
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Where is your waste?"
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable onPress={() => navigation.navigate('Details', { itemId: 'search', title: 'Search' })}>
            <Image source={require('../../assets/Search.png')} style={styles.searchIcon} />
          </Pressable>
        </View>

        <View style={styles.floatingCard}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statHead}>
                <Image source={require('../../assets/recycle.png')} style={styles.statIcon} />
                <Text style={styles.statLabel}>ACTIVE</Text>
              </View>
              <Text style={styles.statValue}>42kg</Text>
              <Text style={styles.statMeta}>Recycled this month</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeadRight}>
                <Image source={require('../../assets/points.png')} style={styles.statIconAlt} />
                <Text style={styles.statLabelAlt}>POINTS</Text>
              </View>
              <Text style={styles.statValue}>1,250</Text>
              <Text style={styles.statMeta}>Eco Credits earned</Text>
            </View>
          </View>

          <View style={styles.actionsList}>
            <View style={styles.actionRow}>
              <Image source={require('../../assets/picktricycle.png')} style={styles.actionLeftIcon} />
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>Find nearby tricycles</Text>
                <Text style={styles.actionSub}>Instant pickup</Text>
              </View>
              <Pressable style={styles.requestButton} onPress={() => navigation.navigate('Scanning')}>
                <Text style={styles.requestText}>Request now</Text>
              </Pressable>
            </View>

            <View style={[styles.actionRow, styles.premiumRow]}>
              <Image source={require('../../assets/premium.png')} style={styles.premiumLeftIcon} />
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>Plan future pickup</Text>
                <Text style={styles.actionSub}>Future service</Text>
              </View>
              <View style={styles.premiumBadge}><Text style={styles.premiumText}>PREMIUM</Text></View>
            </View>

            <Text style={styles.upgradeText}>🔒 Upgrade to Gold for scheduled pickups</Text>

            <View style={styles.supportCard}>
              <View style={styles.supportHeader}>
                <View style={styles.supportLeft}><Text style={styles.supportIcon}>!</Text></View>
                <Text style={styles.supportTitle}>Spotted an issue? We're here to fix it</Text>
              </View>
              <Pressable style={styles.supportButton} onPress={() => navigation.navigate('Details', { itemId: 'support', title: 'Alert' })}>
                <View style={styles.supportButtonIconWrap}><Text style={styles.supportButtonIcon}>🟢</Text></View>
                <Text style={styles.supportButtonText}>Alert</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.bottomNavWrap}>
          <View style={styles.handle} />
          <View style={styles.bottomNav}>
            <Pressable style={[styles.navItem, styles.activeNav]} onPress={() => navigation.navigate('Home' as any)}>
              <Text style={styles.navIconActive}>🏠</Text>
              <Text style={styles.navLabelActive}>Home</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => {}}>
              <Text style={styles.navIcon}>📅</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}>
              <Text style={styles.navIcon}>💾</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'account', title: 'Account' })}>
              <Text style={styles.navIcon}>👥</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  map: { flex: 1, width: '100%', height: '100%', position: 'relative' },

  searchBox: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.11)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchText: { fontSize: 14, color: '#333333' },
  searchInput: { flex: 1, fontSize: 14, color: '#333333', padding: 0 },
  searchIcon: { width: 20, height: 20, resizeMode: 'contain' },
  floatingCard: {
    position: 'absolute',
    left: (width - 402) / 2 < 8 ? 8 : (width - 402) / 2,
    right: (width - 402) / 2 < 8 ? 8 : (width - 402) / 2,
    bottom: 125,
    height: 410,
    backgroundColor: '#F9F9F9',
    borderRadius: 21,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4
  },
  cardInner: { flex: 1, justifyContent: 'flex-start' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  statHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statHeadRight: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statIcon: { width: 18, height: 18, resizeMode: 'contain' },
  statIconAlt: { width: 18, height: 18, resizeMode: 'contain' },
  statLabel: { color: '#31973D', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  statLabelAlt: { color: '#735C00', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#1F2A33', marginTop: 8 },
  statMeta: { fontSize: 14, color: '#6F7A6C', marginTop: 4 },
  pickupRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(65,158,106,0.1)', alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 20 },
  pickupTextWrap: { marginLeft: 12, flex: 1 },
  pickupTitle: { fontFamily: 'Nexa Text-Trial', fontSize: 16, fontWeight: '700', color: '#1F2A33' },
  pickupSub: { fontFamily: 'Nexa Text-Trial', fontSize: 12, color: '#1F2A33' },
  chev: { paddingHorizontal: 8 },
  chevText: { fontSize: 28, color: '#1F2A33' },
  cardActions: { flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' },
  infoBox: { width: 158, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  infoBoxRight: { width: 158, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  infoLabel: { color: '#31973D', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  infoLabelAlt: { color: '#735C00', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: 20, fontWeight: '700', color: '#1F2A33', marginTop: 4 },
  infoMeta: { fontSize: 14, color: '#6F7A6C', marginTop: 4 },
  primaryButton: { marginTop: 12, backgroundColor: '#31973D', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14 },
  actionsList: { marginTop: 8 },
  actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 },
  actionLeftIcon: { width: 40, height: 40, resizeMode: 'contain', marginRight: 10 },
  actionTextWrap: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: '600', color: '#1F2A33' },
  actionSub: { fontSize: 12, color: '#6F7A6C' },
  requestButton: { backgroundColor: '#31973D', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  requestText: { color: '#FFFFFF', fontWeight: '600' },
  premiumRow: { backgroundColor: '#FFFBF0' },
  premiumLeftIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FED65B', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  premiumIcon: { fontSize: 16 },
  premiumBadge: { backgroundColor: '#FFE088', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  premiumText: { color: '#1F2A33', fontWeight: '600' },
  upgradeText: { marginTop: 4, color: '#574500', fontStyle: 'italic', fontSize: 14, marginBottom: 6 },
  supportCard: { flexDirection: 'column', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', gap: 16 },
  supportHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  supportLeft: { width: 24, height: 24, borderRadius: 10, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  supportIcon: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
  supportTitle: { fontSize: 14, color: '#1F2A33', lineHeight: 20, flex: 1 },
  supportButton: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', height: 48 },
  supportButtonIconWrap: { width: 16, height: 16, marginRight: 8 },
  supportButtonIcon: { fontSize: 14, color: '#006B23' },
  supportButtonText: { color: '#1F2A33', fontWeight: '400', fontSize: 14 },
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingBottom: 8 },
  handle: { width: 108, height: 4, backgroundColor: '#000000', opacity: 0.9, borderRadius: 12, marginBottom: 12 },
  bottomNav: { width: 402, maxWidth: '96%', height: 78, backgroundColor: '#FFFFFF', borderRadius: 75, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  navItem: { width: 64, height: 44, borderRadius: 44, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  activeNav: { backgroundColor: '#31973D', width: 105, height: 44, borderRadius: 44, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 6, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 20, color: '#64748A' },
  navLabel: { fontSize: 12, color: '#64748A' },
  navIconActive: { fontSize: 20, color: '#FFFFFF', marginRight: 4 },
  navLabelActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '400' }
});

export default LocationSharingScreen;
