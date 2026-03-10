import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { getSavedLyrics, deleteSavedLyrics } from '../services/storageService';

export default function SavedLyricsScreen({ navigation }) {
  const [savedLyrics, setSavedLyrics] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const resolveImageSource = (albumArt) => {
    if (!albumArt) return null;
    return typeof albumArt === 'string' ? { uri: albumArt } : albumArt;
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedLyrics();
    }, [])
  );

  const loadSavedLyrics = async () => {
    const data = await getSavedLyrics();
    setSavedLyrics(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSavedLyrics();
    setRefreshing(false);
  };

  const handleDelete = (id, title) => {
    Alert.alert(
      'Delete Lyrics',
      `Remove "${title}" from saved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSavedLyrics(id);
            loadSavedLyrics();
          },
        },
      ]
    );
  };

  const handleCardPress = (item) => {
    navigation.navigate('SavedLyricsDetail', { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={resolveImageSource(item.albumArt)}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        <Text style={styles.cardAlbum} numberOfLines={1}>
          {item.album}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id, item.title)}
      >
        <Feather name="trash-2" size={20} color="#ff6b6b" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bookmark" size={80} color="#4a4a4a" />
      <Text style={styles.emptyTitle}>No Saved Lyrics</Text>
      <Text style={styles.emptyText}>
        Save your favorite lyrics to access them quickly without searching
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={savedLyrics}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={savedLyrics.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#667eea"
            colors={['#667eea']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    
  },
  list: {
    padding: 15,
  },
  emptyList: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cardArtist: {
    fontSize: 14,
    color: '#d0d0d0',
    marginBottom: 2,
  },
  cardAlbum: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 24,
  },
});
