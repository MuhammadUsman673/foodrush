import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, BackHandler
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';

const menuItems = [
  { id: '1', icon: '📦', label: 'My Orders', desc: 'View your order history' },
  { id: '2', icon: '📍', label: 'Saved Addresses', desc: 'Manage delivery addresses' },
  { id: '3', icon: '💳', label: 'Payment Methods', desc: 'Cards and wallets' },
  { id: '4', icon: '🔔', label: 'Notifications', desc: 'Manage your alerts' },
  { id: '5', icon: '🎁', label: 'Promo Codes', desc: 'Redeem your vouchers' },
  { id: '6', icon: '⭐', label: 'Rate the App', desc: 'Share your feedback' },
  { id: '7', icon: '❓', label: 'Help & Support', desc: 'Get help anytime' },
];

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProfile();

      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/(tabs)/home' as any);
        return true;
      });
      return () => backHandler.remove();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);

        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id);
        setOrders(ordersData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const getInitial = () => {
    if (profile?.name) return profile.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getName = () => {
    if (profile?.name) return profile.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleMenuPress = (id: string) => {
    switch (id) {
      case '1': router.push('/order-history' as any); break;
      case '2': router.push('/delivery-address' as any); break;
      case '3': router.push('/payment-methods' as any); break;
      case '4': router.push('/notifications' as any); break;
      case '5': router.push('/promo-codes' as any); break;
      case '7': router.push('/help-support' as any); break;
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
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getInitial()}</Text>
        </View>
        <Text style={styles.name}>{getName()}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push('/edit-profile' as any)}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>🥇</Text>
          <Text style={styles.statLabel}>Gold Member</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.id)}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  loadingContainer: { flex: 1, backgroundColor: '#0F0F1A', alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 28, paddingHorizontal: 20 },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 3, borderColor: '#8B83FF' },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  email: { fontSize: 15, color: '#888', marginBottom: 16 },
  editBtn: { borderWidth: 1, borderColor: '#6C63FF', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 },
  editBtnText: { color: '#6C63FF', fontSize: 14, fontWeight: '600' },
  statsRow: { flexDirection: 'row', backgroundColor: '#1E1E2E', marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 24, alignItems: 'center' },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: '#2E2E3E' },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#888' },
  menuContainer: { paddingHorizontal: 20, marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, marginBottom: 10 },
  menuIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#2E2E3E', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuIcon: { fontSize: 22 },
  menuInfo: { flex: 1 },
  menuLabel: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  menuDesc: { color: '#888', fontSize: 12 },
  menuArrow: { color: '#555', fontSize: 22 },
  logoutBtn: { marginHorizontal: 20, backgroundColor: '#1E1E2E', padding: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#FF6584' },
  logoutText: { color: '#FF6584', fontSize: 16, fontWeight: '600' },
});