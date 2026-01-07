import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Lake Superior Audio Guide</Text>
      <Text style={styles.subtitle}>Interactive AI-Driven Travel Companion</Text>
      <Text style={styles.status}>✅ Project Initialized</Text>
      <Text style={styles.phase}>Phase 1.1: Foundation Complete</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a4d7a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a8d5f7',
    marginBottom: 30,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    color: '#4ade80',
    marginBottom: 10,
  },
  phase: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
