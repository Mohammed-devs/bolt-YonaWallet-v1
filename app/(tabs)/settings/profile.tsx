import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, User, Mail, Lock, Camera, Save, Eye, EyeOff } from 'lucide-react-native';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState('');

  const styles = createStyles(theme);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (newPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile
      await updateProfile({
        name: name.trim(),
        email,
        ...(newPassword && { password: newPassword })
      });
      
      setSuccessMessage('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicturePress = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Photo Library', onPress: () => console.log('Photo Library selected') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Profile Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles.profilePictureSection}>
          <TouchableOpacity 
            style={[styles.profilePicture, { backgroundColor: theme.colors.surface }]}
            onPress={handleProfilePicturePress}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }}
              style={styles.profileImage}
            />
            <View style={[styles.cameraIcon, { backgroundColor: theme.colors.primary }]}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.profilePictureText, { color: theme.colors.textSecondary }]}>
            Tap to change profile picture
          </Text>
        </View>

        {/* Success Message */}
        {successMessage && (
          <View style={[styles.successContainer, { backgroundColor: theme.colors.success + '10' }]}>
            <Text style={[styles.successText, { color: theme.colors.success }]}>
              {successMessage}
            </Text>
          </View>
        )}

        {/* Error Message */}
        {errors.general && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.general}
            </Text>
          </View>
        )}

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Basic Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Full Name</Text>
            <View style={[
              styles.inputContainer, 
              { 
                backgroundColor: theme.colors.surface,
                borderColor: errors.name ? theme.colors.error : theme.colors.border 
              }
            ]}>
              <User size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            {errors.name && (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.name}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email</Text>
            <View style={[
              styles.inputContainer, 
              { 
                backgroundColor: theme.colors.surface,
                borderColor: errors.email ? theme.colors.error : theme.colors.border 
              }
            ]}>
              <Mail size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.email}
              </Text>
            )}
          </View>
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Change Password
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Leave blank if you don't want to change your password
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Current Password</Text>
            <View style={[
              styles.inputContainer, 
              { 
                backgroundColor: theme.colors.surface,
                borderColor: errors.currentPassword ? theme.colors.error : theme.colors.border 
              }
            ]}>
              <Lock size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                {showCurrentPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.currentPassword && (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.currentPassword}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>New Password</Text>
            <View style={[
              styles.inputContainer, 
              { 
                backgroundColor: theme.colors.surface,
                borderColor: errors.newPassword ? theme.colors.error : theme.colors.border 
              }
            ]}>
              <Lock size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.newPassword && (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.newPassword}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Confirm New Password</Text>
            <View style={[
              styles.inputContainer, 
              { 
                backgroundColor: theme.colors.surface,
                borderColor: errors.confirmPassword ? theme.colors.error : theme.colors.border 
              }
            ]}>
              <Lock size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
          disabled={isLoading}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Changes'}
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
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureText: {
    fontSize: 14,
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
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  fieldError: {
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});