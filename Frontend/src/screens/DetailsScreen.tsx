import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import type { RootStackScreenProps } from '../navigation/types';

export function DetailsScreen({ route }: RootStackScreenProps<'Details'>) {
  const item = route.params;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.heading}>{item?.title ?? 'Details'}</Text>
        <Text style={styles.body}>This is a placeholder screen connected through typed React Navigation.</Text>
        <Text style={styles.meta}>Item ID: {item?.itemId ?? 'n/a'}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC'
  },
  heading: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8
  },
  body: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12
  },
  meta: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600'
  }
});
