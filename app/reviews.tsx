import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function ReviewsScreen() {
  const { restaurantId, restaurantName } = useLocalSearchParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles(name, email)')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      setReviews(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        restaurant_id: restaurantId,
        rating,
        comment,
      });

      if (error) throw error;

      setAdding(false);
      setRating(0);
      setComment('');
      loadReviews();
      Alert.alert('Thanks! ⭐', 'Your review has been submitted!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return '0.0';
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reviews ⭐</Text>
        <Text style={styles.subtitle}>{restaurantName}</Text>
      </View>

      {/* Average Rating */}
      <View style={styles.avgContainer}>
        <Text style={styles.avgNumber}>{getAverageRating()}</Text>
        <Text style={styles.avgStars}>
          {'⭐'.repeat(Math.round(parseFloat(getAverageRating())))}
        </Text>
        <Text style={styles.avgCount}>{reviews.length} reviews</Text>
      </View>

      {/* Add Review Button */}
      {!adding && (
        <TouchableOpacity style={styles.addBtn} onPress={() => setAdding(true)}>
          <Text style={styles.addBtnText}>+ Write a Review</Text>
        </TouchableOpacity>
      )}

      {/* Add Review Form */}
      {adding && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Your Review</Text>

          {/* Star Rating */}
          <Text style={styles.inputLabel}>Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}>
                <Text style={[styles.star, rating >= star && styles.starActive]}>
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Comment (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Share your experience..."
            placeholderTextColor="#555"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />

          <View style={styles.formBtns}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setAdding(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Submit ⭐</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Reviews List */}
      <Text style={styles.sectionTitle}>All Reviews</Text>
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={styles.emptyTitle}>No reviews yet</Text>
          <Text style={styles.emptySubtitle}>Be the first to review!</Text>
        </View>
      ) : (
        reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>
                  {review.profiles?.name
                    ? review.profiles.name.charAt(0).toUpperCase()
                    : review.profiles?.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewName}>
                  {review.profiles?.name || review.profiles?.email?.split('@')[0]}
                </Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </Text>
              </View>
              <Text style={styles.reviewRating}>
                {'⭐'.repeat(review.rating)}
              </Text>
            </View>
            {review.comment ? (
              <Text style={styles.reviewComment}>{review.comment}</Text>
            ) : null}
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingHorizontal: 20, paddingTop: 60 },
  loadingContainer: { flex: 1, backgroundColor: '#0F0F1A', alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: 24 },
  backBtn: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitle: { color: '#888', fontSize: 15, marginTop: 4 },
  avgContainer: { backgroundColor: '#1E1E2E', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 },
  avgNumber: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  avgStars: { fontSize: 24, marginBottom: 8 },
  avgCount: { color: '#888', fontSize: 14 },
  addBtn: { backgroundColor: '#6C63FF', padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 20 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  form: { backgroundColor: '#1E1E2E', borderRadius: 16, padding: 20, marginBottom: 20 },
  formTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  inputLabel: { color: '#aaa', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  star: { fontSize: 32, opacity: 0.3 },
  starActive: { opacity: 1 },
  input: { backgroundColor: '#0F0F1A', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2E2E3E', marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  formBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#2E2E3E', padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  emptyContainer: { alignItems: 'center', paddingTop: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#888', fontSize: 14 },
  reviewCard: { backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  reviewAvatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  reviewInfo: { flex: 1 },
  reviewName: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  reviewDate: { color: '#555', fontSize: 12 },
  reviewRating: { fontSize: 14 },
  reviewComment: { color: '#aaa', fontSize: 14, lineHeight: 20 },
});