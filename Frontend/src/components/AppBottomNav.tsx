import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppBottomNavProps = {
  onHomePress: () => void;
  onSavedPress: () => void;
  onSettingsPress?: () => void;
  onAccountPress?: () => void;
  onCalendarPress?: () => void;
  activeTab?: 'home' | 'settings';
  paddingBottom?: number;
};

export function AppBottomNav({
  onHomePress,
  onSavedPress,
  onSettingsPress,
  onAccountPress,
  onCalendarPress,
  activeTab,
  paddingBottom = 8,
}: AppBottomNavProps) {
  const insets = useSafeAreaInsets();
  const isHomeActive = activeTab === 'home';
  const isSettingsActive = activeTab === 'settings';
  const bottomPadding = Math.max(insets.bottom, paddingBottom);

  return (
    <View style={[styles.bottomNavWrap, { paddingBottom: bottomPadding }]}>
      <View style={styles.bottomNav}>
        <Pressable style={[styles.navItem, isHomeActive && styles.activeNav]} onPress={onHomePress}>
          <View style={styles.homeIconWrap}>
            <MaterialIcons name="home" size={24} color={isHomeActive ? '#FFFFFF' : '#64748A'} />
          </View>
          {isHomeActive ? <Text style={styles.navLabelActive}>Home</Text> : null}
        </Pressable>

        <Pressable style={styles.navItem} onPress={onCalendarPress}>
          <MaterialCommunityIcons name="calendar-outline" size={24} color="#64748A" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={onSavedPress}>
          <MaterialCommunityIcons name="content-save-outline" size={24} color="#64748A" />
        </Pressable>

        <Pressable style={[styles.navItem, isSettingsActive && styles.activeNav]} onPress={onSettingsPress ?? onAccountPress}>
          <MaterialCommunityIcons name="cog-outline" size={24} color={isSettingsActive ? '#FFFFFF' : '#64748A'} />
          {isSettingsActive ? <Text style={styles.navLabelActive}>Settings</Text> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  bottomNav: {
    width: '100%',
    maxWidth: 402,
    height: 78,
    backgroundColor: '#FFFFFF',
    borderRadius: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  homeIconWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navLabelActive: {
    fontFamily: 'Nexa Text-Trial',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    fontWeight: '400',
    textAlign: 'center',
  },
});
