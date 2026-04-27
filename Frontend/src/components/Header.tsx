import { StyleSheet, Text, View } from 'react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800'
  },
  subtitle: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22
  }
});
