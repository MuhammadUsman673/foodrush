import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '../../store';
import { supabase } from '../../lib/supabase';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const { addItem, totalItems } = useCart();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurant();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const { data: restaurantData } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      setRestaurant(restaurantData);

      const { data: menuData } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id);

      setMenu(menuData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.loadingContainer}>
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
        <TouchableOpacity
          style={styles.reviewsBtn}
          onPress={() => router.push({
            pathname: '/reviews',
            params: { restaurantId: id, restaurantName: restaurant.name }
          } as any)}>
          <Text style={styles.reviewsBtnText}>⭐ See Reviews</Text>
        </TouchableOpacity>
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
        {menu.map((item: any) => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemDesc}>{item.description}</Text>
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
  loadingContainer: { flex: 1, backgroundColor: '#0F0F1A', alignItems: 'center', justifyContent: 'center' },
  header: { padding: 24, paddingTop: 60, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerEmoji: { fontSize: 64, marginBottom: 12 },
  restaurantName: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  cuisine: { fontSize: 15, color: '#aaa', marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { color: '#aaa', fontSize: 14 },
  metaDot: { color: '#555' },
  reviewsBtn: { marginTop: 12, backgroundColor: '#1E1E2E', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  reviewsBtnText: { color: '#aaa', fontSize: 14, fontWeight: '600' },
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