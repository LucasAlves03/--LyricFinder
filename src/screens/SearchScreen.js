import { View, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import LyricsDisplay from '../components/LyricsDisplay';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import CollapsingHeader from '../components/CollapsingHeader';
import { searchTrack } from '../services/CoverApi';
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
"Let it happen, let it happen" (it's gonna feel so good)
"Just let it happen, let it happen"
All this running around
Tryin' to cover my shadow
A notion growing inside
Now, all the others seem shallow
All this running around
Bearing down on my shoulders
I can hear an alarm
Must be a morning
I heard about a whirlwind that's coming 'round
It's gonna carry off all that isn't bound
And when it happens, when it happens (I won't be holding on)
So let it happen, let it happen
All this running around
I can't fight it much longer
Something's tryin' to get out
And it's never been closer
If my take-off fails
Make up some other story
If I never come back
Tell my mother I'm sorry
I cannot vanish, you will not scare me
Try to get through it, try to push through it
You were not thinking that I will not do it
They be lovin' someone and I'm another story
Take the next ticket, get the next train
Why would I do it? Anyone'd think that
I cannot vanish, you will not scare me
Try to get through it, try to push through it
You were not thinking that I will not do it
They be lovin' someone and I'm another story
Take the next ticket, get the next train
Why would I do it? Anyone'd think that
Try to get through it, try to push through it
You were not thinking that I will not do it
They be lovin' someone and I'm another story
Take the next ticket, get the next train
Why would I do it? Anyone'd think that
Baby, now I'm ready, moving on
Oh, but maybe I was ready all along
Oh, I'm ready for the moment and the sound
Oh, but maybe I was ready all along
Baby, now I'm ready, moving on
Oh, but maybe I was ready all along
Oh, I'm ready for the moment and the sound
Oh, but maybe I was ready all along`;

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
          message: "Music provider access denied.\n\nPlease check your API access.",
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

  const handlePreviewTrack = (track) => {
    if (!track) return;
    setError(null);
    setLoading(false);
    setTrackData({
      title: track.title,
      artist: track.artist,
      album: track.album || 'Single',
      albumArt: track.image,
    });
    setLyrics(track.preview || '');
  };

return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>

        {trackData && <CollapsingHeader scrollY={scrollY} trackData={trackData} />}

        {loading && <SkeletonLoader />}

        {!loading && error && (
          <ErrorMessage 
            message={error.message} 
            onRetry={error.type !== 'not_found' ? handleRetry : null}
            onBack={handleBack}
            
          />
        )}

        {!loading && !error && !trackData && (
          <EmptyState
            searchQuery={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearch}
            useMockSearch={useMockSearch}
            onToggleMockSearch={() => setUseMockSearch((prev) => !prev)}
            onPreviewTrack={handlePreviewTrack}
          />
        )}

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
    backgroundColor: '#161819',
  },
});


