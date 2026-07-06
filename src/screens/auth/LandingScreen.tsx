import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

import type { RootStackScreenProps } from '../../navigation/types';

const zubbaLogo = require('../../../assets/zubba icon.png');

export function LandingScreen({ navigation }: RootStackScreenProps<'Landing'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <Pressable
        style={{ minHeight: 56, paddingHorizontal: 14, backgroundColor: '#3AA548', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, width: 24, textAlign: 'center', marginRight: 10 }}>⌖</Text>
        <Text style={{ flex: 1, color: '#FFFFFF', fontSize: 15, lineHeight: 20, fontWeight: '500' }}>Location sharing is disabled. Tap here to enable</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '400', marginLeft: 10, marginTop: -2 }}>›</Text>
      </Pressable>

      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Image
              source={zubbaLogo}
              style={{ width: 300, height: 300, tintColor: '#2EA043', transform: [{ scaleY: 0.92 }] }}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
