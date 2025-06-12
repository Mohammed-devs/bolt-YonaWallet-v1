import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  description?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  monthlyLimit?: number;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
}

export interface Debt {
  id: string;
  type: 'borrowed' | 'lent';
  personName: string;
  amount: number;
  dateBorrowed: string;
  dueDate?: string;
  purpose: string;
  status: 'pending' | 'paid' | 'received';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
}

interface DataContextType {
  incomes: Income[];
  expenseCategories: ExpenseCategory[];
  expenses: Expense[];
  debts: Debt[];
  savingsGoals: SavingsGoal[];
  addIncome: (income: Omit<Income, 'id'>) => void;
  addExpenseCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
  updateExpenseCategory: (id: string, category: Partial<ExpenseCategory>) => void;
  deleteExpenseCategory: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultCategories: ExpenseCategory[] = [
  { id: '1', name: 'Food & Dining', color: '#EF4444', monthlyLimit: 500 },
  { id: '2', name: 'Transportation', color: '#3B82F6', monthlyLimit: 300 },
  { id: '3', name: 'Utilities', color: '#10B981', monthlyLimit: 200 },
  { id: '4', name: 'Entertainment', color: '#8B5CF6', monthlyLimit: 200 },
  { id: '5', name: 'Healthcare', color: '#06B6D4', monthlyLimit: 150 },
  { id: '6', name: 'Shopping', color: '#F59E0B', monthlyLimit: 300 },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(defaultCategories);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [incomesData, categoriesData, expensesData, debtsData, goalsData] = await Promise.all([
          AsyncStorage.getItem('incomes'),
          AsyncStorage.getItem('expenseCategories'),
          AsyncStorage.getItem('expenses'),
          AsyncStorage.getItem('debts'),
          AsyncStorage.getItem('savingsGoals'),
        ]);

        if (incomesData) setIncomes(JSON.parse(incomesData));
        if (categoriesData) setExpenseCategories(JSON.parse(categoriesData));
        if (expensesData) setExpenses(JSON.parse(expensesData));
        if (debtsData) setDebts(JSON.parse(debtsData));
        if (goalsData) setSavingsGoals(JSON.parse(goalsData));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = { ...income, id: Date.now().toString() };
    const updatedIncomes = [...incomes, newIncome];
    setIncomes(updatedIncomes);
    saveData('incomes', updatedIncomes);
  };

  const addExpenseCategory = (category: Omit<ExpenseCategory, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    const updatedCategories = [...expenseCategories, newCategory];
    setExpenseCategories(updatedCategories);
    saveData('expenseCategories', updatedCategories);
  };

  const updateExpenseCategory = (id: string, category: Partial<ExpenseCategory>) => {
    const updatedCategories = expenseCategories.map(cat => 
      cat.id === id ? { ...cat, ...category } : cat
    );
    setExpenseCategories(updatedCategories);
    saveData('expenseCategories', updatedCategories);
  };

  const deleteExpenseCategory = (id: string) => {
    const updatedCategories = expenseCategories.filter(cat => cat.id !== id);
    setExpenseCategories(updatedCategories);
    saveData('expenseCategories', updatedCategories);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveData('expenses', updatedExpenses);
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    const updatedExpenses = expenses.map(exp => 
      exp.id === id ? { ...exp, ...expense } : exp
    );
    setExpenses(updatedExpenses);
    saveData('expenses', updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    saveData('expenses', updatedExpenses);
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt = { ...debt, id: Date.now().toString() };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    saveData('debts', updatedDebts);
  };

  const updateDebt = (id: string, debt: Partial<Debt>) => {
    const updatedDebts = debts.map(d => 
      d.id === id ? { ...d, ...debt } : d
    );
    setDebts(updatedDebts);
    saveData('debts', updatedDebts);
  };

  const deleteDebt = (id: string) => {
    const updatedDebts = debts.filter(d => d.id !== id);
    setDebts(updatedDebts);
    saveData('debts', updatedDebts);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
    saveData('savingsGoals', updatedGoals);
  };

  const updateSavingsGoal = (id: string, goal: Partial<SavingsGoal>) => {
    const updatedGoals = savingsGoals.map(g => 
      g.id === id ? { ...g, ...goal } : g
    );
    setSavingsGoals(updatedGoals);
    saveData('savingsGoals', updatedGoals);
  };

  const deleteSavingsGoal = (id: string) => {
    const updatedGoals = savingsGoals.filter(g => g.id !== id);
    setSavingsGoals(updatedGoals);
    saveData('savingsGoals', updatedGoals);
  };

  return (
    <DataContext.Provider value={{
      incomes,
      expenseCategories,
      expenses,
      debts,
      savingsGoals,
      addIncome,
      addExpenseCategory,
      updateExpenseCategory,
      deleteExpenseCategory,
      addExpense,
      updateExpense,
      deleteExpense,
      addDebt,
      updateDebt,
      deleteDebt,
      addSavingsGoal,
      updateSavingsGoal,
      deleteSavingsGoal,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}