import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

export function UpdateDetailsSuccessScreen({ navigation }: RootStackScreenProps<'UpdateDetailsSuccess'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
        <View style={{ width: '100%', maxWidth: 320, alignItems: 'center', gap: 12 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', shadowColor: '#006C49', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.12, shadowRadius: 40, elevation: 8 }}
            >
              <MaterialCommunityIcons name="check" size={40} color="#497D00" />
            </View>
          </View>

          <Text
            style={{ fontSize: 24, lineHeight: 38, fontWeight: '500', color: colors.text, textAlign: 'center', letterSpacing: -0.64, marginTop: 16, fontFamily: 'Poppins' }}
          >
            Details Updated successfully.
          </Text>

          <Text style={{ fontSize: 14, lineHeight: 26, color: colors.textSub, textAlign: 'center', fontFamily: 'Poppins' }}>
            Your account details has been updated successfully.
          </Text>

          <Pressable
            style={{ width: '100%', height: 48, backgroundColor: '#31973D', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontFamily: 'Plus Jakarta Sans' }}>Back to Settings</Text>
          </Pressable>

          <Pressable
            style={{ width: '100%', height: 48, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={{ color: colors.text, fontSize: 14, lineHeight: 20, fontFamily: 'Manrope' }}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UpdateDetailsSuccessScreen;
