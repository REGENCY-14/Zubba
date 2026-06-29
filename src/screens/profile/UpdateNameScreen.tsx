import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useAppSelector } from '../../hooks/useAppSelector';

export function UpdateNameScreen({ navigation }: RootStackScreenProps<'UpdateName'>) {
  const user = useAppSelector((state) => state.auth.user);

  const [firstName, setFirstName] = useState(user?.firstname ?? 'Edwin');
  const [lastName, setLastName] = useState(user?.lastname ?? 'Adu Boateng');

  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View
        style={{
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable
          style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
        </Pressable>

        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2A33', lineHeight: 24 }}>
          Update Details
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 12,
          gap: 24,
          alignItems: 'center',
        }}
      >
        {/* Icon + description */}
        <View style={{ alignItems: 'center', gap: 16 }}>
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 9999,
              backgroundColor: 'rgba(65, 158, 106, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons name="cellphone-arrow-down" size={24} color="#006B23" />
          </View>

          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: '#64748A',
              lineHeight: 20,
              textAlign: 'center',
              width: 284,
            }}
          >
            Keep your profile up to date by ensuring your name information is accurate.
          </Text>
        </View>

        {/* Form card */}
        <View
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#E2E8F0',
            borderRadius: 24,
            padding: 16,
            gap: 16,
          }}
        >
          {/* Instruction */}
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#1F2A33', letterSpacing: 0.15 }}>
            Enter your name as it appears on your ID or passport
          </Text>

          {/* First Name */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#E2E8F0',
              paddingTop: 8,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 22, color: '#1F2A33', letterSpacing: 0.15 }}>
              First  Name
            </Text>

            <TextInput
              style={{
                height: 48,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#CBD5E0',
                borderRadius: 9999,
                paddingHorizontal: 12,
                fontSize: 14,
                lineHeight: 20,
                color: '#1F2A33',
              }}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              placeholder="Enter your first name"
              placeholderTextColor="#CBD5E0"
            />
          </View>

          {/* Last Name */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#E2E8F0',
              paddingTop: 8,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 22, color: '#1F2A33', letterSpacing: 0.15 }}>
              Last Name
            </Text>

            <TextInput
              style={{
                height: 48,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#CBD5E0',
                borderRadius: 9999,
                paddingHorizontal: 12,
                fontSize: 14,
                lineHeight: 20,
                color: '#1F2A33',
              }}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              placeholder="Enter your last name"
              placeholderTextColor="#CBD5E0"
            />
          </View>
        </View>

        {/* Save Changes button */}
        <Pressable
          style={{
            width: '100%',
            height: 48,
            backgroundColor: canSave ? '#31973D' : 'rgba(49,151,61,0.5)',
            borderRadius: 9999,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={!canSave}
          onPress={() =>
            navigation.navigate('Profile', {
              updatedAt: Date.now(),
              newFullName: `${firstName.trim()} ${lastName.trim()}`,
            })
          }
        >
          <Text style={{ fontSize: 14, lineHeight: 20, color: '#FFFFFF' }}>Save Changes</Text>
        </Pressable>
      </ScrollView>

    </SafeAreaView>
  );
}

export default UpdateNameScreen;
