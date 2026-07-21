import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useTheme } from '../../context/ThemeContext';
import CustomAppBar from '../../components/common/CustomAppBar';
import { userService } from '../../api/userService';
import { updateUser } from '../../slices/auth/authSlice';
import { toast } from '../../hooks/toast';

export function UpdateNameScreen({ navigation }: RootStackScreenProps<'UpdateName'>) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();

  const [firstName, setFirstName] = useState(user?.firstname ?? '');
  const [lastName, setLastName] = useState(user?.lastname ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0;
  const hasChanges = 
    firstName.trim() !== (user?.firstname ?? '') || 
    lastName.trim() !== (user?.lastname ?? '');

  const handleSave = async () => {
    if (!canSave || !hasChanges || !user?.id) return;

    setIsLoading(true);
    try {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      await userService.updateUser(user.id, {
        firstname: trimmedFirstName,
        lastname: trimmedLastName,
      });
      dispatch(updateUser({
        ...user,
        firstname: trimmedFirstName,
        lastname: trimmedLastName,
      }));
      toast.success('Name updated successfully');

      navigation.navigate('Profile', {
        updatedAt: Date.now(),
        newFullName: `${trimmedFirstName} ${trimmedLastName}`,
      });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update name. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <CustomAppBar title="Update Details" navigation={navigation} />

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
            <MaterialCommunityIcons name="account-edit" size={24} color="#006B23" />
          </View>

          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: colors.textSub,
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
            backgroundColor: isDark ? colors.surface : colors.bg,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 24,
            padding: 16,
            gap: 16,
          }}
        >
          {/* Instruction */}
          <Text style={{ fontSize: 14, lineHeight: 22, color: colors.textSub, letterSpacing: 0.15 }}>
            Enter your name as it appears on your ID or passport
          </Text>

          {/* First Name */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.borderLight,
              paddingTop: 8,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 22, color: colors.textSub, letterSpacing: 0.15 }}>
              First Name
            </Text>

            <TextInput
              style={{
                height: 48,
                backgroundColor: isDark ? colors.surface : colors.bg,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 9999,
                paddingHorizontal: 12,
                fontSize: 14,
                lineHeight: 20,
                color: colors.textSub,
              }}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              placeholder="Enter your first name"
              placeholderTextColor={colors.textMuted}
              editable={!isLoading}
            />
          </View>

          {/* Last Name */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.borderLight,
              paddingTop: 8,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 22, color: colors.textSub, letterSpacing: 0.15 }}>
              Last Name
            </Text>

            <TextInput
              style={{
                height: 48,
                backgroundColor: isDark ? colors.surface : colors.bg,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 9999,
                paddingHorizontal: 12,
                fontSize: 14,
                lineHeight: 20,
                color: colors.textSub,
              }}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              placeholder="Enter your last name"
              placeholderTextColor={colors.textMuted}
              editable={!isLoading}
            />
          </View>

          {/* Show changes indicator */}
          {hasChanges && (
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: 8,
              paddingVertical: 4,
            }}>
              <MaterialCommunityIcons name="information" size={16} color="#31973D" />
              <Text style={{ fontSize: 12, color: '#31973D' }}>
                You have unsaved changes
              </Text>
            </View>
          )}
        </View>

        {/* Save Changes button */}
        <Pressable
          style={{
            width: '100%',
            height: 48,
            backgroundColor: canSave && hasChanges && !isLoading 
              ? '#31973D' 
              : 'rgba(49,151,61,0.5)',
            borderRadius: 9999,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading ? 0.7 : 1,
          }}
          disabled={!canSave || !hasChanges || isLoading}
          onPress={handleSave}
        >
          <Text style={{ fontSize: 14, lineHeight: 20, color: '#FFFFFF' }}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </Pressable>

        {/* Cancel button */}
        <Pressable
          style={{
            width: '100%',
            height: 48,
            borderRadius: 9999,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UpdateNameScreen;