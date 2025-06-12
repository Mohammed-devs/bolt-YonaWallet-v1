import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, CreditCard, PiggyBank, DollarSign } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { incomes, expenses, expenseCategories, debts, savingsGoals } = useData();

  // Calculate totals
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBorrowed = debts.filter(d => d.type === 'borrowed' && d.status === 'pending').reduce((sum, debt) => sum + debt.amount, 0);
  const totalLent = debts.filter(d => d.type === 'lent' && d.status === 'pending').reduce((sum, debt) => sum + debt.amount, 0);
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const balance = totalIncome - totalExpenses;

  const styles = createStyles(theme);

  const StatCard = ({ icon: Icon, title, amount, color, subtitle }: any) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statHeader}>
        <Icon size={24} color={color} />
        <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.statAmount, { color: theme.colors.text }]}>
        ${amount.toLocaleString()}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Dashboard</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your financial overview
          </Text>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
          <Text style={styles.balanceSubtext}>
            Income: ${totalIncome.toLocaleString()} • Expenses: ${totalExpenses.toLocaleString()}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={TrendingUp}
            title="Income"
            amount={totalIncome}
            color={theme.colors.success}
            subtitle={`${incomes.length} entries`}
          />
          <StatCard
            icon={TrendingDown}
            title="Expenses"
            amount={totalExpenses}
            color={theme.colors.error}
            subtitle={`${expenses.length} transactions`}
          />
          <StatCard
            icon={PiggyBank}
            title="Savings"
            amount={totalSavings}
            color={theme.colors.secondary}
            subtitle={`${savingsGoals.length} goals`}
          />
          <StatCard
            icon={CreditCard}
            title="Net Debt"
            amount={totalBorrowed - totalLent}
            color={theme.colors.warning}
            subtitle={`${debts.length} records`}
          />
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Activity
          </Text>
          
          {/* Recent Expenses */}
          {expenses.slice(-3).reverse().map((expense) => {
            const category = expenseCategories.find(cat => cat.id === expense.categoryId);
            return (
              <View key={expense.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: category?.color + '20' }]}>
                  <TrendingDown size={16} color={category?.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
                    {expense.description}
                  </Text>
                  <Text style={[styles.activitySubtitle, { color: theme.colors.textSecondary }]}>
                    {category?.name} • {new Date(expense.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.activityAmount, { color: theme.colors.error }]}>
                  -${expense.amount.toLocaleString()}
                </Text>
              </View>
            );
          })}

          {expenses.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No recent transactions
              </Text>
            </View>
          )}
        </View>

        {/* Savings Progress */}
        {savingsGoals.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Savings Progress
            </Text>
            
            {savingsGoals.slice(0, 3).map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <View key={goal.id} style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressTitle, { color: theme.colors.text }]}>
                      {goal.name}
                    </Text>
                    <Text style={[styles.progressAmount, { color: theme.colors.textSecondary }]}>
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { backgroundColor: goal.color, width: `${Math.min(progress, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.progressPercent, { color: theme.colors.textSecondary }]}>
                    {progress.toFixed(1)}% complete
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    margin: 8,
    padding: 16,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  statAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressAmount: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    textAlign: 'right',
  },
});