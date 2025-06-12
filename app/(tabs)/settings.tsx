import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Moon, Sun, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard, Download, Mail } from 'lucide-react-native';

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
    rightElement 
  }: any) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + '20' }]}>
          <Icon size={20} color={theme.colors.primary} />
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
      <View style={styles.settingRight}>
        {rightElement || (showChevron && (
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        ))}
      </View>
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
          onPress={() => {}}
        />

        {/* Preferences Section */}
        <SectionHeader title="PREFERENCES" />
        <SettingItem
          icon={theme.isDark ? Moon : Sun}
          title="Appearance"
          subtitle={theme.isDark ? 'Dark mode' : 'Light mode'}
          rightElement={
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.isDark ? '#FFFFFF' : '#F4F3F4'}
            />
          }
          showChevron={false}
        />
        
        <SettingItem
          icon={Bell}
          title="Notifications"
          subtitle="Manage notification preferences"
          onPress={() => {}}
        />

        <SettingItem
          icon={CreditCard}
          title="Currency"
          subtitle="USD ($)"
          onPress={() => {}}
        />

        {/* Data Section */}
        <SectionHeader title="DATA" />
        <SettingItem
          icon={Download}
          title="Export Data"
          subtitle="Download your financial data"
          onPress={() => {}}
        />
        
        <SettingItem
          icon={Shield}
          title="Backup & Sync"
          subtitle="Keep your data safe"
          onPress={() => {}}
        />

        {/* Support Section */}
        <SectionHeader title="SUPPORT" />
        <SettingItem
          icon={HelpCircle}
          title="Help & Support"
          subtitle="Get help with YonaWallet"
          onPress={() => {}}
        />
        
        <SettingItem
          icon={Mail}
          title="Contact Us"
          subtitle="Send feedback or report issues"
          onPress={() => {}}
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
  settingRight: {
    marginLeft: 12,
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