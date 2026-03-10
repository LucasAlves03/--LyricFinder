import { View, StyleSheet, KeyboardAvoidingView, Platform, Animated, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import LyricsDisplay from '../components/LyricsDisplay';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import CollapsingHeader from '../components/CollapsingHeader';
import { searchTrack } from '../services/spotifyApi';
import { getLyrics } from '../services/LyricsApi';


const DEFAULT_MOCK_TRACK = {
  title: 'Let It Happen',
  artist: 'Tame Impala',
  album: 'Currents',
  albumArt: require('../../assets/Images/RandomCover2.jpg'),
};

const DEFAULT_MOCK_LYRICS =
`It's always around me, all this noise
But not nearly as loud as the voice saying
"Let it happen, let it happen"`;

const MOCK_LIBRARY = [
  {
    query: 'let it happen',
    trackData: DEFAULT_MOCK_TRACK,
    lyrics: DEFAULT_MOCK_LYRICS,
  },
];

export default function HomeScreen({ mockMode = false, mockData, mockLyrics } = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackData, setTrackData] = useState(mockMode ? (mockData || DEFAULT_MOCK_TRACK) : null);
  const [lyrics, setLyrics] = useState(mockMode ? (mockLyrics || DEFAULT_MOCK_LYRICS) : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockSearch, setUseMockSearch] = useState(false);
  
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

  useEffect(() => {
    if (!mockMode) return;
    setTrackData(mockData || DEFAULT_MOCK_TRACK);
    setLyrics(mockLyrics || DEFAULT_MOCK_LYRICS);
    setError(null);
    setLoading(false);
  }, [mockMode]);

  const findMockMatch = (query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return null;

    return MOCK_LIBRARY.find((item) => item.query === normalized) || null;
  };

  const isRelevantMatch = (track, query) => {
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
    const mockMatch = findMockMatch(searchQuery);
    if (useMockSearch && mockMatch) {
      setError(null);
      setLoading(false);
      setTrackData(mockMatch.trackData);
      setLyrics(mockMatch.lyrics || '');
      return;
    }
    if (mockMode) {
      setError(null);
      setLoading(false);
      setTrackData(mockData || DEFAULT_MOCK_TRACK);
      setLyrics(mockLyrics || DEFAULT_MOCK_LYRICS);
      return;
    }
    if (!searchQuery.trim()) return;

    setLoading(true);
    setTrackData(null);
    setLyrics('');
    setError(null);

    try {
      const track = await searchTrack(searchQuery);

      if (!track) {
        setError({
          message: "Couldn't find that song.\n\nTry searching with artist name:\n\"Song Title Artist Name\"",
          type: 'not_found'
        });
        return;
      }

      if (!isRelevantMatch(track, searchQuery)) {
        setError({
          message: "Couldn't find that song.\n\nTry searching with artist name:\n\"Song Title Artist Name\"",
          type: 'not_found'
        });
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
    } catch (searchError) {
      const status = searchError?.response?.status;

      if (status === 401 || status === 403) {
        setError({
          message: "Spotify access denied.\n\nCheck your Spotify client ID/secret.",
          type: 'auth'
        });
      } else if (status === 429) {
        setError({
          message: "Too many requests.\n\nPlease wait a moment and try again.",
          type: 'rate_limit'
        });
      } else if (searchError?.message === 'TIMEOUT' || status === 504) {
        setError({
          message: "The server is taking too long to respond.\n\nPlease try again in a moment.",
          type: 'timeout'
        });
      } else if (searchError?.message?.includes('Network')) {
        setError({
          message: "No internet connection.\n\nCheck your connection and try again.",
          type: 'network'
        });
      } else {
        setError({
          message: "Something went wrong.\n\nPlease try again in a moment.",
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
    if (mockMode) {
      setTrackData(mockData || DEFAULT_MOCK_TRACK);
      setLyrics(mockLyrics || DEFAULT_MOCK_LYRICS);
      setError(null);
      setSearchQuery('');
      return;
    }
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
            <TouchableOpacity
              style={[styles.mockToggle, useMockSearch && styles.mockToggleActive]}
              onPress={() => setUseMockSearch((prev) => !prev)}
            >
              <Text style={styles.mockToggleText}>
                {useMockSearch ? 'Mock search: ON' : 'Mock search: OFF'}
              </Text>
            </TouchableOpacity>
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
    
  },
  mockToggle: {
    alignSelf: 'center',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  mockToggleActive: {
    backgroundColor: '#3a3a3a',
    borderColor: '#667eea',
  },
  mockToggleText: {
    color: '#d0d0d0',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});


