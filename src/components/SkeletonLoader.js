import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');

export default function SkeletonLoader() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.albumArt, { opacity }]} />

      <Animated.View style={[styles.title, { opacity }]} />

      <Animated.View style={[styles.artist, { opacity }]} />

      <Animated.View style={[styles.album, { opacity }]} />

      <View style={styles.lyricsContainer}>
        <Animated.View style={[styles.lyricsLine, { opacity }]} />
        <Animated.View style={[styles.lyricsLine, { opacity, width: '90%' }]} />
        <Animated.View style={[styles.lyricsLine, { opacity, width: '95%' }]} />
        <Animated.View style={[styles.lyricsLine, { opacity, width: '85%' }]} />
        <Animated.View style={[styles.lyricsLine, { opacity, width: '92%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#212529',
  },
  albumArt: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: 15,
    backgroundColor: '#2a2e33',
    marginBottom: 25,
  },
  title: {
    width: '70%',
    height: 26,
    borderRadius: 8,
    backgroundColor: '#2a2e33',
    marginBottom: 12,
  },
  artist: {
    width: '50%',
    height: 18,
    borderRadius: 6,
    backgroundColor: '#2a2e33',
    marginBottom: 8,
  },
  album: {
    width: '40%',
    height: 14,
    borderRadius: 6,
    backgroundColor: '#2a2e33',
    marginBottom: 30,
  },
  lyricsContainer: {
    width: '100%',
    backgroundColor: '#1a1d21',
    borderRadius: 15,
    padding: 25,
  },
  lyricsLine: {
    height: 16,
    borderRadius: 4,
    backgroundColor: '#2a2e33',
    marginBottom: 12,
  },
});