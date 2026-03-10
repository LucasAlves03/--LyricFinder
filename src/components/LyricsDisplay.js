import { View, Text, Image, Animated, StyleSheet, Dimensions, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useState, useEffect, useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import { saveLyrics, isLyricsSaved } from '../services/storageService';

const { width, height } = Dimensions.get('window');

export default function LyricsDisplay({ trackData, lyrics, onRefresh, onScroll, onBack, scrollY }) {
  const [refreshing, setRefreshing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const resolveImageSource = (albumArt) => {
    if (!albumArt) return null;
    return typeof albumArt === 'string' ? { uri: albumArt } : albumArt;
  };

  const backButtonOpacity = scrollY ? scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  }) : new Animated.Value(1);

  const backButtonTranslateY = scrollY ? scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  }) : new Animated.Value(0);

  useEffect(() => {
    checkIfSaved();
  }, [trackData]);

  const checkIfSaved = async () => {
    if (trackData) {
      const saved = await isLyricsSaved(trackData.title, trackData.artist);
      setIsSaved(saved);
    }
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleSave = async () => {
    if (!trackData || !lyrics) {
      Alert.alert('Cannot Save', 'No lyrics to save');
      return;
    }

    const result = await saveLyrics(trackData, lyrics);
    
    if (result.success) {
      setIsSaved(true);
      Alert.alert('Saved!', 'Lyrics saved successfully');
    } else {
      Alert.alert('Info', result.message);
    }
  };

  if (!trackData) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Animated.View 
        style={[
          styles.backButtonContainer,
          {
            opacity: backButtonOpacity,
            transform: [{ translateY: backButtonTranslateY }],
          }
        ]}
        pointerEvents={scrollY && scrollY._value > 50 ? 'none' : 'auto'}
      >
        <BlurView intensity={80} tint="dark" style={styles.backButton}>
          <TouchableOpacity style={styles.backButtonInner} onPress={onBack}>
            <Feather name="arrow-left" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#667eea"
            colors={['#667eea']}
          />
        }
      >
        <View style={styles.mainContainer}>
          <View style={styles.albumSection}>
            {/* Album Art */}
            {trackData.albumArt && (
              <View style={styles.albumArtContainer}>
                <Image
                  source={resolveImageSource(trackData.albumArt)}
                  style={styles.albumArt}
                  resizeMode="cover"
                />
              </View>
            )}

            <Text style={styles.title}>{trackData.title}</Text>
            <Text style={styles.artist}>{trackData.artist}</Text>
            <Text style={styles.album}>{trackData.album}</Text>

            {lyrics && (
              <TouchableOpacity 
                style={[styles.saveButton, isSaved && styles.saveButtonActive]} 
                onPress={handleSave}
                disabled={isSaved}
              >
                <Feather 
                  name={isSaved ? "check" : "bookmark"} 
                  size={20} 
                  color="#fff" 
                />
                <Text style={styles.saveButtonText}>
                  {isSaved ? 'Saved' : 'Save Lyrics'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <LinearGradient
            colors={['#212529', '#212527', '#212528']}
            style={styles.lyricsSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.glassContainer}>
              <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
                <View style={styles.lyricsContainer}>
                  {lyrics ? (
                    <Text style={styles.lyrics}>{lyrics}</Text>
                  ) : (
                    <Text style={styles.noLyrics}>Lyrics not found</Text>
                  )}
                </View>
              </BlurView>
            </View>
          </LinearGradient>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 1000,
  },
  backButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  mainContainer: {
    minHeight: height,
  },
  albumSection: {
    backgroundColor: '#212529',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    
  },
  albumArtContainer: {
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  albumArt: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  artist: {
    fontSize: 18,
    color: '#d0d0d0',
    textAlign: 'center',
    marginBottom: 4,
  },
  album: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 10,
  },
  saveButtonActive: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  lyricsSection: {
    width: '100%',
  },
  glassContainer: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  blurContainer: {
    overflow: 'hidden',
  },
  lyricsContainer: {
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  lyrics: {
    fontSize: 25,
    lineHeight: 28,
    color: '#ffffff',
    width: '100%',
    letterSpacing: 0.3,
  },
  noLyrics: {
    fontSize: 28,
    color: '#d0d0d0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
