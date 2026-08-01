import { View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { scale, verticalScale, moderateScale } from '../../utils/scale';

function SkeletonBar({
  width,
  height = moderateScale(12),
  radius = moderateScale(6),
  color,
  style,
}: {
  width: number | `${number}%`;
  height?: number;
  radius?: number;
  color?: string;
  style?: object;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: color ?? colors.iconBg,
        },
        style,
      ]}
    />
  );
}

function NotificationRowSkeleton({ iconSize }: { iconSize: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        gap: scale(16),
      }}
    >
      <View
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: moderateScale(12),
          backgroundColor: colors.iconBg,
          flexShrink: 0,
        }}
      />
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: scale(8) }}>
        <View style={{ flex: 1, gap: moderateScale(6) }}>
          <SkeletonBar width="90%" height={moderateScale(14)} />
          <SkeletonBar width="55%" height={moderateScale(14)} />
        </View>
        <SkeletonBar width={moderateScale(36)} height={moderateScale(12)} style={{ marginTop: verticalScale(5) }} />
      </View>
    </View>
  );
}

function SectionSkeleton({ rows, showDivider }: { rows: number; showDivider: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: moderateScale(8) }}>
      {/* Section label e.g. "TODAY" */}
      <SkeletonBar
        width={scale(64)}
        height={moderateScale(12)}
        style={{ marginHorizontal: scale(16) }}
      />
      <View>
        {Array.from({ length: rows }).map((_, i) => (
          <NotificationRowSkeleton key={i} iconSize={moderateScale(32)} />
        ))}
      </View>
      {showDivider && (
        <View style={{ height: 1, backgroundColor: colors.borderLight, marginHorizontal: scale(16) }} />
      )}
    </View>
  );
}

export function NotificationsListSkeleton() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: moderateScale(24),
        paddingVertical: verticalScale(11),
        gap: moderateScale(16),
      }}
    >
      {/* Header row — "Recent Activity" + tune icon */}
      <View
        style={{
          paddingHorizontal: scale(16),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SkeletonBar width={scale(140)} height={moderateScale(20)} />
        <SkeletonBar width={moderateScale(18)} height={moderateScale(18)} radius={moderateScale(4)} />
      </View>

      <SectionSkeleton rows={2} showDivider />
      <SectionSkeleton rows={3} showDivider={false} />
    </View>
  );
}