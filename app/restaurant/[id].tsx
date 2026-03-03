import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '../../store';

const restaurantData: Record<string, any> = {
  '1': {
    name: 'Pizza Palace',
    cuisine: 'Italian • Pizza',
    rating: '4.8',
    time: '20-30 min',
    emoji: '🍕',
    color: '#FF6584',
    menu: [
      { id: 'r1m1', name: 'Margherita Pizza', desc: 'Classic tomato & mozzarella', price: 12.99, emoji: '🍕' },
      { id: 'r1m2', name: 'Pepperoni Pizza', desc: 'Loaded with pepperoni', price: 14.99, emoji: '🍕' },
      { id: 'r1m3', name: 'BBQ Chicken Pizza', desc: 'Smoky BBQ with chicken', price: 15.99, emoji: '🍕' },
      { id: 'r1m4', name: 'Garlic Bread', desc: 'Crispy with garlic butter', price: 4.99, emoji: '🥖' },
      { id: 'r1m5', name: 'Caesar Salad', desc: 'Fresh romaine with dressing', price: 7.99, emoji: '🥗' },
    ],
  },
  '2': {
    name: 'Burger Barn',
    cuisine: 'American • Burgers',
    rating: '4.6',
    time: '15-25 min',
    emoji: '🍔',
    color: '#6C63FF',
    menu: [
      { id: 'r2m1', name: 'Classic Burger', desc: 'Beef patty with lettuce & tomato', price: 9.99, emoji: '🍔' },
      { id: 'r2m2', name: 'Cheese Burger', desc: 'Double cheese smash burger', price: 11.99, emoji: '🍔' },
      { id: 'r2m3', name: 'Crispy Chicken', desc: 'Fried chicken fillet burger', price: 10.99, emoji: '🍗' },
      { id: 'r2m4', name: 'Fries', desc: 'Golden crispy fries', price: 3.99, emoji: '🍟' },
      { id: 'r2m5', name: 'Milkshake', desc: 'Chocolate or vanilla', price: 5.99, emoji: '🥤' },
    ],
  },
  '3': {
    name: 'Sushi Star',
    cuisine: 'Japanese • Sushi',
    rating: '4.9',
    time: '25-35 min',
    emoji: '🍱',
    color: '#43C6AC',
    menu: [
      { id: 'r3m1', name: 'Salmon Roll', desc: '8 pieces of fresh salmon', price: 13.99, emoji: '🍣' },
      { id: 'r3m2', name: 'Tuna Sashimi', desc: '6 slices of premium tuna', price: 15.99, emoji: '🍣' },
      { id: 'r3m3', name: 'Dragon Roll', desc: 'Avocado topped shrimp roll', price: 16.99, emoji: '🍱' },
      { id: 'r3m4', name: 'Miso Soup', desc: 'Traditional Japanese soup', price: 3.99, emoji: '🍜' },
      { id: 'r3m5', name: 'Edamame', desc: 'Steamed salted soybeans', price: 4.99, emoji: '🫘' },
    ],
  },
  '4': {
    name: 'Taco Town',
    cuisine: 'Mexican • Tacos',
    rating: '4.7',
    time: '10-20 min',
    emoji: '🌮',
    color: '#FFB347',
    menu: [
      { id: 'r4m1', name: 'Beef Tacos', desc: '3 tacos with seasoned beef', price: 9.99, emoji: '🌮' },
      { id: 'r4m2', name: 'Chicken Burrito', desc: 'Grilled chicken with rice & beans', price: 11.99, emoji: '🌯' },
      { id: 'r4m3', name: 'Nachos', desc: 'Loaded with cheese & jalapeños', price: 8.99, emoji: '🧀' },
      { id: 'r4m4', name: 'Guacamole', desc: 'Fresh homemade guac with chips', price: 5.99, emoji: '🥑' },
      { id: 'r4m5', name: 'Churros', desc: 'Crispy with cinnamon sugar', price: 4.99, emoji: '🍩' },
    ],
  },
};

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const restaurant = restaurantData[id as string];
  const { addItem, totalItems } = useCart();

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: restaurant.color + '33' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>{restaurant.emoji}</Text>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⭐ {restaurant.rating}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>🕐 {restaurant.time}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>🛵 Free delivery</Text>
        </View>
        {totalItems > 0 && (
          <TouchableOpacity
            style={styles.cartBadge}
            onPress={() => router.push('/(tabs)/cart' as any)}>
            <Text style={styles.cartBadgeText}>🛒 {totalItems} items — View Cart</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Menu</Text>
        {restaurant.menu.map((item: any) => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemDesc}>{item.desc}</Text>
              <Text style={styles.menuItemPrice}>${item.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                emoji: item.emoji,
                restaurantName: restaurant.name,
              })}>
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { padding: 24, paddingTop: 60, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerEmoji: { fontSize: 64, marginBottom: 12 },
  restaurantName: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  cuisine: { fontSize: 15, color: '#aaa', marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { color: '#aaa', fontSize: 14 },
  metaDot: { color: '#555' },
  cartBadge: { marginTop: 16, backgroundColor: '#6C63FF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  cartBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  menuContainer: { padding: 20 },
  menuTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  menuItem: { backgroundColor: '#1E1E2E', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  menuItemLeft: { width: 56, height: 56, backgroundColor: '#2E2E3E', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuEmoji: { fontSize: 28 },
  menuItemInfo: { flex: 1 },
  menuItemName: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 3 },
  menuItemDesc: { color: '#888', fontSize: 12, marginBottom: 6 },
  menuItemPrice: { color: '#6C63FF', fontSize: 15, fontWeight: 'bold' },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: 'bold', lineHeight: 26 },
});