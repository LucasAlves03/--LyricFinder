import { View, Text, ImageBackground, Animated, StyleSheet, Dimensions, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { saveLyrics, isLyricsSaved } from '../services/storageService';

const { height } = Dimensions.get('window');

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
        <View style={styles.backButton}>
          <TouchableOpacity style={styles.backButtonInner} onPress={onBack}>
            <Feather name="arrow-left" size={22} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
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
          <View style={styles.heroContainer}>
            {trackData.albumArt ? (
              <ImageBackground
                source={resolveImageSource(trackData.albumArt)}
                style={styles.heroImage}
                imageStyle={styles.heroImageInner}
              >
              </ImageBackground>
            ) : (
              <View style={styles.heroPlaceholder} />
            )}

            <LinearGradient colors={['transparent', 'rgb(0, 0, 0)']} style={styles.heroTextBlock}>
              <Text style={styles.title}>{trackData.title}</Text>
              <Text style={styles.artist}>{trackData.artist}</Text>
              <View style={styles.metaRow}>
            {lyrics && (
              <TouchableOpacity 
                style={[styles.saveButton, isSaved && styles.saveButtonActive]} 
                onPress={handleSave}
                disabled={isSaved}
              >
                <Feather 
                  name={isSaved ? "check" : "bookmark"} 
                  size={18} 
                  color="#fff" 
                />
                <Text style={styles.saveButtonText}>
                  {isSaved ? 'Saved' : 'Save Lyrics'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
            </LinearGradient>
            
          </View>

          

          <View style={styles.lyricsSection}>
            {lyrics ? (
              <Text style={styles.lyrics}>{lyrics}</Text>
            ) : (
              <Text style={styles.noLyrics}>Lyrics not found</Text>
            )}
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
    backgroundColor: '#0c0c0c',
  },
  mainContainer: {
    minHeight: height,
  },
  heroContainer: {
    height: Math.round(height * 0.55),
    overflow: 'hidden',
    backgroundColor: '#141414',
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
  },
  heroImageInner: {
    resizeMode: 'cover',
  },
  
  heroPlaceholder: {
    flex: 1,
    backgroundColor: '#1b1b1b',
  },
  heroTextBlock: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: 'transparent',
    width: '100%',
    padding: 10,
    zIndex: 99,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fffcfc',
    textAlign: 'left',
    marginBottom: 2,
    letterSpacing: 0.4,
    textDecorationStyle: 'solid',
    textDecorationColor: 'red',
    
  },
  artist: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f0e9e9',
    textAlign: 'left',
    
    
  },
  metaRow: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  album: {
    fontSize: 14,
    color: '#9a9a9a',
  },
  saveButton: {
    position: 'absolute',
    right: 15,
    bottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c10606',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
  },
  saveButtonActive: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  lyricsSection: {
    width: '100%',
    paddingHorizontal: 22,
    paddingBottom: 40,
    paddingTop: 8,
  },
  lyrics: {
    fontSize: 18,
    lineHeight: 26,
    color: '#ffffff',
    width: '100%',
    letterSpacing: 0.3,
  },
  noLyrics: {
    fontSize: 18,
    color: '#d0d0d0',
    textAlign: 'left',
    fontStyle: 'italic',
  },
});
