import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function PaymentMethodsScreen() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cardType, setCardType] = useState('Visa');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setCards(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substr(0, 19) : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  const handleSave = async () => {
    if (!cardNumber || !cardName || !expiry) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const last4 = cardNumber.replace(/\s/g, '').slice(-4);

      const { error } = await supabase.from('payment_methods').insert({
        user_id: user.id,
        card_type: cardType,
        last4,
        card_name: cardName,
        expiry,
      });

      if (error) throw error;

      setAdding(false);
      setCardNumber('');
      setCardName('');
      setExpiry('');
      loadCards();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Card', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await supabase.from('payment_methods').delete().eq('id', id);
          loadCards();
        }
      }
    ]);
  };

  const getCardEmoji = (type: string) => {
    switch (type) {
      case 'Visa': return '💳';
      case 'Mastercard': return '💳';
      case 'Amex': return '💳';
      default: return '💳';
    }
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
        <Text style={styles.title}>Payment Methods 💳</Text>
      </View>

      {!adding && (
        <TouchableOpacity style={styles.addBtn} onPress={() => setAdding(true)}>
          <Text style={styles.addBtnText}>+ Add New Card</Text>
        </TouchableOpacity>
      )}

      {adding && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>New Card</Text>

          {/* Card Type */}
          <Text style={styles.inputLabel}>Card Type</Text>
          <View style={styles.typeRow}>
            {['Visa', 'Mastercard', 'Amex'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, cardType === t && styles.typeBtnActive]}
                onPress={() => setCardType(t)}>
                <Text style={[styles.typeBtnText, cardType === t && styles.typeBtnTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#555"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            keyboardType="numeric"
            maxLength={19}
          />

          <Text style={styles.inputLabel}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name on card"
            placeholderTextColor="#555"
            value={cardName}
            onChangeText={setCardName}
          />

          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            placeholderTextColor="#555"
            value={expiry}
            onChangeText={(text) => setExpiry(formatExpiry(text))}
            keyboardType="numeric"
            maxLength={5}
          />

          <View style={styles.formBtns}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setAdding(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Cards List */}
      {cards.length === 0 && !adding ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>💳</Text>
          <Text style={styles.emptyTitle}>No cards yet</Text>
          <Text style={styles.emptySubtitle}>Add a card to pay faster</Text>
        </View>
      ) : (
        cards.map((card) => (
          <View key={card.id} style={styles.cardItem}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardEmoji}>{getCardEmoji(card.card_type)}</Text>
              <View>
                <Text style={styles.cardType}>{card.card_type}</Text>
                <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
                <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(card.id)}>
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
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
  addBtn: { backgroundColor: '#6C63FF', padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 20 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  form: { backgroundColor: '#1E1E2E', borderRadius: 16, padding: 20, marginBottom: 20 },
  formTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  inputLabel: { color: '#aaa', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#0F0F1A', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2E2E3E', marginBottom: 16 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeBtn: { flex: 1, backgroundColor: '#0F0F1A', padding: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#2E2E3E' },
  typeBtnActive: { borderColor: '#6C63FF', backgroundColor: '#6C63FF22' },
  typeBtnText: { color: '#888', fontSize: 13, fontWeight: '600' },
  typeBtnTextActive: { color: '#6C63FF' },
  formBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#2E2E3E', padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#888', fontSize: 15 },
  cardItem: { backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  cardEmoji: { fontSize: 32 },
  cardType: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  cardNumber: { color: '#888', fontSize: 13, marginBottom: 2 },
  cardExpiry: { color: '#555', fontSize: 12 },
  deleteBtn: { fontSize: 20 },
});