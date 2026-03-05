import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  ScrollView, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const popularSearches = ['Pizza', 'Burger', 'Sushi', 'Tacos', 'Chicken', 'Dessert'];

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setRestaurants([]);
      setMenuItems([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Search restaurants
      const { data: restaurantData } = await supabase
        .from('restaurants')
        .select('*')
        .ilike('name', `%${text}%`);

      // Search menu items
      const { data: menuData } = await supabase
        .from('menu_items')
        .select('*, restaurants(id, name, emoji, color)')
        .ilike('name', `%${text}%`);

      setRestaurants(restaurantData || []);
      setMenuItems(menuData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalResults = restaurants.length + menuItems.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search 🔍</Text>
        <Text style={styles.subtitle}>Find food or restaurants</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food or restaurant..."
          placeholderTextColor="#555"
          value={query}
          onChangeText={handleSearch}
          autoFocus={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => {
            setQuery('');
            setRestaurants([]);
            setMenuItems([]);
            setSearched(false);
          }}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular Searches */}
        {!searched && (
          <>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.tagsRow}>
              {popularSearches.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  onPress={() => handleSearch(tag)}>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Loading */}
        {loading && (
          <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} />
        )}

        {/* No Results */}
        {searched && !loading && totalResults === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>Try searching for something else</Text>
          </View>
        )}

        {/* Results Count */}
        {searched && !loading && totalResults > 0 && (
          <Text style={styles.resultsCount}>{totalResults} results for "{query}"</Text>
        )}

        {/* Restaurant Results */}
        {restaurants.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Restaurants</Text>
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
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>⭐ {r.rating}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>🕐 {r.time}</Text>
                  </View>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Menu Item Results */}
        {menuItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Menu Items</Text>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                onPress={() => router.push(`/restaurant/${item.restaurants?.id}` as any)}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemRestaurant}>
                    {item.restaurants?.emoji} {item.restaurants?.name}
                  </Text>
                  <Text style={styles.menuItemPrice}>${item.price}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
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
  clearBtn: {
    color: '#555',
    fontSize: 16,
    padding: 4,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#1E1E2E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E2E3E',
  },
  tagText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 15,
  },
  resultsCount: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
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
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  restaurantEmoji: {
    fontSize: 28,
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
  metaRow: {
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
  menuCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemLeft: {
    width: 56,
    height: 56,
    backgroundColor: '#2E2E3E',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuEmoji: {
    fontSize: 28,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuItemRestaurant: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
  },
  menuItemPrice: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});