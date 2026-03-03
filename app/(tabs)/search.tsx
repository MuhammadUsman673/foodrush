import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import { router } from 'expo-router';

const allItems = [
  { id: '1', name: 'Pizza Palace', type: 'restaurant', emoji: '🍕', desc: 'Italian • Pizza', rating: '4.8' },
  { id: '2', name: 'Burger Barn', type: 'restaurant', emoji: '🍔', desc: 'American • Burgers', rating: '4.6' },
  { id: '3', name: 'Sushi Star', type: 'restaurant', emoji: '🍱', desc: 'Japanese • Sushi', rating: '4.9' },
  { id: '4', name: 'Taco Town', type: 'restaurant', emoji: '🌮', desc: 'Mexican • Tacos', rating: '4.7' },
  { id: '5', name: 'Margherita Pizza', type: 'food', emoji: '🍕', desc: 'Pizza Palace • $12.99', rating: '4.8' },
  { id: '6', name: 'Cheese Burger', type: 'food', emoji: '🍔', desc: 'Burger Barn • $11.99', rating: '4.6' },
  { id: '7', name: 'Salmon Roll', type: 'food', emoji: '🍣', desc: 'Sushi Star • $13.99', rating: '4.9' },
  { id: '8', name: 'Beef Tacos', type: 'food', emoji: '🌮', desc: 'Taco Town • $9.99', rating: '4.7' },
  { id: '9', name: 'Garlic Bread', type: 'food', emoji: '🥖', desc: 'Pizza Palace • $4.99', rating: '4.5' },
  { id: '10', name: 'Milkshake', type: 'food', emoji: '🥤', desc: 'Burger Barn • $5.99', rating: '4.4' },
];

const popular = ['Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Dessert'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Restaurants', 'Food'];

  const results = allItems.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Restaurants' && item.type === 'restaurant') ||
      (activeFilter === 'Food' && item.type === 'food');
    return matchesQuery && matchesFilter;
  });

  return (
    <View style={styles.container}>

      {/* Header */}
      <Text style={styles.title}>Search 🔍</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food or restaurant..."
          placeholderTextColor="#555"
          value={query}
          onChangeText={setQuery}
          autoFocus={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}>
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular searches when no query */}
        {query.length === 0 && (
          <View style={styles.popularContainer}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.tagsRow}>
              {popular.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  onPress={() => setQuery(tag)}>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>All Restaurants</Text>
            {allItems
              .filter((i) => i.type === 'restaurant')
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultItem}
                  onPress={() => router.push(`/restaurant/${item.id}` as any)}>
                  <View style={styles.resultEmoji}>
                    <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultDesc}>{item.desc}</Text>
                  </View>
                  <Text style={styles.resultRating}>⭐ {item.rating}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        {/* Search Results */}
        {query.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>
              {results.length} results for "{query}"
            </Text>
            {results.length === 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsEmoji}>😕</Text>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>Try searching something else</Text>
              </View>
            ) : (
              results.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultItem}
                  onPress={() =>
                    item.type === 'restaurant'
                      ? router.push(`/restaurant/${item.id}` as any)
                      : null
                  }>
                  <View style={styles.resultEmoji}>
                    <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultDesc}>{item.desc}</Text>
                  </View>
                  <View style={styles.resultRight}>
                    <Text style={styles.resultType}>
                      {item.type === 'restaurant' ? '🏪' : '🍽️'}
                    </Text>
                    <Text style={styles.resultRating}>⭐ {item.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E2E',
    borderWidth: 1,
    borderColor: '#2E2E3E',
  },
  filterBtnActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  filterText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  popularContainer: {
    marginBottom: 20,
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
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E2E3E',
  },
  tagText: {
    color: '#aaa',
    fontSize: 14,
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  resultEmoji: {
    width: 52,
    height: 52,
    backgroundColor: '#2E2E3E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultDesc: {
    color: '#888',
    fontSize: 13,
  },
  resultRight: {
    alignItems: 'center',
    gap: 4,
  },
  resultType: {
    fontSize: 18,
  },
  resultRating: {
    color: '#aaa',
    fontSize: 13,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultsSubtext: {
    color: '#888',
    fontSize: 14,
  },
});