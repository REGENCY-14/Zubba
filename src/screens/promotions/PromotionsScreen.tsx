import React, { useState } from 'react';
import { Pressable, ScrollView, Share, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, ThemeColors } from '../../context/ThemeContext';
import { useAppSelector } from '../../hooks/useAppSelector';
import type { RootStackScreenProps } from '../../navigation/types';

type Promo = {
  id: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  badge?: string;
  cta?: string;
  onPress?: () => void;
  premiumOnly?: boolean;
};

const VALID_CODES = ['ZUBBA10', 'ECOFRIEND'];

function PromoCard({ promo, colors }: { promo: Promo; colors: ThemeColors }) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: promo.iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialCommunityIcons name={promo.icon} size={22} color={promo.iconColor} />
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, color: colors.text, flexShrink: 1 }}>
              {promo.title}
            </Text>
            {promo.badge && (
              <View style={{ backgroundColor: 'rgba(49,151,61,0.12)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 10, fontWeight: '600', color: '#31973D' }}>{promo.badge}</Text>
              </View>
            )}
          </View>
          <Text style={{ fontFamily: 'Poppins', fontSize: 12, lineHeight: 18, color: colors.textSub }}>
            {promo.description}
          </Text>
        </View>
      </View>

      {promo.cta && (
        <Pressable
          onPress={promo.onPress}
          style={{
            alignSelf: 'flex-start',
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: '#31973D',
          }}
        >
          <Text style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>{promo.cta}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function PromotionsScreen({ navigation }: RootStackScreenProps<'Promotions'>) {
  const { colors } = useTheme();
  const customer = useAppSelector((state) => state.customer);
  const [promoCode, setPromoCode] = useState('');
  const [redeemMessage, setRedeemMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleRedeem = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (VALID_CODES.includes(code)) {
      setRedeemMessage({ text: `"${code}" applied — Eco-Points bonus is on its way!`, success: true });
    } else {
      setRedeemMessage({ text: 'That code isn’t valid or has expired.', success: false });
    }
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: 'Join me on Zubba and we both earn GHS 20 wallet credit on your first pickup! Download the app to get started.',
      });
    } catch {
      // user dismissed the share sheet
    }
  };

  const allPromos: Promo[] = [
    {
      id: 'weekend-2x',
      icon: 'flash',
      iconColor: '#31973D',
      iconBg: 'rgba(49,151,61,0.12)',
      title: '2X Eco-Points This Weekend',
      description: 'Every pickup scheduled Saturday–Sunday earns double Eco-Points, automatically.',
      badge: 'Ends Sun',
    },
    {
      id: 'refer',
      icon: 'account-multiple-plus-outline',
      iconColor: '#2F91FB',
      iconBg: 'rgba(47,145,251,0.12)',
      title: 'Refer & Earn GHS 20',
      description: 'Invite a friend to Zubba — you both get GHS 20 wallet credit after their first completed pickup.',
      cta: 'Share Invite',
      onPress: handleShareInvite,
    },
    {
      id: 'milestone',
      icon: 'truck-check-outline',
      iconColor: '#FE8235',
      iconBg: 'rgba(254,130,53,0.12)',
      title: '5 Pickups, 1 Free',
      description: 'Complete 5 paid pickups in a month and your 6th pickup is on us.',
      badge: 'This month',
    },
    {
      id: 'gold',
      icon: 'crown-outline',
      iconColor: '#735C00',
      iconBg: 'rgba(255,224,136,0.35)',
      title: 'Go Gold — Unlock Double Rewards',
      description: 'Upgrade to Gold for double Eco-Points, priority support, and scheduled pickups.',
      badge: 'Popular',
      cta: 'Upgrade',
      onPress: () => navigation.navigate('ChoosePlan'),
      premiumOnly: true,
    },
  ];
  const promos = allPromos.filter((promo) => !promo.premiumOnly || !customer.is_premium);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        {/* Header */}
        <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 24, color: colors.text }}>
            Promotions
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 20 }}
        >
          {/* Eco-Points hero */}
          <View style={{ backgroundColor: '#31973D', borderRadius: 20, padding: 20, gap: 8, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="leaf" size={18} color="#90FA96" />
              <Text style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.85)' }}>
                Your Eco-Points
              </Text>
            </View>
            <Text style={{ fontFamily: 'Poppins', fontSize: 32, fontWeight: '700', color: '#FFFFFF' }}>
              {customer.points.toLocaleString()}
            </Text>
            <Text style={{ fontFamily: 'Poppins', fontSize: 12, lineHeight: 18, color: 'rgba(255,255,255,0.85)' }}>
              Every pickup earns you points — redeem them for wallet credit and exclusive rewards.
            </Text>
          </View>

          {/* Promo code redeem */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: colors.text }}>
              Have a promo code?
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={promoCode}
                onChangeText={(text) => {
                  setPromoCode(text);
                  if (redeemMessage) setRedeemMessage(null);
                }}
                placeholder="Enter code"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.text,
                  paddingHorizontal: 16,
                  fontFamily: 'Poppins',
                  fontSize: 14,
                }}
              />
              <Pressable
                onPress={handleRedeem}
                disabled={!promoCode.trim()}
                style={{
                  height: 48,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: promoCode.trim() ? '#31973D' : 'rgba(49,151,61,0.4)',
                }}
              >
                <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Apply</Text>
              </Pressable>
            </View>
            {redeemMessage && (
              <Text
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  color: redeemMessage.success ? '#31973D' : '#EF4444',
                }}
              >
                {redeemMessage.text}
              </Text>
            )}
          </View>

          {/* Offers */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: colors.text }}>
              Offers for you
            </Text>
            {promos.map((promo) => (
              <PromoCard key={promo.id} promo={promo} colors={colors} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default PromotionsScreen;
