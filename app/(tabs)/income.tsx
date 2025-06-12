import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react-native';

export default function IncomeScreen() {
  const { theme } = useTheme();
  const { incomes, addIncome } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const styles = createStyles(theme);

  const handleAddIncome = () => {
    if (newIncome.source && newIncome.amount) {
      addIncome({
        source: newIncome.source,
        amount: parseFloat(newIncome.amount),
        date: newIncome.date,
        description: newIncome.description,
      });
      setNewIncome({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setShowAddModal(false);
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const monthlyIncome = incomes
    .filter(income => {
      const incomeDate = new Date(income.date);
      const currentDate = new Date();
      return incomeDate.getMonth() === currentDate.getMonth() && 
             incomeDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, income) => sum + income.amount, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Income</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowAddModal(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statHeader}>
            <TrendingUp size={20} color={theme.colors.success} />
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total Income
            </Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ${totalIncome.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statHeader}>
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              This Month
            </Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ${monthlyIncome.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Income List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {incomes.length > 0 ? (
          incomes
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((income) => (
              <View key={income.id} style={[styles.incomeItem, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.incomeHeader}>
                  <View style={styles.incomeInfo}>
                    <Text style={[styles.incomeSource, { color: theme.colors.text }]}>
                      {income.source}
                    </Text>
                    <Text style={[styles.incomeDate, { color: theme.colors.textSecondary }]}>
                      {new Date(income.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.incomeAmount, { color: theme.colors.success }]}>
                    +${income.amount.toLocaleString()}
                  </Text>
                </View>
                {income.description && (
                  <Text style={[styles.incomeDescription, { color: theme.colors.textSecondary }]}>
                    {income.description}
                  </Text>
                )}
              </View>
            ))
        ) : (
          <View style={styles.emptyState}>
            <DollarSign size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No income recorded yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Add your first income entry to get started
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Income Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Add Income
            </Text>
            <TouchableOpacity
              onPress={handleAddIncome}
              disabled={!newIncome.source || !newIncome.amount}>
              <Text style={[
                styles.saveButton, 
                { color: newIncome.source && newIncome.amount ? theme.colors.primary : theme.colors.textSecondary }
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Source *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newIncome.source}
                onChangeText={(text) => setNewIncome({ ...newIncome, source: text })}
                placeholder="e.g., Salary, Freelance, Investment"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Amount *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newIncome.amount}
                onChangeText={(text) => setNewIncome({ ...newIncome, amount: text })}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Date *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newIncome.date}
                onChangeText={(text) => setNewIncome({ ...newIncome, date: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newIncome.description}
                onChangeText={(text) => setNewIncome({ ...newIncome, description: text })}
                placeholder="Optional description"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  incomeItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeSource: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  incomeDate: {
    fontSize: 14,
  },
  incomeAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  incomeDescription: {
    fontSize: 14,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});