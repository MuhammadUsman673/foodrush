import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { useCart } from '../../store';

export default function CartScreen() {
  const { items, addItem, removeItem, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add items from a restaurant to get started</Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => router.push('/(tabs)/home' as any)}>
          <Text style={styles.browseBtnText}>Browse Restaurants</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart 🛒</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.restaurantLabel}>📍 {items[0].restaurantName}</Text>

        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
            <View style={styles.quantityRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => removeItem(item.id)}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => addItem({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  emoji: item.emoji,
                  restaurantName: item.restaurantName,
                })}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={[styles.summaryValue, { color: '#43C6AC' }]}>FREE</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push('/tracking' as any)}>
          <Text style={styles.checkoutText}>Place Order • ${totalPrice.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingHorizontal: 20, paddingTop: 60 },
  emptyContainer: { flex: 1, backgroundColor: '#0F0F1A', alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#888', fontSize: 15, textAlign: 'center', marginBottom: 32 },
  browseBtn: { backgroundColor: '#6C63FF', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 },
  browseBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  clearText: { color: '#FF6584', fontSize: 15 },
  restaurantLabel: { color: '#888', fontSize: 14, marginBottom: 16 },
  cartItem: { backgroundColor: '#1E1E2E', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemEmoji: { fontSize: 32, marginRight: 14 },
  itemInfo: { flex: 1 },
  itemName: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  itemPrice: { color: '#6C63FF', fontSize: 14, fontWeight: '600' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2E2E3E', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  qtyText: { color: '#fff', fontSize: 16, fontWeight: 'bold', minWidth: 20, textAlign: 'center' },
  summary: { backgroundColor: '#1E1E2E', borderRadius: 16, padding: 20, marginTop: 8 },
  summaryTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: '#888', fontSize: 15 },
  summaryValue: { color: '#fff', fontSize: 15, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#2E2E3E', paddingTop: 12, marginTop: 4 },
  totalLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  totalValue: { color: '#6C63FF', fontSize: 18, fontWeight: 'bold' },
  checkoutContainer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  checkoutBtn: { backgroundColor: '#6C63FF', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});