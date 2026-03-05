import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

const faqs = [
  {
    id: '1',
    question: 'How do I track my order?',
    answer: 'After placing an order, go to My Orders in your profile. Tap on any order to see its real-time status.'
  },
  {
    id: '2',
    question: 'How do I cancel my order?',
    answer: 'You can cancel your order within 5 minutes of placing it. Go to My Orders and tap Cancel Order.'
  },
  {
    id: '3',
    question: 'How do I apply a promo code?',
    answer: 'Go to Profile → Promo Codes. Enter your code or tap on any available offer to apply it automatically.'
  },
  {
    id: '4',
    question: 'What payment methods are accepted?',
    answer: 'We accept Visa, Mastercard, and American Express cards. Cash on delivery is also available.'
  },
  {
    id: '5',
    question: 'How do I change my delivery address?',
    answer: 'Go to Profile → Saved Addresses to add or manage your delivery addresses.'
  },
  {
    id: '6',
    question: 'What if my order is wrong or missing items?',
    answer: 'Contact our support team immediately using the form below. We will resolve it within 24 hours.'
  },
];

export default function HelpSupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Save support ticket to notifications table
      await supabase.from('notifications').insert({
        user_id: user?.id,
        title: 'Support ticket received ✅',
        message: `Your message "${subject}" has been received. We will get back to you within 24 hours.`,
        type: 'support',
      });

      Alert.alert(
        'Message Sent! ✅',
        'Our support team will get back to you within 24 hours.',
        [{ text: 'OK', onPress: () => { setSubject(''); setMessage(''); } }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support ❓</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickEmoji}>📞</Text>
          <Text style={styles.quickLabel}>Call Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickEmoji}>💬</Text>
          <Text style={styles.quickLabel}>Live Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickEmoji}>📧</Text>
          <Text style={styles.quickLabel}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickEmoji}>📖</Text>
          <Text style={styles.quickLabel}>Guides</Text>
        </TouchableOpacity>
      </View>

      {/* FAQs */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {faqs.map((faq) => (
        <TouchableOpacity
          key={faq.id}
          style={styles.faqCard}
          onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqArrow}>
              {expandedFaq === faq.id ? '▲' : '▼'}
            </Text>
          </View>
          {expandedFaq === faq.id && (
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          )}
        </TouchableOpacity>
      ))}

      {/* Contact Form */}
      <Text style={styles.sectionTitle}>Send us a Message</Text>
      <View style={styles.form}>
        <Text style={styles.inputLabel}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="What's your issue?"
          placeholderTextColor="#555"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={styles.inputLabel}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your issue in detail..."
          placeholderTextColor="#555"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
        />

        <TouchableOpacity
          style={[styles.sendBtn, sending && { opacity: 0.7 }]}
          onPress={handleSendMessage}
          disabled={sending}>
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendBtnText}>Send Message 📨</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingHorizontal: 20, paddingTop: 60 },
  header: { marginBottom: 24 },
  backBtn: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  quickBtn: { flex: 1, backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, alignItems: 'center' },
  quickEmoji: { fontSize: 28, marginBottom: 8 },
  quickLabel: { color: '#aaa', fontSize: 12, fontWeight: '600' },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  faqCard: { backgroundColor: '#1E1E2E', borderRadius: 14, padding: 16, marginBottom: 10 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1, marginRight: 10 },
  faqArrow: { color: '#6C63FF', fontSize: 12 },
  faqAnswer: { color: '#888', fontSize: 13, marginTop: 12, lineHeight: 20 },
  form: { backgroundColor: '#1E1E2E', borderRadius: 16, padding: 20, marginBottom: 20 },
  inputLabel: { color: '#aaa', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#0F0F1A', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2E2E3E', marginBottom: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  sendBtn: { backgroundColor: '#6C63FF', padding: 16, borderRadius: 14, alignItems: 'center' },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});