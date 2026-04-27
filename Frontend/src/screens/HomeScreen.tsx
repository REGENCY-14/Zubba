import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setAppReady } from '../slices/appSlice';
import type { RootStackScreenProps } from '../navigation/types';

export function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const dispatch = useAppDispatch();
  const appName = useAppSelector((state) => state.app.appName);
  const isReady = useAppSelector((state) => state.app.isReady);

  return (
    <View style={styles.container}>
      <Header title={appName} subtitle="Starter project foundation for upcoming screenshot-driven UI work." />

      <Card>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Redux Toolkit</Text>
          <Text style={styles.value}>Ready: {isReady ? 'Yes' : 'No'}</Text>
        </View>
      </Card>

      <Button label="Mark app ready" onPress={() => dispatch(setAppReady(true))} />
      <Button label="Open details" variant="secondary" onPress={() => navigation.navigate('Details', { itemId: '42', title: 'Starter details' })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    backgroundColor: '#F8FAFC'
  },
  cardContent: {
    gap: 4
  },
  label: {
    color: '#64748B',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700'
  },
  value: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700'
  }
});
