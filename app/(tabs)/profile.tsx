import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';

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
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>U</Text>
        </View>
        <Text style={styles.name}>Usman</Text>
        <Text style={styles.email}>usman@email.com</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
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

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
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

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace('/login')}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#8B83FF',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
  },
  editBtn: {
    borderWidth: 1,
    borderColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editBtnText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1E1E2E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2E2E3E',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2E2E3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  menuDesc: {
    color: '#888',
    fontSize: 12,
  },
  menuArrow: {
    color: '#555',
    fontSize: 22,
  },
  logoutBtn: {
    marginHorizontal: 20,
    backgroundColor: '#1E1E2E',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6584',
  },
  logoutText: {
    color: '#FF6584',
    fontSize: 16,
    fontWeight: '600',
  },
});