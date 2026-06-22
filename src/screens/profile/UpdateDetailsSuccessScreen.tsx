import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';

export function UpdateDetailsSuccessScreen({ navigation }: RootStackScreenProps<'UpdateDetailsSuccess'>) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      <View className="flex-1 bg-white justify-center items-center px-4">
        <View className="w-full max-w-[320px] items-center gap-3">
          <View className="items-center justify-center">
            <View
              className="w-16 h-16 rounded-full bg-[#DCFCE7] justify-center items-center"
              style={{ shadowColor: '#006C49', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.12, shadowRadius: 40, elevation: 8 }}
            >
              <MaterialCommunityIcons name="check" size={40} color="#497D00" />
            </View>
          </View>

          <Text
            className="text-[24px] leading-[38px] font-medium text-[#1B1B23] text-center tracking-[-0.64px] mt-4"
            style={{ fontFamily: 'Poppins' }}
          >
            Details Updated successfully.
          </Text>

          <Text className="text-sm leading-[26px] text-[#464554] text-center" style={{ fontFamily: 'Poppins' }}>
            Your account details has been updated successfully.
          </Text>

          <Pressable
            className="w-full h-12 bg-[#31973D] rounded-xl justify-center items-center mt-4"
            onPress={() => navigation.navigate('Settings')}
          >
            <Text className="text-white text-sm leading-5" style={{ fontFamily: 'Plus Jakarta Sans' }}>Back to Settings</Text>
          </Pressable>

          <Pressable
            className="w-full h-12 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] justify-center items-center"
            onPress={() => navigation.navigate('Home')}
          >
            <Text className="text-[#0F1621] text-sm leading-5" style={{ fontFamily: 'Manrope' }}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UpdateDetailsSuccessScreen;
