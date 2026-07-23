import { Image, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import CustomAppBar from '../../components/common/CustomAppBar';
import { useNotifications, useDeleteNotification } from '../../hooks/useNotifications';

type NotificationItem = {
  id: string;
  message: string;
  time: string;
};

const TODAY: NotificationItem[] = [];
const WEEK_AGO: NotificationItem[] = [];

const bellIcon = require("../../../assets/activities.png")

function NotificationRow({ item, iconSize, colors }: { item: NotificationItem; iconSize: number; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 12, gap: 16 }}>
      <View style={{ width: iconSize, height: iconSize, backgroundColor: colors.iconBg, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <MaterialCommunityIcons name="bell-outline" size={16} color="#31973D" />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Text style={{ flex: 1, fontWeight: '400', fontSize: 14, lineHeight: 20, color: colors.text }}>
          {item.message}
        </Text>
        <Text style={{ fontWeight: '400', fontSize: 12, lineHeight: 16, color: colors.textSub, paddingTop: 5, flexShrink: 0 }}>
          {item.time}
        </Text>
      </View>
    </View>
  );
}

function BellIllustration() {
  return (
    <View style={{ width: 196, height: 146, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, backgroundColor: '#EDE9FE', borderRadius: 999 }} />
      <View style={{ position: 'absolute', top: 52, left: 14, width: 8, height: 8, borderRadius: 999, backgroundColor: '#31973D' }} />
      <View style={{ position: 'absolute', bottom: 18, right: 12, width: 6, height: 6, borderRadius: 999, backgroundColor: '#31973D' }} />
      <View style={{ zIndex: 1, marginBottom: 8 }}>
        <MaterialCommunityIcons name="bell-sleep" size={86} color="#1B5E20" />
      </View>
      <Text style={{ position: 'absolute', top: 22, right: 50, fontSize: 20, fontWeight: '700', color: '#31973D', zIndex: 2 }}>Z</Text>
      <Text style={{ position: 'absolute', top: 6, right: 34, fontSize: 14, fontWeight: '700', color: '#31973D', zIndex: 2 }}>z</Text>
    </View>
  );
}

const hasActivity = TODAY.length > 0 || WEEK_AGO.length > 0;

export function NotificationsListScreen({ navigation }: RootStackScreenProps<'NotificationsList'>) {
  const { colors } = useTheme();
  const { data, isLoading } = useNotifications(50, 0);
  const deleteNotification = useDeleteNotification();

  const items: NotificationItem[] = (data?.notifications ?? []).map((n: any) => ({
    id: n.id,
    message: n.body,
    time: new Date(n.createdAt ?? n.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
  }));

  const hasItems = items.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        <CustomAppBar title="Notifications" navigation={navigation}/>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 24 }}
        >
          {isLoading ? (
            <ActivityIndicator color="#31973D" />
          ) : hasItems ? (
            <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, paddingVertical: 11 }}>
              <View style={{ paddingHorizontal: 16, gap: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '500', fontSize: 20, lineHeight: 28, color: colors.text }}>
                    Recent Activity
                  </Text>
                  <MaterialCommunityIcons name="tune-variant" size={18} color={colors.textSub} />
                </View>
                {items.map(item => (
                  <Pressable key={item.id} onLongPress={() => deleteNotification.mutate(item.id as any)}>
                    <NotificationRow item={item} iconSize={32} colors={colors} />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <>
              <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 64, gap: 12 }}>
                  <Image source={bellIcon} style={{width: 196, height: 146}}/>
                  <View style={{ alignItems: 'center', gap: 5, marginTop: 8 }}>
                    <Text style={{ fontWeight: '600', fontSize: 16, lineHeight: 24, color: colors.text, textAlign: 'center' }}>
                      All quiet here
                    </Text>
                    <Text style={{ fontWeight: '400', fontSize: 14, lineHeight: 20, color: colors.textSub, textAlign: 'center' }}>
                      You're all caught up! We'll notify you here about all activities on the platform
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16 }}>
                <Pressable
                  onPress={() => {navigation.navigate("NotificationSettings")}}
                  style={{ backgroundColor: colors.card, borderRadius: 28, padding: 24, flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
                  <View style={{ width: 32, height: 32, backgroundColor: '#DDD6FE', borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#7C3AED" />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontWeight: '600', fontSize: 14, lineHeight: 20, color: colors.text }}>Quick Tip</Text>
                    <Text style={{ fontWeight: '400', fontSize: 12, lineHeight: 18, color: colors.textSub }}>
                      Customize your notification preferences in settings.
                    </Text>
                  </View>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default NotificationsListScreen;
