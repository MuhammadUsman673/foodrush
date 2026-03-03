import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categories = [
  { id: '1', name: 'Pizza', emoji: '🍕' },
  { id: '2', name: 'Burger', emoji: '🍔' },
  { id: '3', name: 'Sushi', emoji: '🍱' },
  { id: '4', name: 'Tacos', emoji: '🌮' },
  { id: '5', name: 'Pasta', emoji: '🍝' },
  { id: '6', name: 'Dessert', emoji: '🍰' },
];

const restaurants = [
  {
    id: '1',
    name: 'Pizza Palace',
    cuisine: 'Italian • Pizza',
    rating: '4.8',
    time: '20-30 min',
    emoji: '🍕',
    color: '#FF6584',
  },
  {
    id: '2',
    name: 'Burger Barn',
    cuisine: 'American • Burgers',
    rating: '4.6',
    time: '15-25 min',
    emoji: '🍔',
    color: '#6C63FF',
  },
  {
    id: '3',
    name: 'Sushi Star',
    cuisine: 'Japanese • Sushi',
    rating: '4.9',
    time: '25-35 min',
    emoji: '🍱',
    color: '#43C6AC',
  },
  {
    id: '4',
    name: 'Taco Town',
    cuisine: 'Mexican • Tacos',
    rating: '4.7',
    time: '10-20 min',
    emoji: '🌮',
    color: '#FFB347',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 16 }}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.name}>What are you craving?</Text>
        </View>
        <TouchableOpacity style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food or restaurant..."
          placeholderTextColor="#555"
        />
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>Free Delivery 🎉</Text>
          <Text style={styles.bannerSubtitle}>On your first order!</Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Order Now</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bannerEmoji}>🍕</Text>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text style={styles.categoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Restaurants */}
      <Text style={styles.sectionTitle}>Popular Restaurants</Text>
      {restaurants.map((r) => (
        <TouchableOpacity
          key={r.id}
          style={styles.restaurantCard}
          onPress={() => router.push(`/restaurant/${r.id}` as any)}>
          <View style={[styles.restaurantImage, { backgroundColor: r.color + '33' }]}>
            <Text style={styles.restaurantEmoji}>{r.emoji}</Text>
          </View>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{r.name}</Text>
            <Text style={styles.restaurantCuisine}>{r.cuisine}</Text>
            <View style={styles.restaurantMeta}>
              <Text style={styles.metaText}>⭐ {r.rating}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>🕐 {r.time}</Text>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: '#888',
    fontSize: 16,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2E2E3E',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
  },
  banner: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#ffffffaa',
    fontSize: 14,
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bannerEmoji: {
    fontSize: 64,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesRow: {
    marginBottom: 28,
  },
  categoryCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 80,
  },
  categoryEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  categoryName: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
  },
  restaurantCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  restaurantEmoji: {
    fontSize: 30,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantCuisine: {
    color: '#888',
    fontSize: 13,
    marginBottom: 6,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#aaa',
    fontSize: 13,
  },
  metaDot: {
    color: '#555',
  },
  arrow: {
    color: '#555',
    fontSize: 24,
  },
});