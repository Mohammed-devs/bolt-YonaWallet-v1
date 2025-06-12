import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingDown, Settings, CreditCard as Edit3, Trash2 } from 'lucide-react-native';

export default function ExpensesScreen() {
  const { theme } = useTheme();
  const { expenses, expenseCategories, addExpense, updateExpense, deleteExpense, addExpenseCategory, updateExpenseCategory, deleteExpenseCategory } = useData();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    categoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#EF4444',
    monthlyLimit: '',
  });

  const styles = createStyles(theme);

  const handleAddExpense = () => {
    if (newExpense.categoryId && newExpense.amount && newExpense.description) {
      addExpense({
        categoryId: newExpense.categoryId,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        description: newExpense.description,
      });
      setNewExpense({
        categoryId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setShowAddExpenseModal(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      addExpenseCategory({
        name: newCategory.name,
        color: newCategory.color,
        monthlyLimit: newCategory.monthlyLimit ? parseFloat(newCategory.monthlyLimit) : undefined,
      });
      setNewCategory({
        name: '',
        color: '#EF4444',
        monthlyLimit: '',
      });
      setShowAddCategoryModal(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return expenseDate.getMonth() === currentDate.getMonth() && 
             expenseDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryColors = ['#EF4444', '#3B82F6', '#10B981', '#8B5CF6', '#06B6D4', '#F59E0B', '#EC4899', '#84CC16'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Expenses</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => setShowCategoriesModal(true)}>
            <Settings size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowAddExpenseModal(true)}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statHeader}>
            <TrendingDown size={20} color={theme.colors.error} />
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total Expenses
            </Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ${totalExpenses.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statHeader}>
            <TrendingDown size={20} color={theme.colors.warning} />
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              This Month
            </Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ${monthlyExpenses.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Expenses List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {expenses.length > 0 ? (
          expenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense) => {
              const category = expenseCategories.find(cat => cat.id === expense.categoryId);
              return (
                <View key={expense.id} style={[styles.expenseItem, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.expenseHeader}>
                    <View style={styles.expenseInfo}>
                      <View style={styles.expenseTitle}>
                        <View style={[styles.categoryDot, { backgroundColor: category?.color }]} />
                        <Text style={[styles.expenseDescription, { color: theme.colors.text }]}>
                          {expense.description}
                        </Text>
                      </View>
                      <Text style={[styles.expenseCategory, { color: theme.colors.textSecondary }]}>
                        {category?.name} • {new Date(expense.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={[styles.expenseAmount, { color: theme.colors.error }]}>
                      -${expense.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              );
            })
        ) : (
          <View style={styles.emptyState}>
            <TrendingDown size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No expenses recorded yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Add your first expense to get started
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddExpenseModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddExpenseModal(false)}>
              <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Add Expense
            </Text>
            <TouchableOpacity
              onPress={handleAddExpense}
              disabled={!newExpense.categoryId || !newExpense.amount || !newExpense.description}>
              <Text style={[
                styles.saveButton, 
                { color: newExpense.categoryId && newExpense.amount && newExpense.description ? theme.colors.primary : theme.colors.textSecondary }
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {expenseCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      { 
                        backgroundColor: newExpense.categoryId === category.id ? category.color : theme.colors.surface,
                        borderColor: category.color 
                      }
                    ]}
                    onPress={() => setNewExpense({ ...newExpense, categoryId: category.id })}>
                    <Text style={[
                      styles.categoryOptionText,
                      { color: newExpense.categoryId === category.id ? '#FFFFFF' : theme.colors.text }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Amount *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Description *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newExpense.description}
                onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
                placeholder="What did you spend on?"
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
                value={newExpense.date}
                onChangeText={(text) => setNewExpense({ ...newExpense, date: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Categories Management Modal */}
      <Modal
        visible={showCategoriesModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCategoriesModal(false)}>
              <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                Done
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Manage Categories
            </Text>
            <TouchableOpacity onPress={() => setShowAddCategoryModal(true)}>
              <Text style={[styles.saveButton, { color: theme.colors.primary }]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {expenseCategories.map((category) => (
              <View key={category.id} style={[styles.categoryItem, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <View style={styles.categoryDetails}>
                    <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                      {category.name}
                    </Text>
                    <Text style={[styles.categoryLimit, { color: theme.colors.textSecondary }]}>
                      {category.monthlyLimit ? `Limit: $${category.monthlyLimit}` : 'No limit set'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Delete Category',
                      `Are you sure you want to delete "${category.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteExpenseCategory(category.id) }
                      ]
                    );
                  }}
                  style={styles.deleteButton}>
                  <Trash2 size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        visible={showAddCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddCategoryModal(false)}>
              <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              New Category
            </Text>
            <TouchableOpacity
              onPress={handleAddCategory}
              disabled={!newCategory.name}>
              <Text style={[
                styles.saveButton, 
                { color: newCategory.name ? theme.colors.primary : theme.colors.textSecondary }
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Name *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newCategory.name}
                onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                placeholder="e.g., Food & Dining"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
                {categoryColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { 
                        backgroundColor: color,
                        borderWidth: newCategory.color === color ? 3 : 0,
                        borderColor: theme.colors.text 
                      }
                    ]}
                    onPress={() => setNewCategory({ ...newCategory, color })}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Monthly Limit</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={newCategory.monthlyLimit}
                onChangeText={(text) => setNewCategory({ ...newCategory, monthlyLimit: text })}
                placeholder="Optional (e.g., 500)"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  expenseItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  expenseDescription: {
    fontSize: 18,
    fontWeight: '600',
  },
  expenseCategory: {
    fontSize: 14,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
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
  categoryScroll: {
    marginTop: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
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
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDetails: {
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryLimit: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
});