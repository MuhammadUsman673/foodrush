import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function DeliveryAddressScreen() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setAddresses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!street || !city) {
      Alert.alert('Error', 'Please fill in street and city');
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('addresses').insert({
        user_id: user.id,
        label,
        street,
        city,
        area,
      });

      if (error) throw error;

      setAdding(false);
      setStreet('');
      setCity('');
      setArea('');
      loadAddresses();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await supabase.from('addresses').delete().eq('id', id);
          loadAddresses();
        }
      }
    ]);
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
        <Text style={styles.title}>Saved Addresses 📍</Text>
      </View>

      {/* Add Address Button */}
      {!adding && (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setAdding(true)}>
          <Text style={styles.addBtnText}>+ Add New Address</Text>
        </TouchableOpacity>
      )}

      {/* Add Address Form */}
      {adding && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>New Address</Text>

          {/* Label Selector */}
          <Text style={styles.inputLabel}>Label</Text>
          <View style={styles.labelRow}>
            {['Home', 'Work', 'Other'].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.labelBtn, label === l && styles.labelBtnActive]}
                onPress={() => setLabel(l)}>
                <Text style={[styles.labelBtnText, label === l && styles.labelBtnTextActive]}>
                  {l === 'Home' ? '🏠 Home' : l === 'Work' ? '💼 Work' : '📍 Other'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Street Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street address"
            placeholderTextColor="#555"
            value={street}
            onChangeText={setStreet}
          />

          <Text style={styles.inputLabel}>Area / Neighborhood</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area or neighborhood"
            placeholderTextColor="#555"
            value={area}
            onChangeText={setArea}
          />

          <Text style={styles.inputLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            placeholderTextColor="#555"
            value={city}
            onChangeText={setCity}
          />

          <View style={styles.formBtns}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setAdding(false)}>
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

      {/* Addresses List */}
      {addresses.length === 0 && !adding ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📍</Text>
          <Text style={styles.emptyTitle}>No addresses yet</Text>
          <Text style={styles.emptySubtitle}>Add a delivery address to get started</Text>
        </View>
      ) : (
        addresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            <View style={styles.addressLeft}>
              <Text style={styles.addressLabel}>
                {address.label === 'Home' ? '🏠' : address.label === 'Work' ? '💼' : '📍'} {address.label}
              </Text>
              <Text style={styles.addressText}>{address.street}</Text>
              {address.area ? <Text style={styles.addressText}>{address.area}</Text> : null}
              <Text style={styles.addressText}>{address.city}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(address.id)}>
              <Text style={styles.deleteBtnText}>🗑️</Text>
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
  labelRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  labelBtn: { flex: 1, backgroundColor: '#0F0F1A', padding: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#2E2E3E' },
  labelBtnActive: { borderColor: '#6C63FF', backgroundColor: '#6C63FF22' },
  labelBtnText: { color: '#888', fontSize: 13, fontWeight: '600' },
  labelBtnTextActive: { color: '#6C63FF' },
  formBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#2E2E3E', padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#888', fontSize: 15 },
  addressCard: { backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  addressLeft: { flex: 1 },
  addressLabel: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  addressText: { color: '#888', fontSize: 13, marginBottom: 2 },
  deleteBtn: { padding: 8 },
  deleteBtnText: { fontSize: 20 },
});