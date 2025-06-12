import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard, ArrowUp, ArrowDown, Check, X } from 'lucide-react-native';

export default function DebtsScreen() {
  const { theme } = useTheme();
  const { debts, addDebt, updateDebt, deleteDebt } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'borrowed' | 'lent'>('borrowed');
  const [newDebt, setNewDebt] = useState({
    type: 'borrowed' as 'borrowed' | 'lent',
    personName: '',
    amount: '',
    dateBorrowed: new Date().toISOString().split('T')[0],
    dueDate: '',
    purpose: '',
  });

  const styles = createStyles(theme);

  const handleAddDebt = () => {
    if (newDebt.personName && newDebt.amount && newDebt.purpose) {
      addDebt({
        type: newDebt.type,
        personName: newDebt.personName,
        amount: parseFloat(newDebt.amount),
        dateBorrowed: newDebt.dateBorrowed,
        dueDate: newDebt.dueDate || undefined,
        purpose: newDebt.purpose,
        status: 'pending',
      });
      setNewDebt({
        type: 'borrowed',
        personName: '',
        amount: '',
        dateBorrowed: new Date().toISOString().split('T')[0],
        dueDate: '',
        purpose: '',
      });
      setShowAddModal(false);
    }
  };

  const handleStatusUpdate = (debtId: string, status: 'paid' | 'received') => {
    updateDebt(debtId, { status });
  };

  const handleDeleteDebt = (debtId: string, debtType: string, personName: string) => {
    Alert.alert(
      'Delete Debt Record',
      `Are you sure you want to delete this ${debtType} record with ${personName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteDebt(debtId) }
      ]
    );
  };

  const borrowedDebts = debts.filter(debt => debt.type === 'borrowed');
  const lentDebts = debts.filter(debt => debt.type === 'lent');

  const totalBorrowed = borrowedDebts.filter(d => d.status === 'pending').reduce((sum, debt) => sum + debt.amount, 0);
  const totalLent = lentDebts.filter(d => d.status === 'pending').reduce((sum, debt) => sum + debt.amount, 0);

  const renderDebtItem = (debt: any) => (
    <View key={debt.id} style={[styles.debtItem, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.debtHeader}>
        <View style={styles.debtInfo}>
          <Text style={[styles.debtPerson, { color: theme.colors.text }]}>
            {debt.type === 'borrowed' ? `From ${debt.personName}` : `To ${debt.personName}`}
          </Text>
          <Text style={[styles.debtPurpose, { color: theme.colors.textSecondary }]}>
            {debt.purpose}
          </Text>
          <Text style={[styles.debtDate, { color: theme.colors.textSecondary }]}>
            {new Date(debt.dateBorrowed).toLocaleDateString()}
            {debt.dueDate && ` • Due: ${new Date(debt.dueDate).toLocaleDateString()}`}
          </Text>
        </View>
        <View style={styles.debtActions}>
          <Text style={[
            styles.debtAmount, 
            { color: debt.type === 'borrowed' ? theme.colors.error : theme.colors.success }
          ]}>
            {debt.type === 'borrowed' ? '-' : '+'}${debt.amount.toLocaleString()}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={[
              styles.statusText,
              { 
                color: debt.status === 'pending' ? theme.colors.warning : theme.colors.success,
                backgroundColor: debt.status === 'pending' ? theme.colors.warning + '20' : theme.colors.success + '20'
              }
            ]}>
              {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      {debt.status === 'pending' && (
        <View style={styles.debtButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
            onPress={() => handleStatusUpdate(debt.id, debt.type === 'borrowed' ? 'paid' : 'received')}>
            <Check size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>
              {debt.type === 'borrowed' ? 'Mark as Paid' : 'Mark as Received'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            onPress={() => handleDeleteDebt(debt.id, debt.type, debt.personName)}>
            <X size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Debts</Text>
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
            <ArrowDown size={20} color={theme.colors.error} />
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Money Borrowed
            </Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ${totalBorrowed.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statHeader}>
            <ArrowUp size={20} color={theme.colors.success} />
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Money Lent
            </Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ${totalLent.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: selectedTab === 'borrowed' ? theme.colors.primary : theme.colors.surface,
            }
          ]}
          onPress={() => setSelectedTab('borrowed')}>
          <ArrowDown size={20} color={selectedTab === 'borrowed' ? '#FFFFFF' : theme.colors.textSecondary} />
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'borrowed' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}>
            Borrowed ({borrowedDebts.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: selectedTab === 'lent' ? theme.colors.primary : theme.colors.surface,
            }
          ]}
          onPress={() => setSelectedTab('lent')}>
          <ArrowUp size={20} color={selectedTab === 'lent' ? '#FFFFFF' : theme.colors.textSecondary} />
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'lent' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}>
            Lent ({lentDebts.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Debts List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedTab === 'borrowed' ? (
          borrowedDebts.length > 0 ? (
            borrowedDebts
              .sort((a, b) => new Date(b.dateBorrowed).getTime() - new Date(a.dateBorrowed).getTime())
              .map(renderDebtItem)
          ) : (
            <View style={styles.emptyState}>
              <ArrowDown size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No borrowed money recorded
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Track money you've borrowed from others
              </Text>
            </View>
          )
        ) : (
          lentDebts.length > 0 ? (
            lentDebts
              .sort((a, b) => new Date(b.dateBorrowed).getTime() - new Date(a.dateBorrowed).getTime())
              .map(renderDebtItem)
          ) : (
            <View style={styles.emptyState}>
              <ArrowUp size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No lent money recorded
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Track money you've lent to others
              </Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Add Debt Modal */}
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
              Add Debt Record
            </Text>
            <TouchableOpacity
              onPress={handleAddDebt}
              disabled={!newDebt.personName || !newDebt.amount || !newDebt.purpose}>
              <Text style={[
                styles.saveButton, 
                { color: newDebt.personName && newDebt.amount && newDebt.purpose ? theme.colors.primary : theme.colors.textSecondary }
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Type Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Type *</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: newDebt.type === 'borrowed' ? theme.colors.error : theme.colors.surface,
                      borderColor: theme.colors.error 
                    }
                  ]}
                  onPress={() => setNewDebt({ ...newDebt, type: 'borrowed' })}>
                  <ArrowDown size={20} color={newDebt.type === 'borrowed' ? '#FFFFFF' : theme.colors.error} />
                  <Text style={[
                    styles.typeOptionText,
                    { color: newDebt.type === 'borrowed' ? '#FFFFFF' : theme.colors.error }
                  ]}>
                    I Borrowed
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: newDebt.type === 'lent' ? theme.colors.success : theme.colors.surface,
                      borderColor: theme.colors.success 
                    }
                  ]}
                  onPress={() => setNewDebt({ ...newDebt, type: 'lent' })}>
                  <ArrowUp size={20} color={newDebt.type === 'lent' ? '#FFFFFF' : theme.colors.success} />
                  <Text style={[
                    styles.typeOptionText,
                    { color: newDebt.type === 'lent' ? '#FFFFFF' : theme.colors.success }
                  ]}>
                    I Lent
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                {newDebt.type === 'borrowed' ? 'Borrowed from *' : 'Lent to *'}
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newDebt.personName}
                onChangeText={(text) => setNewDebt({ ...newDebt, personName: text })}
                placeholder="Person's name"
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
                value={newDebt.amount}
                onChangeText={(text) => setNewDebt({ ...newDebt, amount: text })}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Purpose *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newDebt.purpose}
                onChangeText={(text) => setNewDebt({ ...newDebt, purpose: text })}
                placeholder="What was the money for?"
                placeholderTextColor={theme.colors.textSecondary}
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
                value={newDebt.dateBorrowed}
                onChangeText={(text) => setNewDebt({ ...newDebt, dateBorrowed: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Due Date</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newDebt.dueDate}
                onChangeText={(text) => setNewDebt({ ...newDebt, dueDate: text })}
                placeholder="YYYY-MM-DD (Optional)"
                placeholderTextColor={theme.colors.textSecondary}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  debtItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  debtInfo: {
    flex: 1,
  },
  debtPerson: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  debtPurpose: {
    fontSize: 14,
    marginBottom: 4,
  },
  debtDate: {
    fontSize: 12,
  },
  debtActions: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
  },
  debtButtonsContainer: {
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
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});