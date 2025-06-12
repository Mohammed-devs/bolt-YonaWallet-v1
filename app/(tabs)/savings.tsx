import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, PiggyBank, Target, Trash2, TrendingUp, TrendingDown } from 'lucide-react-native';

export default function SavingsScreen() {
  const { theme } = useTheme();
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useData();
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    color: '#10B981',
  });

  const styles = createStyles(theme);

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      addSavingsGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline || undefined,
        color: newGoal.color,
      });
      setNewGoal({
        name: '',
        targetAmount: '',
        deadline: '',
        color: '#10B981',
      });
      setShowAddGoalModal(false);
    }
  };

  const handleTransaction = () => {
    if (selectedGoal && transactionAmount) {
      const amount = parseFloat(transactionAmount);
      const newAmount = transactionType === 'deposit' 
        ? selectedGoal.currentAmount + amount
        : Math.max(0, selectedGoal.currentAmount - amount);
      
      updateSavingsGoal(selectedGoal.id, { currentAmount: newAmount });
      setTransactionAmount('');
      setShowTransactionModal(false);
      setSelectedGoal(null);
    }
  };

  const handleDeleteGoal = (goalId: string, goalName: string) => {
    Alert.alert(
      'Delete Savings Goal',
      `Are you sure you want to delete "${goalName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSavingsGoal(goalId) }
      ]
    );
  };

  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const averageProgress = savingsGoals.length > 0 
    ? savingsGoals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / savingsGoals.length * 100
    : 0;

  const goalColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#EC4899'];

  const openTransaction = (goal: any, type: 'deposit' | 'withdraw') => {
    setSelectedGoal(goal);
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Savings</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowAddGoalModal(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statHeader}>
            <PiggyBank size={20} color={theme.colors.success} />
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total Saved
            </Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ${totalSavings.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statHeader}>
            <Target size={20} color={theme.colors.primary} />
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Avg Progress
            </Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {averageProgress.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Savings Goals List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {savingsGoals.length > 0 ? (
          savingsGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = progress >= 100;
            
            return (
              <View key={goal.id} style={[styles.goalItem, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <View style={styles.goalTitle}>
                      <View style={[styles.goalColorDot, { backgroundColor: goal.color }]} />
                      <Text style={[styles.goalName, { color: theme.colors.text }]}>
                        {goal.name}
                      </Text>
                      {isCompleted && (
                        <Text style={[styles.completedBadge, { color: theme.colors.success }]}>
                          ✓ Completed
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.goalAmount, { color: theme.colors.textSecondary }]}>
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </Text>
                    {goal.deadline && (
                      <Text style={[styles.goalDeadline, { color: theme.colors.textSecondary }]}>
                        Target: {new Date(goal.deadline).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(goal.id, goal.name)}
                    style={styles.deleteButton}>
                    <Trash2 size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { backgroundColor: goal.color, width: `${Math.min(progress, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                  {progress.toFixed(1)}% complete • ${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                </Text>

                {/* Action Buttons */}
                <View style={styles.goalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => openTransaction(goal, 'deposit')}>
                    <TrendingUp size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Add Money</Text>
                  </TouchableOpacity>
                  
                  {goal.currentAmount > 0 && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.colors.warning }]}
                      onPress={() => openTransaction(goal, 'withdraw')}>
                      <TrendingDown size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Withdraw</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <PiggyBank size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No savings goals yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Create your first savings goal to start tracking your progress
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddGoalModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddGoalModal(false)}>
              <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              New Savings Goal
            </Text>
            <TouchableOpacity
              onPress={handleAddGoal}
              disabled={!newGoal.name || !newGoal.targetAmount}>
              <Text style={[
                styles.saveButton, 
                { color: newGoal.name && newGoal.targetAmount ? theme.colors.primary : theme.colors.textSecondary }
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Goal Name *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newGoal.name}
                onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
                placeholder="e.g., Emergency Fund, Vacation"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Target Amount *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newGoal.targetAmount}
                onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Target Date</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newGoal.deadline}
                onChangeText={(text) => setNewGoal({ ...newGoal, deadline: text })}
                placeholder="YYYY-MM-DD (Optional)"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
                {goalColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { 
                        backgroundColor: color,
                        borderWidth: newGoal.color === color ? 3 : 0,
                        borderColor: theme.colors.text 
                      }
                    ]}
                    onPress={() => setNewGoal({ ...newGoal, color })}
                  />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Transaction Modal */}
      <Modal
        visible={showTransactionModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTransactionModal(false)}>
              <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {transactionType === 'deposit' ? 'Add Money' : 'Withdraw Money'}
            </Text>
            <TouchableOpacity
              onPress={handleTransaction}
              disabled={!transactionAmount}>
              <Text style={[
                styles.saveButton, 
                { color: transactionAmount ? theme.colors.primary : theme.colors.textSecondary }
              ]}>
                {transactionType === 'deposit' ? 'Add' : 'Withdraw'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {selectedGoal && (
              <View style={styles.goalSummary}>
                <Text style={[styles.goalSummaryTitle, { color: theme.colors.text }]}>
                  {selectedGoal.name}
                </Text>
                <Text style={[styles.goalSummaryAmount, { color: theme.colors.textSecondary }]}>
                  Current: ${selectedGoal.currentAmount.toLocaleString()}
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Amount *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={transactionAmount}
                onChangeText={setTransactionAmount}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                autoFocus
              />
            </View>
          </View>
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
  goalItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  completedBadge: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  goalAmount: {
    fontSize: 16,
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 12,
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
  colorScroll: {
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  goalSummary: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 24,
  },
  goalSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalSummaryAmount: {
    fontSize: 16,
  },
});