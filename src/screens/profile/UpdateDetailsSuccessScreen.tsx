import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { scale, verticalScale, moderateScale } from '../../utils/scale';
import { APP_DARK } from '../../constants/appDarkTheme';

export function UpdateDetailsSuccessScreen({ navigation }: RootStackScreenProps<'UpdateDetailsSuccess'>) {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(16) }}>
        <View style={{ width: '100%', maxWidth: scale(320), alignItems: 'center', gap: moderateScale(12) }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{ width: moderateScale(64), height: moderateScale(64), borderRadius: moderateScale(32), backgroundColor: isDark ? APP_DARK.statusSuccessBg : '#DCFCE7', justifyContent: 'center', alignItems: 'center', shadowColor: '#006C49', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.12, shadowRadius: 40, elevation: 8 }}
            >
              <MaterialCommunityIcons name="check" size={moderateScale(40)} color={isDark ? APP_DARK.statusSuccessText : "#497D00"} />
            </View>
          </View>

          <Text
            style={{ fontSize: moderateScale(24), lineHeight: moderateScale(38), fontWeight: '500', color: colors.text, textAlign: 'center', letterSpacing: -0.64, marginTop: verticalScale(16), fontFamily: 'Poppins' }}
          >
            Details Updated successfully.
          </Text>

          <Text style={{ fontSize: moderateScale(14), lineHeight: moderateScale(26), color: colors.textSub, textAlign: 'center', fontFamily: 'Poppins' }}>
            Your account details has been updated successfully.
          </Text>

          <Pressable
            style={{ width: '100%', height: verticalScale(48), backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : '#31973D', borderRadius: moderateScale(12), justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(16) }}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={{ color: '#FFFFFF', fontSize: moderateScale(14), lineHeight: moderateScale(20), fontFamily: 'Poppins' }}>Back to Settings</Text>
          </Pressable>

          <Pressable
            style={{ width: '100%', height: verticalScale(48), backgroundColor: colors.surface, borderRadius: moderateScale(8), borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={{ color: colors.text, fontSize: moderateScale(14), lineHeight: moderateScale(20), fontFamily: 'Poppins' }}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UpdateDetailsSuccessScreen;
