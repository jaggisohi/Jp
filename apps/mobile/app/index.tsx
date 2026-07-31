import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>JP App</Text>
      <Text style={styles.subtitle}>Your all-in-one mobile experience</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineButton} onPress={() => router.push('/signup')}>
        <Text style={styles.outlineButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f5f3ff' },
  title: { fontSize: 40, fontWeight: 'bold', color: '#6366f1', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 40, textAlign: 'center' },
  button: { width: '100%', backgroundColor: '#6366f1', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  outlineButton: { width: '100%', borderWidth: 2, borderColor: '#6366f1', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  outlineButtonText: { color: '#6366f1', fontSize: 16, fontWeight: '600' },
});
