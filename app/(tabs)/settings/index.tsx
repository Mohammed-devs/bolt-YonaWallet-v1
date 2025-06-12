import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  DollarSign, 
  Mail, 
  Moon, 
  Sun, 
  ChevronRight, 
  LogOut,
  Settings as SettingsIcon
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const styles = createStyles(theme);

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    iconColor = theme.colors.primary
  }: any) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: iconColor + '20' }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showChevron && (
        <ChevronRight size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
      {title}
    </Text>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <SectionHeader title="PROFILE" />
        <SettingItem
          icon={User}
          title={user?.name || 'User'}
          subtitle={user?.email}
          onPress={() => router.push('/settings/profile')}
        />

        {/* Preferences Section */}
        <SectionHeader title="PREFERENCES" />
        <SettingItem
          icon={theme.isDark ? Moon : Sun}
          title="Appearance"
          subtitle={theme.isDark ? 'Dark mode' : 'Light mode'}
          onPress={toggleTheme}
          showChevron={false}
        />
        
        <SettingItem
          icon={Bell}
          title="Notifications"
          subtitle="Manage notification preferences"
          onPress={() => router.push('/settings/notifications')}
        />

        <SettingItem
          icon={DollarSign}
          title="Currency"
          subtitle="USD ($)"
          onPress={() => router.push('/settings/currency')}
        />

        {/* Data Section */}
        <SectionHeader title="DATA MANAGEMENT" />
        <SettingItem
          icon={Download}
          title="Export Data"
          subtitle="Download your financial data"
          onPress={() => router.push('/settings/data-export')}
        />
        
        <SettingItem
          icon={Shield}
          title="Backup & Sync"
          subtitle="Keep your data safe"
          onPress={() => router.push('/settings/backup')}
        />

        {/* Support Section */}
        <SectionHeader title="SUPPORT" />
        <SettingItem
          icon={SettingsIcon}
          title="Help & Support"
          subtitle="Get help with YonaWallet"
          onPress={() => router.push('/settings/help')}
        />
        
        <SettingItem
          icon={Mail}
          title="Contact Support"
          subtitle="Send feedback or report issues"
          onPress={() => router.push('/settings/contact')}
        />

        {/* Account Section */}
        <SectionHeader title="ACCOUNT" />
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.colors.error + '10' }]}
          onPress={logout}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
            YonaWallet v1.0.0
          </Text>
          <Text style={[styles.appCopyright, { color: theme.colors.textSecondary }]}>
            © 2024 YonaWallet. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
  },
});