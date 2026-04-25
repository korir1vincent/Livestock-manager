import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Button, ActivityIndicator, SegmentedButtons, FAB } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const FinancialScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState('summary');
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const api = getAuthenticatedAxios();
      const [expensesRes, revenuesRes, summaryRes] = await Promise.all([
        api.get('/financial/expenses'),
        api.get('/financial/revenues'),
        api.get('/financial/summary')
      ]);

      setExpenses(expensesRes.data.expenses);
      setRevenues(revenuesRes.data.revenues);
      setSummary(summaryRes.data.summary);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFinancialData();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Feed: 'food-apple',
      Veterinary: 'stethoscope',
      Medicine: 'pill',
      Equipment: 'tools',
      Labor: 'account-hard-hat',
      Sale: 'cash-multiple',
      Milk: 'cup',
      Breeding: 'baby-carriage',
      Other: 'currency-usd'
    };
    return icons[category] || 'currency-usd';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Feed: '#10b981',
      Veterinary: '#3b82f6',
      Medicine: '#8b5cf6',
      Equipment: '#6b7280',
      Labor: '#f59e0b',
      Sale: '#10b981',
      Milk: '#3b82f6',
      Breeding: '#ec4899',
      Other: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Financial Tracking</Title>
      </View>

      <SegmentedButtons
        value={view}
        onValueChange={setView}
        buttons={[
          { value: 'summary', label: 'Summary' },
          { value: 'expenses', label: 'Expenses' },
          { value: 'revenues', label: 'Revenues' }
        ]}
        style={styles.segmentedButtons}
      />
      

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {view === 'summary' && summary && (
          <View>
            <View style={styles.statsGrid}>
              <Card style={[styles.statCard, styles.expenseCard]}>
                <Card.Content>
                  <Icon name="arrow-down" size={24} color="#ef4444" />
                  <Text style={styles.statLabel}>Total Expenses</Text>
                  <Text style={[styles.statValue, styles.expenseValue]}>
                    KES {summary.totalExpenses.toFixed(2)}
                  </Text>
                </Card.Content>
              </Card>

              <Card style={[styles.statCard, styles.revenueCard]}>
                <Card.Content>
                  <Icon name="arrow-up" size={24} color="#10b981" />
                  <Text style={styles.statLabel}>Total Revenue</Text>
                  <Text style={[styles.statValue, styles.revenueValue]}>
                    KES {summary.totalRevenue.toFixed(2)}
                  </Text>
                </Card.Content>
              </Card>

              <Card style={[styles.statCard, styles.profitCard]}>
                <Card.Content>
                  <Icon name="chart-line" size={24} color="#3b82f6" />
                  <Text style={styles.statLabel}>Net Profit</Text>
                  <Text style={[
                    styles.statValue,
                    summary.netProfit >= 0 ? styles.profitPositive : styles.profitNegative
                  ]}>
                    KES {summary.netProfit.toFixed(2)}
                  </Text>
                </Card.Content>
              </Card>
            </View>

            <Card style={styles.card}>
              <Card.Content>
                <Title>Expense Breakdown</Title>
                <View style={styles.breakdownList}>
                  {Object.entries(summary.expensesByCategory).map(([category, amount]) => {
                    const percentage = (amount / summary.totalExpenses * 100).toFixed(1);
                    return (
                      <View key={category} style={styles.breakdownItem}>
                        <View style={styles.breakdownHeader}>
                          <View style={styles.categoryLabel}>
                            <Icon name={getCategoryIcon(category)} size={20} color={getCategoryColor(category)} />
                            <Text style={styles.categoryName}>{category}</Text>
                          </View>
                          <Text style={styles.categoryAmount}>KES {amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${percentage}%`,
                                backgroundColor: getCategoryColor(category)
                              }
                            ]}
                          />
                        </View>
                        <Text style={styles.percentageText}>{percentage}%</Text>
                      </View>
                    );
                  })}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title>Transaction Summary</Title>
                <View style={styles.transactionSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Expenses Transactions:</Text>
                    <Text style={styles.summaryValue}>{summary.transactionCount.expenses}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Revenue Transactions:</Text>
                    <Text style={styles.summaryValue}>{summary.transactionCount.revenues}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}

        {view === 'expenses' && (
          <View style={styles.transactionsList}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Recent Expenses</Text>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => navigation.navigate('AddExpense')}
                compact
                buttonColor="#16a34a"
              >
                Add
              </Button>
            </View>

            {expenses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="receipt" size={64} color="#d1d5db" />
                <Text style={styles.emptyText}>No expenses recorded</Text>
              </View>
            ) : (
              expenses.map((expense) => (
                <Card key={expense._id} style={styles.transactionCard}>
                  <Card.Content>
                    <View style={styles.transactionHeader}>
                      <View style={[styles.transactionIcon, { backgroundColor: `${getCategoryColor(expense.category)}20` }]}>
                        <Icon name={getCategoryIcon(expense.category)} size={24} color={getCategoryColor(expense.category)} />
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionCategory}>{expense.category}</Text>
                        <Text style={styles.transactionDescription}>{expense.description}</Text>
                        <Text style={styles.transactionDate}>
                          {new Date(expense.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={[styles.transactionAmount, styles.expenseAmount]}>
                        -KES {expense.amount.toFixed(2)}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        )}

        {view === 'revenues' && (
          <View style={styles.transactionsList}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Recent Revenues</Text>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => navigation.navigate('AddRevenue')}
                compact
                buttonColor="#10b981"
              >
                Add
              </Button>
            </View>

            {revenues.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="cash-multiple" size={64} color="#d1d5db" />
                <Text style={styles.emptyText}>No revenues recorded</Text>
              </View>
            ) : (
              revenues.map((revenue) => (
                <Card key={revenue._id} style={styles.transactionCard}>
                  <Card.Content>
                    <View style={styles.transactionHeader}>
                      <View style={[styles.transactionIcon, { backgroundColor: `${getCategoryColor(revenue.category)}20` }]}>
                        <Icon name={getCategoryIcon(revenue.category)} size={24} color={getCategoryColor(revenue.category)} />
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionCategory}>{revenue.category}</Text>
                        <Text style={styles.transactionDescription}>{revenue.description}</Text>
                        <Text style={styles.transactionDate}>
                          {new Date(revenue.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={[styles.transactionAmount, styles.revenueAmount]}>
                        +KES{revenue.amount.toFixed(2)}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        )}
      </ScrollView>
      
      <SafeAreaView>
        <FAB
        icon="file-chart"
        style={styles.fab}
        onPress={() => {
          // Generate report functionality
          alert('Report generation feature coming soon!');
        }}
        label="Report"
        color="#fff"
      />
      </SafeAreaView>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  segmentedButtons: {
    margin: 16
  },
  content: {
    flex: 1
  },
  statsGrid: {
    padding: 12,
    gap: 12
  },
  statCard: {
    elevation: 3,
    marginBottom: 8
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444'
  },
  revenueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981'
  },
  profitCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  expenseValue: {
    color: '#ef4444'
  },
  revenueValue: {
    color: '#10b981'
  },
  profitPositive: {
    color: '#10b981'
  },
  profitNegative: {
    color: '#ef4444'
  },
  card: {
    margin: 12,
    elevation: 2
  },
  breakdownList: {
    marginTop: 16
  },
  breakdownItem: {
    marginBottom: 20
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4
  },
  progressFill: {
    height: '100%',
    borderRadius: 4
  },
  percentageText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right'
  },
  transactionSummary: {
    marginTop: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937'
  },
  transactionsList: {
    padding: 12
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  transactionCard: {
    marginBottom: 12,
    elevation: 2
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  transactionInfo: {
    flex: 1
  },
  transactionCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 2
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280'
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  expenseAmount: {
    color: '#ef4444'
  },
  revenueAmount: {
    color: '#10b981'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    marginTop: 48
  },
  emptyText: {
    fontSize: 18,
    color: '#9ca3af',
    marginTop: 16
  },
  fab: {
    position: 'absolute',
    margin: 25,
    right: 0,
    bottom: 10,
    backgroundColor: '#3b82f6'
  }
});

export default FinancialScreen;