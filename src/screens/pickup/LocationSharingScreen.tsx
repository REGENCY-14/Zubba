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

import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';

const mapImage = require('../../../assets/RawMap.png');
const logo = require('../../../assets/zubba icon.png');

export function LocationSharingScreen({ navigation }: RootStackScreenProps<'LocationSharing'>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ImageBackground source={mapImage} style={styles.map} resizeMode="cover">
        <View style={styles.header}>
          <Pressable style={styles.menuButton} onPress={() => {}}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.headerLogo} />
          </View>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Where is your waste?"
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable onPress={() => navigation.navigate('Details', { itemId: 'search', title: 'Search' })}>
            <Image source={require('../../../assets/Search.png')} style={styles.searchIcon} />
          </Pressable>
        </View>

        <View style={styles.floatingCard}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statHead}>
                <Image source={require('../../../assets/recycle.png')} style={styles.statIcon} />
                <Text style={styles.statLabel}>ACTIVE</Text>
              </View>
              <Text style={styles.statValue}>42kg</Text>
              <Text style={styles.statMeta}>Recycled this month</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeadRight}>
                <Image source={require('../../../assets/points.png')} style={styles.statIconAlt} />
                <Text style={styles.statLabelAlt}>POINTS</Text>
              </View>
              <Text style={styles.statValue}>1,250</Text>
              <Text style={styles.statMeta}>Eco Credits earned</Text>
            </View>
          </View>

          <View style={styles.actionsList}>
            <View style={styles.actionRow}>
              <Image source={require('../../../assets/picktricycle.png')} style={styles.actionLeftIcon} />
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>Find nearby tricycles</Text>
                <Text style={styles.actionSub}>Instant pickup</Text>
              </View>
              <Pressable style={styles.requestButton} onPress={() => navigation.navigate('Scanning')}>
                <Text style={styles.requestText}>Request now</Text>
              </Pressable>
            </View>

            <View style={[styles.actionRow, styles.premiumRow]}>
              <Image source={require('../../../assets/premium.png')} style={styles.premiumLeftIcon} />
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>Plan future pickup</Text>
                <Text style={styles.actionSub}>Future service</Text>
              </View>
              <View style={styles.premiumBadge}><Text style={styles.premiumText}>Premium Tier</Text></View>
            </View>

            <Text style={styles.upgradeText}>🔒 Upgrade to Gold for scheduled pickups</Text>
          </View>
        </View>

        <AppBottomNav
          activeTab="home"
          paddingBottom={0}
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
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
    top: 58,
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 0,
    gap: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.15)',
    zIndex: 10
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuIcon: {
    fontSize: 18,
    color: '#0F1621'
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30
  },
  headerLogo: {
    width: 68,
    height: 30,
    resizeMode: 'contain'
  },
  settingsButton: {
    display: 'none' as any
  },
  floatingCard: {
    position: 'absolute',
    left: (width - 402) / 2 < 8 ? 8 : (width - 402) / 2,
    right: (width - 402) / 2 < 8 ? 8 : (width - 402) / 2,
    bottom: 102,
    backgroundColor: '#F9F9F9',
    borderRadius: 21,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 5
  },
  cardInner: { flex: 1, justifyContent: 'flex-start' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
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
  actionsList: { marginTop: 0 }
,
  actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  actionLeftIcon: { width: 40, height: 40, resizeMode: 'contain', marginRight: 12 },
  actionTextWrap: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: '600', color: '#1F2A33' },
  actionSub: { fontSize: 12, color: '#6F7A6C' },
  requestButton: { backgroundColor: '#31973D', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  requestText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  premiumRow: { backgroundColor: '#FFFBF0', marginBottom: 12, borderColor: '#FFE088', borderWidth: 1 },
  premiumLeftIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FED65B', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  premiumIcon: { fontSize: 16 },
  premiumBadge: { backgroundColor: '#FFE088', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  premiumText: { color: '#1F2A33', fontWeight: '600', fontSize: 12 },
  upgradeText: { marginTop: 8, color: '#574500', fontStyle: 'italic', fontSize: 13, marginBottom: 0 },
  supportCard: { display: 'none' as any, flexDirection: 'column', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', gap: 16 },
  supportHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  supportLeft: { width: 24, height: 24, borderRadius: 10, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  supportIcon: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
  supportTitle: { fontSize: 14, color: '#1F2A33', lineHeight: 20, flex: 1 },
  supportButton: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', height: 48 },
  supportButtonIconWrap: { width: 16, height: 16, marginRight: 8 },
  supportButtonIcon: { fontSize: 14, color: '#006B23' },
  supportButtonText: { color: '#1F2A33', fontWeight: '400', fontSize: 14 },
  
});

export default LocationSharingScreen;
