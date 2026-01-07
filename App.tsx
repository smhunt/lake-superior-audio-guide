import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import VoiceAssistant from './src/components/VoiceAssistant';

export default function App() {
  return (
    <View style={styles.container}>
      <VoiceAssistant />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
