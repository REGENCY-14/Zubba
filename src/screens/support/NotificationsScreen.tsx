import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import CustomAppBar from '../../components/common/CustomAppBar';
import { AppBottomNav } from '../../components';

export function NotificationsScreen({ navigation }: RootStackScreenProps<'Notifications'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar title="Notifications" navigation={navigation}/>

        {/* fill in here */}
        
        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          navigation={navigation}
        />
        
      </View>
    </SafeAreaView>
  );
}

export default NotificationsScreen;
