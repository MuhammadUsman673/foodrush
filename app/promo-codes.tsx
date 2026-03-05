import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function PromoCodesScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [availableCodes, setAvailableCodes] = useState<any[]>([]);

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('active', true);
    setAvailableCodes(data || []);
  };

  const handleApply = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        Alert.alert('Invalid Code', 'This promo code is not valid or has expired');
        return;
      }

      setAppliedPromo(data);
      Alert.alert(
        'Code Applied! 🎉',
        `${data.description}`,
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Promo Codes 🎁</Text>
      </View>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter promo code"
          placeholderTextColor="#555"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={[styles.applyBtn, loading && { opacity: 0.7 }]}
          onPress={handleApply}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.applyBtnText}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Applied Promo */}
      {appliedPromo && (
        <View style={styles.appliedBox}>
          <Text style={styles.appliedEmoji}>✅</Text>
          <View style={styles.appliedInfo}>
            <Text style={styles.appliedCode}>{appliedPromo.code}</Text>
            <Text style={styles.appliedDesc}>{appliedPromo.description}</Text>
          </View>
          <TouchableOpacity onPress={() => { setAppliedPromo(null); setCode(''); }}>
            <Text style={styles.removeBtn}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Available Codes */}
      <Text style={styles.sectionTitle}>Available Offers 🎉</Text>
      {availableCodes.map((promo) => (
        <TouchableOpacity
          key={promo.id}
          style={styles.promoCard}
          onPress={() => setCode(promo.code)}>
          <View style={styles.promoLeft}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {promo.discount_type === 'percentage'
                  ? `${promo.discount}% OFF`
                  : `PKR ${promo.discount} OFF`}
              </Text>
            </View>
            <View style={styles.promoInfo}>
              <Text style={styles.promoCode}>{promo.code}</Text>
              <Text style={styles.promoDesc}>{promo.description}</Text>
            </View>
          </View>
          <Text style={styles.tapText}>Tap to apply</Text>
        </TouchableOpacity>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingHorizontal: 20, paddingTop: 60 },
  header: { marginBottom: 24 },
  backBtn: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#1E1E2E', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2E2E3E' },
  applyBtn: { backgroundColor: '#6C63FF', paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  applyBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  appliedBox: { backgroundColor: '#43C6AC22', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#43C6AC' },
  appliedEmoji: { fontSize: 24, marginRight: 12 },
  appliedInfo: { flex: 1 },
  appliedCode: { color: '#43C6AC', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  appliedDesc: { color: '#888', fontSize: 13 },
  removeBtn: { color: '#888', fontSize: 18, padding: 4 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  promoCard: { backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  promoLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  discountBadge: { backgroundColor: '#6C63FF22', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#6C63FF', minWidth: 80, alignItems: 'center' },
  discountText: { color: '#6C63FF', fontSize: 13, fontWeight: 'bold' },
  promoInfo: { flex: 1 },
  promoCode: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  promoDesc: { color: '#888', fontSize: 13 },
  tapText: { color: '#555', fontSize: 12 },
});