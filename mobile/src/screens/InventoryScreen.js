// src/screens/InventoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Text, Button, ActivityIndicator, Chip, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const InventoryScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { getAuthenticatedAxios } = useAuth();

  const categories = ['All', 'Medicine', 'Vaccine', 'Feed', 'Equipment', 'Supplement', 'Other'];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get('/inventory');
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
  };

  const deleteItem = async (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const api = getAuthenticatedAxios();
              await api.delete(`/inventory/${itemId}`);
              fetchInventory();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'All') return items;
    return items.filter(item => item.category === selectedCategory);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Medicine': return 'pill';
      case 'Vaccine': return 'needle';
      case 'Feed': return 'food-apple';
      case 'Equipment': return 'tools';
      case 'Supplement': return 'bottle-tonic-plus';
      default: return 'package-variant';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Medicine': return '#8b5cf6';
      case 'Vaccine': return '#3b82f6';
      case 'Feed': return '#10b981';
      case 'Equipment': return '#6b7280';
      case 'Supplement': return '#f59e0b';
      default: return '#9ca3af';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  const filteredItems = getFilteredItems();
  const lowStockItems = filteredItems.filter(item => item.quantity <= item.minQuantity);
  const totalValue = filteredItems.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0);

  return (
    
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Inventory</Title>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statValue}>{filteredItems.length}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Low Stock</Text>
            <Text style={[styles.statValue, styles.lowStockValue]}>{lowStockItems.length}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Total Value</Text>
            <Text style={styles.statValue}>${totalValue.toFixed(0)}</Text>
          </Card.Content>
        </Card>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterSection}>
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.chip}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {lowStockItems.length > 0 && selectedCategory === 'All' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="alert-circle" size={24} color="#ef4444" />
              <Text style={styles.sectionTitle}>Low Stock Alert</Text>
            </View>
            {lowStockItems.map((item) => (
              <Card key={item._id} style={[styles.itemCard, styles.lowStockCard]}>
                <Card.Content>
                  <View style={styles.itemHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${getCategoryColor(item.category)}20` }]}>
                      <Icon name={getCategoryIcon(item.category)} size={24} color={getCategoryColor(item.category)} />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                    </View>
                  </View>
                  <View style={styles.itemDetails}>
                    <View style={styles.quantityRow}>
                      <Text style={styles.quantityLabel}>Stock:</Text>
                      <Text style={[styles.quantity, styles.lowStockQuantity]}>
                        {item.quantity} {item.unit}
                      </Text>
                    </View>
                    <Text style={styles.minStock}>Min: {item.minQuantity} {item.unit}</Text>
                  </View>
                  <Button
                    mode="contained"
                    icon="cart-plus"
                    onPress={() => navigation.navigate('SupplierDetails', { itemId: item._id })}
                    style={styles.reorderButton}
                    buttonColor="#ef4444"
                    compact
                  >
                    Reorder Now
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Items' : selectedCategory}
          </Text>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="package-variant-closed" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No items found</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AddInventory')}
                style={styles.emptyButton}
                buttonColor="#16a34a"
              >
                Add Your First Item
              </Button>
            </View>
          ) : (
            filteredItems.map((item) => (
              <Card key={item._id} style={styles.itemCard}>
                <Card.Content>
                  <View style={styles.itemHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${getCategoryColor(item.category)}20` }]}>
                      <Icon name={getCategoryIcon(item.category)} size={24} color={getCategoryColor(item.category)} />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteItem(item._id)}>
                      <Icon name="delete" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.itemDetails}>
                    <View style={styles.detailRow}>
                      <Icon name="package" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {item.quantity} {item.unit}
                      </Text>
                    </View>
                    {item.unitPrice && (
                      <View style={styles.detailRow}>
                        <Icon name="currency-usd" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>
                          ${item.unitPrice} per {item.unit}
                        </Text>
                      </View>
                    )}
                    {item.expiryDate && (
                      <View style={styles.detailRow}>
                        <Icon name="calendar-clock" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>
                          Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    {item.supplier?.name && (
                      <View style={styles.detailRow}>
                        <Icon name="store" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>{item.supplier.name}</Text>
                      </View>
                    )}
                  </View>

                  {item.quantity <= item.minQuantity && (
                    <View style={styles.warningBanner}>
                      <Icon name="alert" size={16} color="#f59e0b" />
                      <Text style={styles.warningText}>Low stock - reorder soon</Text>
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
      

      
    </View>
    
    <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddInventory')}
        color="#fff"
      />
      
    
    
    </ScrollView>
    
    
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
  statsRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 12
  },
  statCard: {
    flex: 1,
    elevation: 2
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  lowStockValue: {
    color: '#ef4444'
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  chip: {
    marginRight: 8
  },
  content: {
    flex: 1
  },
  section: {
    padding: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  itemCard: {
    marginBottom: 12,
    elevation: 2
  },
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444'
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2
  },
  itemCategory: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase'
  },
  itemDetails: {
    gap: 8
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563'
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280'
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  lowStockQuantity: {
    color: '#ef4444'
  },
  minStock: {
    fontSize: 12,
    color: '#6b7280'
  },
  reorderButton: {
    marginTop: 12
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    gap: 6
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600'
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
    marginTop: 16,
    marginBottom: 24
  },
  emptyButton: {
    paddingHorizontal: 24
  },
  fab: {
    position: 'absolute',
    margin: 40,
    right: 0,
    bottom: 0,
    backgroundColor: '#16a34a'
  }
});

export default InventoryScreen;