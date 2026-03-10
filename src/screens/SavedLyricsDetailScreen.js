import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRef } from 'react';

const { width, height } = Dimensions.get('window');

export default function SavedLyricsDetailScreen({ route }) {
  const { item } = route.params;
  const scrollY = useRef(new Animated.Value(0)).current;

  const resolveImageSource = (albumArt) => {
    if (!albumArt) return null;
    return typeof albumArt === 'string' ? { uri: albumArt } : albumArt;
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 65],
    extrapolate: 'clamp'
  })

  const headerOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY} } } ],
    { useNativeDriver: false }
  )

 return (
    <View style={styles.wrapper}>
      <Animated.View 
        style={[
          styles.collapsingHeader, 
          { 
            height: headerHeight,
            opacity: headerOpacity,
          }
        ]}
      >
        <View style={styles.headerContent}>
          {item.albumArt && (
            <Image
              source={resolveImageSource(item.albumArt)}
              style={styles.headerImage}
            />
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.headerArtist} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.mainContainer}>
          <View style={styles.albumSection}>
            {item.albumArt && (
              <View style={styles.albumArtContainer}>
                <Image
                  source={resolveImageSource(item.albumArt)}
                  style={styles.albumArt}
                  resizeMode="cover"
                />
              </View>
            )}

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
            <Text style={styles.album}>{item.album}</Text>
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
                  <Text style={styles.lyrics}>{item.lyrics}</Text>
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
    backgroundColor: '#212529',
  },
  collapsingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    zIndex: 100,
   
    height:110,

  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
  },
  headerImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
   
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  headerArtist: {
    fontSize: 15,
    color: '#b8b8b8',
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
    paddingTop: 20,
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
  },
  lyricsSection: {
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,
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
});
