import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type PaymentProviderHeaderProps = {
  provider: string;
  providerColor: string;
  isActive?: boolean;
  onMenuPress?: () => void;
  onClosePress?: () => void;
};

export function PaymentProviderHeader({
  provider,
  providerColor,
  isActive = false,
  onMenuPress,
  onClosePress,
}: PaymentProviderHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.iconButton} onPress={onMenuPress}>
        <Text style={styles.iconText}>☰</Text>
      </Pressable>

      <View style={styles.centerContent}>
        <View style={styles.providerRow}>
          <View style={[styles.providerDot, { backgroundColor: providerColor }]} />
          <Text style={styles.providerText}>{provider}</Text>
        </View>
        {isActive ? <Text style={styles.statusText}>Active</Text> : null}
      </View>

      <Pressable style={styles.iconButton} onPress={onClosePress}>
        <Text style={styles.iconText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#1F2A33',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  providerText: {
    fontSize: 14,
    color: '#1F2A33',
    fontWeight: '600',
  },
  statusText: {
    marginTop: 2,
    fontSize: 12,
    color: '#31973D',
  },
});
