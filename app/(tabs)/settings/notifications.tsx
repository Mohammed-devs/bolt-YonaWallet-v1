import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Bell, Mail, Smartphone, Clock, Save } from 'lucide-react-native';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    expenseAlerts: true,
    savingsGoalUpdates: true,
    debtReminders: true,
    weeklyReports: false,
    monthlyReports: true,
    frequency: 'immediate', // immediate, daily, weekly
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const styles = createStyles(theme);

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Notification preferences saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const SettingToggle = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    value, 
    onValueChange,
    iconColor = theme.colors.primary
  }: any) => (
    <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
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
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
      />
    </View>
  );

  const FrequencyOption = ({ label, value, selected, onPress }: any) => (
    <TouchableOpacity
      style={[
        styles.frequencyOption,
        { 
          backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border
        }
      ]}
      onPress={onPress}>
      <Text style={[
        styles.frequencyText,
        { color: selected ? '#FFFFFF' : theme.colors.text }
      ]}>
        {label}
      </Text>
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        {successMessage && (
          <View style={[styles.successContainer, { backgroundColor: theme.colors.success + '10' }]}>
            <Text style={[styles.successText, { color: theme.colors.success }]}>
              {successMessage}
            </Text>
          </View>
        )}

        {/* Notification Types */}
        <SectionHeader title="NOTIFICATION TYPES" />
        
        <SettingToggle
          icon={Mail}
          title="Email Notifications"
          subtitle="Receive notifications via email"
          value={settings.emailNotifications}
          onValueChange={(value: boolean) => updateSetting('emailNotifications', value)}
        />

        <SettingToggle
          icon={Smartphone}
          title="Push Notifications"
          subtitle="Receive push notifications on your device"
          value={settings.pushNotifications}
          onValueChange={(value: boolean) => updateSetting('pushNotifications', value)}
        />

        <SettingToggle
          icon={Bell}
          title="In-App Notifications"
          subtitle="Show notifications within the app"
          value={settings.inAppNotifications}
          onValueChange={(value: boolean) => updateSetting('inAppNotifications', value)}
        />

        {/* Financial Alerts */}
        <SectionHeader title="FINANCIAL ALERTS" />
        
        <SettingToggle
          icon={Bell}
          title="Expense Alerts"
          subtitle="Get notified when approaching spending limits"
          value={settings.expenseAlerts}
          onValueChange={(value: boolean) => updateSetting('expenseAlerts', value)}
          iconColor={theme.colors.warning}
        />

        <SettingToggle
          icon={Bell}
          title="Savings Goal Updates"
          subtitle="Notifications for savings milestones"
          value={settings.savingsGoalUpdates}
          onValueChange={(value: boolean) => updateSetting('savingsGoalUpdates', value)}
          iconColor={theme.colors.success}
        />

        <SettingToggle
          icon={Bell}
          title="Debt Reminders"
          subtitle="Reminders for upcoming debt payments"
          value={settings.debtReminders}
          onValueChange={(value: boolean) => updateSetting('debtReminders', value)}
          iconColor={theme.colors.error}
        />

        {/* Reports */}
        <SectionHeader title="REPORTS" />
        
        <SettingToggle
          icon={Clock}
          title="Weekly Reports"
          subtitle="Summary of your weekly financial activity"
          value={settings.weeklyReports}
          onValueChange={(value: boolean) => updateSetting('weeklyReports', value)}
        />

        <SettingToggle
          icon={Clock}
          title="Monthly Reports"
          subtitle="Comprehensive monthly financial overview"
          value={settings.monthlyReports}
          onValueChange={(value: boolean) => updateSetting('monthlyReports', value)}
        />

        {/* Frequency Settings */}
        <SectionHeader title="NOTIFICATION FREQUENCY" />
        
        <View style={[styles.frequencyContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.frequencyTitle, { color: theme.colors.text }]}>
            How often would you like to receive notifications?
          </Text>
          
          <View style={styles.frequencyOptions}>
            <FrequencyOption
              label="Immediate"
              value="immediate"
              selected={settings.frequency === 'immediate'}
              onPress={() => updateSetting('frequency', 'immediate')}
            />
            <FrequencyOption
              label="Daily Digest"
              value="daily"
              selected={settings.frequency === 'daily'}
              onPress={() => updateSetting('frequency', 'daily')}
            />
            <FrequencyOption
              label="Weekly Summary"
              value="weekly"
              selected={settings.frequency === 'weekly'}
              onPress={() => updateSetting('frequency', 'weekly')}
            />
          </View>
        </View>

        {/* Preview Section */}
        <SectionHeader title="PREVIEW" />
        
        <View style={[styles.previewContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.previewTitle, { color: theme.colors.text }]}>
            Notification Preview
          </Text>
          <View style={[styles.previewNotification, { backgroundColor: theme.colors.background }]}>
            <Bell size={16} color={theme.colors.primary} />
            <View style={styles.previewContent}>
              <Text style={[styles.previewNotificationTitle, { color: theme.colors.text }]}>
                Expense Alert
              </Text>
              <Text style={[styles.previewNotificationText, { color: theme.colors.textSecondary }]}>
                You've spent 80% of your Food & Dining budget this month.
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
          disabled={isLoading}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  successContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
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
  frequencyContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  frequencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewNotification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
  },
  previewContent: {
    flex: 1,
    marginLeft: 12,
  },
  previewNotificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewNotificationText: {
    fontSize: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});