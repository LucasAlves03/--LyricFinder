import { View, StyleSheet, KeyboardAvoidingView, Platform, Animated,  } from 'react-native';
import { BlurView } from 'expo-blur'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import LyricsDisplay from '../components/LyricsDisplay';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import CollapsingHeader from '../components/CollapsingHeader';
import { searchTrack } from '../services/spotifyApi';
import { getLyrics } from '../services/LyricsApi';


export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackData, setTrackData] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp'
  });

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const isRelevantMatch = (track, query, ) => {
    const searchLower = query.toLowerCase();
    const titleLower = track.title.toLowerCase();
    const artistLower = track.artist.toLowerCase();
    
    const queryWords = searchLower.split(' ').filter(word => word.length > 2);
    
    if (queryWords.length === 0) return true;
    
    return queryWords.some(word => 
      titleLower.includes(word) || artistLower.includes(word)
    );
  };

  const handleSearch = async (retryCount = 0) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setTrackData(null);
    setLyrics('');
    setError(null);

    try {
      const track = await searchTrack(searchQuery);
      
      if (!track) {
        setError({
          message: "Couldn't find that song 🎵\n\nTry searching with artist name:\n\"Song Title Artist Name\"",
          type: 'not_found'
        });
        setLoading(false);
        return;
      }

      if (!isRelevantMatch(track, searchQuery)) {
        setError({
          message: "Couldn't find that song 🎵\n\nTry searching with artist name:\n\"Song Title Artist Name\"",
          type: 'not_found'
        });
        setLoading(false);
        return;
      }

      setTrackData(track);

      try {
        const fetchedLyrics = await getLyrics(track.artist, track.title);
        setLyrics(fetchedLyrics || '');
      } catch (lyricsError) {
        if (lyricsError.message === 'TIMEOUT' && retryCount < 1) {
          console.log('Retrying lyrics fetch...');
          await new Promise(resolve => setTimeout(resolve, 5000)); 
          
          try {
            const fetchedLyrics = await getLyrics(track.artist, track.title);
            setLyrics(fetchedLyrics || '');
          } catch (retryError) {
            console.log('Retry failed, showing track without lyrics');
            setLyrics('');
          }
        } else {
          console.log('Could not fetch lyrics, showing track without lyrics');
          setLyrics('');
        }
      }
      
      if (error.message === 'TIMEOUT') {
        setError({
          message: "The lyrics server is taking too long to respond ⏱️\n\nPlease try again in a moment.",
          type: 'timeout'
        });
      } else if (error.message.includes('Network')) {
        setError({
          message: "No internet connection 📡\n\nCheck your connection and try again.",
          type: 'network'
        });
      } else if (error.response?.status === 429) {
        setError({
          message: "Too many requests 🚦\n\nPlease wait a moment and try again.",
          type: 'rate_limit'
        });
      } else if (error.response?.status === 504) {
        setError({
          message: "The lyrics server is temporarily unavailable ⏱️\n\nPlease try again in a few minutes.",
          type: 'timeout'
        });
      } else {
        setError({
          message: "Something went wrong 😕\n\nPlease try again in a moment.",
          type: 'unknown'
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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );
    const handleBack = () => {
    setTrackData(null);
    setLyrics('');
    setError(null);
    setSearchQuery('');
  };

return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        
        {!loading && !error && (
          <Animated.View 
            style={[
              styles.searchBarContainer,
              trackData && {
                transform: [{ translateY: searchBarTranslateY }],
                opacity: searchBarOpacity,
              }
            ]}
            pointerEvents={trackData && scrollY._value > 50 ? 'none' : 'auto'}
          >
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={handleSearch}
            />
          </Animated.View>
        )}

        {trackData && <CollapsingHeader scrollY={scrollY} trackData={trackData} />}

        {loading && <SkeletonLoader />}

        {!loading && error && (
          <ErrorMessage 
            message={error.message} 
            onRetry={error.type !== 'not_found' ? handleRetry : null}
            onBack={handleBack}
            
          />
        )}

        {!loading && !error && !trackData && <EmptyState />}

        {!loading && !error && trackData && (
          <LyricsDisplay 
            trackData={trackData} 
            lyrics={lyrics}
            onRefresh={handleSearch}
            onScroll={handleScroll}
            onBack={handleBack}
            scrollY={scrollY}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  searchBarContainer: {
    backgroundColor: '#1a1a1a',
    
  }
});