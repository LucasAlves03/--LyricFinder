import { View, Text, Image, ImageBackground, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';

const { height } = Dimensions.get('window');

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
          <View style={styles.heroContainer}>
            {item.albumArt ? (
              <ImageBackground
                source={resolveImageSource(item.albumArt)}
                style={styles.heroImage}
                imageStyle={styles.heroImageInner}
              >
              </ImageBackground>
            ) : (
              <View style={styles.heroPlaceholder} />
            )}

            <LinearGradient colors={['transparent', 'rgb(0, 0, 0)']} style={styles.heroTextBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </LinearGradient>
          </View>

          <View style={styles.lyricsSection}>
            <Text style={styles.lyrics}>{item.lyrics}</Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0c0c0c',
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
    bottom: 0,
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
  },
  artist: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f0e9e9',
    textAlign: 'left',
  },
  album: {
    fontSize: 14,
    color: '#9a9a9a',
    textAlign: 'left',
    marginTop: 6,
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
});
