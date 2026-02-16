import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { getStorageSize, clearAllSavedLyrics } from '../services/storageService';

export default function SettingsScreen() {
  const [storageInfo, setStorageInfo] = useState({ size: 0, count: 0 });

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    const info = await getStorageSize();
    setStorageInfo(info);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Saved Lyrics',
      'This will delete all your saved lyrics. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAllSavedLyrics();
            loadStorageInfo();
            Alert.alert('Done', 'All saved lyrics have been cleared');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        
        <View style={styles.infoCard}>
          <Feather name="database" size={24} color="#667eea" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Saved Lyrics</Text>
            <Text style={styles.infoValue}>{storageInfo.count} songs</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Feather name="hard-drive" size={24} color="#667eea" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Storage Used</Text>
            <Text style={styles.infoValue}>{storageInfo.size} KB</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.dangerButton} onPress={handleClearAll}>
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.dangerButtonText}>Clear All Saved Lyrics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>Lyrics Finder v1.0.0</Text>
        <Text style={styles.aboutSubtext}>Made with ❤️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    gap: 10,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 16,
    color: '#d0d0d0',
    marginBottom: 8,
  },
  aboutSubtext: {
    fontSize: 14,
    color: '#a0a0a0',
  },
});