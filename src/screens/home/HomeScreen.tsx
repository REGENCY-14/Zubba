import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const zubbaLogo = require('../../../assets/zubba icon.png');

export function LocationSharingScreen({
  navigation
}: RootStackScreenProps<'LocationSharing'>) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="min-h-[56px] px-[14px] bg-[#3AA548] flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={18}
            color="#FFFFFF"
            style={{ width: 24, marginRight: 10, textAlign: 'center' }}
          />

          <Text className="flex-1 text-white text-[15px] leading-5 font-medium">
            Location sharing is disabled. Tap here to enable
          </Text>
        </View>

        <Pressable
          onPress={() =>
            navigation.navigate('Details', {
              itemId: 'location',
              title: 'Enable location sharing'
            })
          }
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color="#FFFFFF"
            style={{ marginLeft: 10 }}
          />
        </Pressable>
      </View>

      <View className="flex-1 bg-white items-center justify-center">
        <View className="items-center justify-center">
          <Pressable
            onPress={() =>
              navigation.navigate('Details', {
                itemId: 'logo',
                title: 'Zubba'
              })
            }
          >
            <Image
              source={zubbaLogo}
              resizeMode="contain"
              style={{
                width: 360,
                height: 350,
                tintColor: '#F97316',
                transform: [{ scaleY: 0.92 }]
              }}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}