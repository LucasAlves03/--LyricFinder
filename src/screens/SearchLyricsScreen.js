import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import LyricsDisplay from '../components/LyricsDisplay';
import { getLyrics } from '../services/LyricsApi';

export default function SearchLyricsScreen({ route }) {
  const { trackData, lyrics: initialLyrics } = route.params || {};
  const [lyrics, setLyrics] = useState(initialLyrics || '');

  useEffect(() => {
    setLyrics(initialLyrics || '');
  }, [initialLyrics, trackData?.title, trackData?.artist]);

  const handleRefresh = async () => {
    if (!trackData) return;
    try {
      const fetchedLyrics = await getLyrics(trackData.artist, trackData.title);
      setLyrics(fetchedLyrics || '');
    } catch (error) {
      setLyrics('');
    }
  };

  return (
    <View style={styles.container}>
      <LyricsDisplay
        trackData={trackData}
        lyrics={lyrics}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
});
