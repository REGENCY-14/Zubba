import React from 'react';
import { ImageBackground, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../components';
import type { RootStackScreenProps } from '../navigation/types';

const mapImage = require('../../assets/RawMap.png');

type MetricCardProps = {
	icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
	iconColor: string;
	iconBackground: string;
	accentColor: string;
	label: string;
	value: string;
	caption: string;
};

type ActionRowProps = {
	icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
	iconBackground: string;
	iconColor: string;
	title: string;
	subtitle: string;
	buttonLabel: string;
	buttonBackground: string;
	buttonBorderColor?: string;
	buttonTextColor: string;
	onButtonPress?: () => void;
};

function MetricCard({ icon, iconColor, iconBackground, accentColor, label, value, caption }: MetricCardProps) {
	return (
		<View style={styles.metricCard}>
			<View style={styles.metricHeaderRow}>
				<View style={[styles.metricIconWrap, { backgroundColor: iconBackground }]}>
					<MaterialCommunityIcons name={icon} size={20} color={iconColor} />
				</View>
				<Text style={[styles.metricLabel, { color: accentColor }]}>{label}</Text>
			</View>
			<Text style={styles.metricValue}>{value}</Text>
			<Text style={styles.metricCaption}>{caption}</Text>
		</View>
	);
}

function ActionRow({
	icon,
	iconBackground,
	iconColor,
	title,
	subtitle,
	buttonLabel,
	buttonBackground,
	buttonBorderColor,
	buttonTextColor,
	onButtonPress,
}: ActionRowProps) {
	return (
		<View style={styles.actionRow}>
			<View style={styles.actionInfoRow}>
				<View style={[styles.actionIconWrap, { backgroundColor: iconBackground }]}>
					<MaterialCommunityIcons name={icon} size={20} color={iconColor} />
				</View>
				<View style={styles.actionTextColumn}>
					<Text style={styles.actionTitle}>{title}</Text>
					<Text style={styles.actionSubtitle}>{subtitle}</Text>
				</View>
			</View>

			<Pressable
				onPress={onButtonPress}
				disabled={!onButtonPress}
				style={({ pressed }) => [
					styles.actionButton,
					{ backgroundColor: buttonBackground, borderColor: buttonBorderColor ?? 'transparent' },
					pressed && onButtonPress && styles.actionButtonPressed,
				]}
			>
				<Text style={[styles.actionButtonLabel, { color: buttonTextColor }]}>{buttonLabel}</Text>
			</Pressable>
		</View>
	);
}

export function LocationSharingScreen({ navigation }: RootStackScreenProps<'LocationSharing'>) {
	const [searchQuery, setSearchQuery] = React.useState('');

	const handleSearchSubmit = React.useCallback(() => {
		const query = searchQuery.trim();
		navigation.navigate('Details', {
			itemId: query || 'search',
			title: query || 'Search',
		});
	}, [navigation, searchQuery]);

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
			<StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

			<ImageBackground source={mapImage} resizeMode="cover" style={styles.background} imageStyle={styles.backgroundImage}>
				<View style={styles.headerRow}>
					<Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10} style={styles.iconButton}>
						<MaterialIcons name="menu" size={22} color="#111827" />
					</Pressable>

					<Pressable onPress={() => navigation.navigate('Notifications')} hitSlop={10} style={styles.bellButton}>
						<MaterialCommunityIcons name="bell-outline" size={22} color="#1F2937" />
						<View style={styles.notificationDot} />
					</Pressable>
				</View>

				<View style={styles.searchBox}>
					<TextInput
						style={styles.searchInput}
						placeholder="Where is your waste?"
						placeholderTextColor="#333333"
						value={searchQuery}
						onChangeText={setSearchQuery}
						onSubmitEditing={handleSearchSubmit}
						returnKeyType="search"
						selectionColor="#31973D"
					/>
					<Pressable onPress={handleSearchSubmit} hitSlop={10} style={styles.searchButton}>
						<MaterialIcons name="search" size={24} color="#111111" />
					</Pressable>
				</View>

				<View style={styles.statsRow}>
					<MetricCard
						icon="recycle"
						iconColor="#2F9E44"
						iconBackground="rgba(47, 158, 68, 0.08)"
						accentColor="#31973D"
						label="ACTIVE"
						value="42kg"
						caption="Recycled this month"
					/>
					<MetricCard
						icon="star-circle-outline"
						iconColor="#8B6B00"
						iconBackground="rgba(255, 224, 136, 0.38)"
						accentColor="#8B6B00"
						label="POINTS"
						value="1,250"
						caption="Eco Credits earned"
					/>
				</View>

				<View style={styles.actionsSection}>
					<ActionRow
						icon="truck-outline"
						iconBackground="rgba(47, 158, 68, 0.08)"
						iconColor="#2F9E44"
						title="Find nearby tricycles"
						subtitle="Instant pickup"
						buttonLabel="Request now"
						buttonBackground="#31973D"
						buttonTextColor="#FFFFFF"
						onButtonPress={() => navigation.navigate('Scanning')}
					/>

					<ActionRow
						icon="crown-outline"
						iconBackground="rgba(255, 224, 136, 0.45)"
						iconColor="#FED65B"
						title="Plan future pickup"
						subtitle="Future service"
						buttonLabel="Premium Tier"
						buttonBackground="#FFE088"
						buttonBorderColor="#E2E8F0"
						buttonTextColor="#574500"
					/>

					<Pressable style={styles.upgradeNoteRow} onPress={() => navigation.navigate('ChoosePlan')}>
						<MaterialCommunityIcons name="lock-outline" size={13} color="#735C00" />
						<Text style={styles.upgradeNote}>Upgrade to Gold for scheduled pickups</Text>
					</Pressable>
				</View>

				<AppBottomNav
					activeTab="home"
					paddingBottom={14}
					onHomePress={() => navigation.navigate('LocationSharing')}
					onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
					onSettingsPress={() => navigation.navigate('Settings')}
					onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
				/>
			</ImageBackground>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	background: {
		flex: 1,
		backgroundColor: '#F8FAFC',
	},
	backgroundImage: {
		opacity: 0.72,
	},
	headerRow: {
		height: 48,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	iconButton: {
		width: 32,
		height: 32,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	bellButton: {
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E7EB',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	notificationDot: {
		position: 'absolute',
		top: 8,
		right: 9,
		width: 8,
		height: 8,
		borderRadius: 9999,
		backgroundColor: '#EF4444',
	},
	searchBox: {
		marginTop: 14,
		marginHorizontal: 10,
		height: 54,
		borderRadius: 27,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.11)',
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	searchInput: {
		flex: 1,
		fontFamily: 'Inter',
		fontSize: 14,
		lineHeight: 17,
		color: '#333333',
		paddingVertical: 0,
		paddingHorizontal: 0,
		margin: 0,
	},
	searchButton: {
		width: 24,
		height: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	statsRow: {
		marginTop: 31,
		paddingHorizontal: 16,
		flexDirection: 'row',
		gap: 10,
	},
	metricCard: {
		flex: 1,
		minHeight: 132,
		padding: 16,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: '#E2E8F0',
		backgroundColor: 'rgba(255, 255, 255, 0.96)',
	},
	metricHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	metricIconWrap: {
		width: 22,
		height: 22,
		borderRadius: 9999,
		alignItems: 'center',
		justifyContent: 'center',
	},
	metricLabel: {
		fontFamily: 'Poppins',
		fontSize: 12,
		lineHeight: 14,
		letterSpacing: 1.2,
		fontWeight: '600',
	},
	metricValue: {
		fontFamily: 'Poppins',
		fontSize: 20,
		lineHeight: 28,
		fontWeight: '600',
		color: '#1F2A33',
		marginBottom: 2,
	},
	metricCaption: {
		fontFamily: 'Poppins',
		fontSize: 14,
		lineHeight: 21,
		fontWeight: '500',
		color: '#6F7A6C',
	},
	actionsSection: {
		marginTop: 118,
		paddingHorizontal: 10,
		gap: 10,
	},
	actionRow: {
		minHeight: 72,
		padding: 12,
		borderRadius: 9999,
		borderWidth: 1,
		borderColor: '#E2E8F0',
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	actionInfoRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		minWidth: 0,
	},
	actionIconWrap: {
		width: 40,
		height: 40,
		borderRadius: 9999,
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionTextColumn: {
		flex: 1,
		minWidth: 0,
	},
	actionTitle: {
		fontFamily: 'Poppins',
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '500',
		color: '#1F2A33',
	},
	actionSubtitle: {
		marginTop: 2,
		fontFamily: 'Poppins',
		fontSize: 10,
		lineHeight: 16,
		color: '#64748A',
	},
	actionButton: {
		minWidth: 123,
		height: 40,
		borderRadius: 20,
		paddingHorizontal: 16,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
	},
	actionButtonPressed: {
		opacity: 0.88,
	},
	actionButtonLabel: {
		fontFamily: 'Plus Jakarta Sans',
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '500',
	},
	upgradeNoteRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 4,
		paddingTop: 4,
	},
	upgradeNote: {
		fontFamily: 'Inter',
		fontSize: 14,
		lineHeight: 21,
		fontStyle: 'italic',
		color: '#574500',
	},
});
