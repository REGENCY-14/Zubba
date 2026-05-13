import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppBottomNavProps = {
  onHomePress: () => void;
  onSavedPress: () => void;
  onAccountPress: () => void;
  onCalendarPress?: () => void;
  activeTab?: 'home';
  paddingBottom?: number;
};

export function AppBottomNav({
  onHomePress,
  onSavedPress,
  onAccountPress,
  onCalendarPress,
  activeTab,
  paddingBottom = 8,
}: AppBottomNavProps) {
  const isHomeActive = activeTab === 'home';

  return (
    <View style={[styles.bottomNavWrap, { paddingBottom }]}>
      <View style={styles.bottomNav}>
        <Pressable style={[styles.navItem, isHomeActive && styles.activeNav]} onPress={onHomePress}>
          <Text style={isHomeActive ? styles.navIconActive : styles.navIcon}>🏠</Text>
          {isHomeActive ? <Text style={styles.navLabelActive}>Home</Text> : null}
        </Pressable>

        <Pressable style={styles.navItem} onPress={onCalendarPress}>
          <Text style={styles.navIcon}>📅</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={onSavedPress}>
          <Text style={styles.navIcon}>💾</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={onAccountPress}>
          <Text style={styles.navIcon}>👥</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  bottomNav: {
    width: 402,
    maxWidth: '96%',
    height: 78,
    backgroundColor: '#FFFFFF',
    borderRadius: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  navItem: {
    width: 64,
    height: 44,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  activeNav: {
    backgroundColor: '#31973D',
    width: 105,
    gap: 6,
  },
  navIcon: { fontSize: 20, color: '#64748A' },
  navIconActive: { fontSize: 20, color: '#FFFFFF', marginRight: 4 },
  navLabelActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '400' },
});
