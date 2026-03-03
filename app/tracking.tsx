import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';

const steps = [
  { id: 1, icon: '✅', label: 'Order Confirmed', desc: 'Your order has been received' },
  { id: 2, icon: '👨‍🍳', label: 'Preparing', desc: 'Restaurant is cooking your food' },
  { id: 3, icon: '🛵', label: 'On the Way', desc: 'Driver is heading to you' },
  { id: 4, icon: '🏠', label: 'Delivered', desc: 'Enjoy your meal!' },
];

export default function TrackingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Tracking 🛵</Text>
        <Text style={styles.orderId}>Order #FD-2024-001</Text>
      </View>

      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.mainIcon}>{steps[currentStep].icon}</Text>
      </Animated.View>

      <Text style={styles.currentStatus}>{steps[currentStep].label}</Text>
      <Text style={styles.currentDesc}>{steps[currentStep].desc}</Text>

      <View style={styles.etaBox}>
        <Text style={styles.etaLabel}>Estimated Delivery</Text>
        <Text style={styles.etaTime}>25-30 min</Text>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View style={[
                styles.stepDot,
                index <= currentStep && styles.stepDotActive,
                index === currentStep && styles.stepDotCurrent,
              ]}>
                <Text style={styles.stepDotText}>
                  {index < currentStep ? '✓' : step.icon}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View style={[styles.stepLine, index < currentStep && styles.stepLineActive]} />
              )}
            </View>
            <View style={styles.stepInfo}>
              <Text style={[styles.stepLabel, index <= currentStep && styles.stepLabelActive]}>
                {step.label}
              </Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {currentStep >= 2 && (
        <View style={styles.driverBox}>
          <Text style={styles.driverEmoji}>🧑‍💼</Text>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Ali Hassan</Text>
            <Text style={styles.driverDesc}>Your delivery driver</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === steps.length - 1 && (
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.replace('/(tabs)/home' as any)}>
          <Text style={styles.doneBtnText}>Back to Home 🏠</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingHorizontal: 24, paddingTop: 60 },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  orderId: { color: '#888', fontSize: 14 },
  iconContainer: { alignSelf: 'center', width: 100, height: 100, borderRadius: 50, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#6C63FF' },
  mainIcon: { fontSize: 44 },
  currentStatus: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  currentDesc: { color: '#888', fontSize: 15, textAlign: 'center', marginBottom: 20 },
  etaBox: { backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  etaLabel: { color: '#888', fontSize: 14 },
  etaTime: { color: '#6C63FF', fontSize: 16, fontWeight: 'bold' },
  stepsContainer: { marginBottom: 24 },
  stepRow: { flexDirection: 'row', marginBottom: 4 },
  stepLeft: { alignItems: 'center', marginRight: 16, width: 40 },
  stepDot: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#2E2E3E' },
  stepDotActive: { borderColor: '#6C63FF', backgroundColor: '#6C63FF33' },
  stepDotCurrent: { borderColor: '#6C63FF', backgroundColor: '#6C63FF' },
  stepDotText: { fontSize: 16 },
  stepLine: { width: 2, height: 30, backgroundColor: '#2E2E3E', marginVertical: 2 },
  stepLineActive: { backgroundColor: '#6C63FF' },
  stepInfo: { flex: 1, paddingTop: 8, paddingBottom: 20 },
  stepLabel: { color: '#555', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  stepLabelActive: { color: '#fff' },
  stepDesc: { color: '#555', fontSize: 12 },
  driverBox: { backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  driverEmoji: { fontSize: 36, marginRight: 14 },
  driverInfo: { flex: 1 },
  driverName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  driverDesc: { color: '#888', fontSize: 13 },
  callBtn: { backgroundColor: '#6C63FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  callBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  doneBtn: { backgroundColor: '#6C63FF', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});