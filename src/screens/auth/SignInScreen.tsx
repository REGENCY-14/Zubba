import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { useAppSelector } from '../../hooks/useAppSelector';

const zubbaAvatar = require('../../../assets/zubba icon.png');

export function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View className="flex-1 items-center justify-between bg-white px-5 pt-[120px] pb-6">
        <View className="max-w-[320px] items-center justify-center px-[18px]">
          <View className="mb-[14px] h-[84px] w-[84px] items-center justify-center rounded-full bg-[#F1F1F1]">
            <View className="h-[34px] w-[34px] items-center justify-center">
              <Image
                source={zubbaAvatar}
                resizeMode="contain"
                className="h-[34px] w-[34px]"
                tintColor="#111111"
              />
            </View>
          </View>

          <Text className="text-center text-2xl font-bold leading-[26px] text-[#262D3A]">
            Welcome, {user?.firstname}!
          </Text>

          <Text className="mt-[10px] text-center text-[13px] leading-[15px] text-[#B8B8B8]">
            You previously signed in to one of our apps using
          </Text>

          <Text className="mt-[2px] text-center text-[15px] leading-[15px] text-[#B8B8B8]">
            +233241122310
          </Text>
        </View>

        <View className="w-full gap-[10px] pb-[18px]">
          <Pressable
            className="h-[38px] items-center justify-center rounded-lg bg-[#3DA440]"
            onPress={() => navigation.replace('ExistingUserNotification')}
          >
            <Text className="text-[13px] text-white">
              Continue
            </Text>
          </Pressable>

          <Pressable
            className="h-[38px] items-center justify-center rounded-lg border border-[#E4E8EF] bg-white"
            onPress={() =>
              navigation.navigate('Details', {
                itemId: 'account-switch',
                title: 'Use another account',
              })
            }
          >
            <Text className="text-[13px] text-[#364153]">
              Use another account
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}