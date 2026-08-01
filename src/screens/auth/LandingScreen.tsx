import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { scale, verticalScale, moderateScale } from '../../utils/scale';

import type { RootStackScreenProps } from '../../navigation/types';

const zubbaLogo = require('../../../assets/zubba-icon.png');

export function LandingScreen({ navigation }: RootStackScreenProps<'Landing'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <Pressable
        style={{ minHeight: verticalScale(56), paddingHorizontal: scale(14), backgroundColor: '#3AA548', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={{ color: '#FFFFFF', fontSize: moderateScale(18), width: scale(24), textAlign: 'center', marginRight: scale(10) }}>⌖</Text>
        <Text style={{ flex: 1, color: '#FFFFFF', fontSize: moderateScale(15), lineHeight: moderateScale(20), fontWeight: '500' }}>Location sharing is disabled. Tap here to enable</Text>
        <Text style={{ color: '#FFFFFF', fontSize: moderateScale(28), fontWeight: '400', marginLeft: scale(10), marginTop: verticalScale(-2) }}>›</Text>
      </Pressable>

      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Image
              source={zubbaLogo}
              style={{ width: moderateScale(300), height: moderateScale(300), tintColor: '#2EA043', transform: [{ scaleY: 0.92 }] }}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
