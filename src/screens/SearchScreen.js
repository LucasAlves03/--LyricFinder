import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { searchTrack } from '../services/CoverApi';
import { getLyrics } from '../services/LyricsApi';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return undefined;

    const unsubscribe = parent.addListener('tabPress', () => {
      if (!navigation.isFocused()) return;
      setError(null);
      setSearchQuery('');
    });

    return unsubscribe;
  }, [navigation]);

  const isRelevantMatch = (track, query) => {
    const searchLower = query.toLowerCase();
    const titleLower = track.title.toLowerCase();
    const artistLower = track.artist.toLowerCase();

    const queryWords = searchLower.split(' ').filter((word) => word.length > 2);

    if (queryWords.length === 0) return true;

    return queryWords.some((word) => titleLower.includes(word) || artistLower.includes(word));
  };

  const handleSearch = async (retryCount = 0) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const track = await searchTrack(searchQuery);

      if (!track) {
        setError({
          message: "Couldn't find that song.\n\nTry searching with artist name:\n\"Song Title Artist Name\"",
          type: 'not_found',
        });
        return;
      }

      if (!isRelevantMatch(track, searchQuery)) {
        setError({
          message: "Couldn't find that song.\n\nTry searching with artist name:\n\"Song Title Artist Name\"",
          type: 'not_found',
        });
        return;
      }

      try {
        const fetchedLyrics = await getLyrics(track.artist, track.title);
        navigation.navigate('SearchLyrics', {
          trackData: track,
          lyrics: fetchedLyrics || '',
        });
      } catch (lyricsError) {
        if (lyricsError.message === 'TIMEOUT' && retryCount < 1) {
          console.log('Retrying lyrics fetch...');
          await new Promise((resolve) => setTimeout(resolve, 5000));

          try {
            const fetchedLyrics = await getLyrics(track.artist, track.title);
            navigation.navigate('SearchLyrics', {
              trackData: track,
              lyrics: fetchedLyrics || '',
            });
          } catch (retryError) {
            console.log('Retry failed, showing track without lyrics');
            navigation.navigate('SearchLyrics', {
              trackData: track,
              lyrics: '',
            });
          }
        } else {
          console.log('Could not fetch lyrics, showing track without lyrics');
          navigation.navigate('SearchLyrics', {
            trackData: track,
            lyrics: '',
          });
        }
      }
    } catch (searchError) {
      const status = searchError?.response?.status;

      if (status === 401 || status === 403) {
        setError({
          message: 'Music provider access denied.\n\nPlease check your API access.',
          type: 'auth',
        });
      } else if (status === 429) {
        setError({
          message: 'Too many requests.\n\nPlease wait a moment and try again.',
          type: 'rate_limit',
        });
      } else if (searchError?.message === 'TIMEOUT' || status === 504) {
        setError({
          message: 'The server is taking too long to respond.\n\nPlease try again in a moment.',
          type: 'timeout',
        });
      } else if (searchError?.message?.includes('Network')) {
        setError({
          message: 'No internet connection.\n\nCheck your connection and try again.',
          type: 'network',
        });
      } else {
        setError({
          message: 'Something went wrong.\n\nPlease try again in a moment.',
          type: 'unknown',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSearch();
  };

  const handlePreviewTrack = (track) => {
    if (!track) return;
    setError(null);
    setLoading(false);
    navigation.navigate('SearchLyrics', {
      trackData: {
        title: track.title,
        artist: track.artist,
        album: track.album || 'Single',
        albumArt: track.image,
      },
      lyrics: track.preview || '',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        {loading && <SkeletonLoader />}

        {!loading && error && (
          <ErrorMessage
            message={error.message}
            onRetry={error.type !== 'not_found' ? handleRetry : null}
            onBack={() => setError(null)}
          />
        )}

        {!loading && !error && (
          <EmptyState
            searchQuery={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearch}
            onPreviewTrack={handlePreviewTrack}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161819',
  },
});
