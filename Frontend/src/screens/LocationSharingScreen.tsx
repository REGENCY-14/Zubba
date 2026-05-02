import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

const rawMap = require('../../assets/RawMap.png');

export function LocationSharingScreen({ navigation }: RootStackScreenProps<'LocationSharing'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.page}>
        <Image source={rawMap} style={styles.mapImage} resizeMode="cover" />

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>⌕</Text>
          <Text style={styles.searchText}>Where is your waste?</Text>
        </View>

        <View style={styles.taskCard}>
          <View style={styles.taskRow}>
            <View style={styles.taskLeft}>
              <View style={styles.taskIconWrap}>
                <Text style={styles.taskIcon}>⎈</Text>
              </View>
              <View>
                <Text style={styles.taskTitle}>Pickup location</Text>
                <Text style={styles.taskMeta}>Kumasi</Text>
              </View>
            </View>

            <Pressable style={styles.taskButton} onPress={() => navigation.navigate('Details', { itemId: 'pickup', title: 'Pickup location' })}>
              <Text style={styles.taskButtonText}>Select now</Text>
            </Pressable>
          </View>

          <View style={[styles.taskRow, styles.taskRowMuted]}>
            <View style={styles.taskLeft}>
              <View style={[styles.taskIconWrap, styles.taskIconWrapMuted]}>
                <Text style={styles.taskIcon}>⌂</Text>
              </View>
              <View>
                <Text style={styles.taskTitle}>Dropoff point</Text>
                <Text style={styles.taskMeta}>Not selected</Text>
              </View>
            </View>

            <Pressable style={styles.taskGhostButton} onPress={() => navigation.navigate('Details', { itemId: 'dropoff', title: 'Dropoff point' })}>
              <Text style={styles.taskGhostButtonText}>Set point</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomNav}>
          <Pressable style={styles.navItemActive}>
            <Text style={styles.navItemActiveIcon}>⌂</Text>
            <Text style={styles.navItemActiveLabel}>Home</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'schedule', title: 'Schedule' })}>
            <Text style={styles.navItemIcon}>◷</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved items' })}>
            <Text style={styles.navItemIcon}>☖</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'account', title: 'Manage account' })}>
            <Text style={styles.navItemIcon}>◉</Text>
          </Pressable>
        </View>

        <View style={styles.systemNavBar}>
          <View style={styles.systemHandle} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { flex: 1, position: 'relative', backgroundColor: '#FFFFFF' },
  mapImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  statusBar: {
    height: 42,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF'
  },
  timeText: { fontSize: 12, color: '#222227', fontWeight: '600' },
  statusIcons: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { marginLeft: 5, fontSize: 12, color: '#222227' },
  searchWrap: {
    position: 'absolute',
    top: 66,
    left: 10,
    right: 10,
    height: 54,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.11)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchIcon: { fontSize: 20, color: '#000000', marginRight: 10 },
  searchText: { fontSize: 14, lineHeight: 21, color: '#333333' },
  taskCard: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 102,
    borderRadius: 21,
    backgroundColor: '#F9F9F9',
    padding: 10,
    gap: 12
  },
  taskRow: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  taskRowMuted: { opacity: 0.95 },
  taskLeft: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  taskIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(65, 158, 106, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  taskIconWrapMuted: { backgroundColor: '#EFF5FF' },
  taskIcon: { fontSize: 18, color: '#1F2A33' },
  taskTitle: { fontSize: 14, lineHeight: 20, color: '#1F2A33', fontWeight: '500' },
  taskMeta: { fontSize: 10, lineHeight: 16, color: '#64748A', marginTop: 2 },
  taskButton: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  taskButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  taskGhostButton: {
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  taskGhostButtonText: { color: '#1F2A33', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    height: 78,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  navItemActive: {
    height: 44,
    borderRadius: 44,
    backgroundColor: '#31973D',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  navItemActiveIcon: { color: '#FFFFFF', fontSize: 16, marginRight: 6 },
  navItemActiveLabel: { color: '#FFFFFF', fontSize: 12, lineHeight: 16 },
  navItem: {
    width: 64,
    height: 44,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navItemIcon: { color: '#64748A', fontSize: 18 },
  systemNavBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  systemHandle: {
    width: 108,
    height: 4,
    borderRadius: 12,
    opacity: 0.9,
    backgroundColor: '#000000'
  },
});
