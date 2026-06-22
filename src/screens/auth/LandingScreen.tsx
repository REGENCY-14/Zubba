import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

const zubbaLogo = require('../../../assets/zubba icon.png');

export function LandingScreen({ navigation }: RootStackScreenProps<'Landing'>) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <Pressable
        className="min-h-[56px] px-[14px] bg-[#3AA548] flex-row items-center justify-between"
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text className="text-white text-[18px] w-6 text-center mr-[10px]">⌖</Text>
        <Text className="flex-1 text-white text-[15px] leading-5 font-medium">Location sharing is disabled. Tap here to enable</Text>
        <Text className="text-white text-[28px] font-normal ml-[10px] -mt-[2px]">›</Text>
      </Pressable>

      <View className="flex-1 bg-white items-center justify-center">
        <View className="items-center justify-center">
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Image
              source={zubbaLogo}
              className="w-[300px] h-[300px]"
              style={{ tintColor: '#2EA043', transform: [{ scaleY: 0.92 }] }}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
