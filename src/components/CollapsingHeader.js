import { View, Text, Image, StyleSheet, Animated } from 'react-native';

export default function CollapsingHeader({ scrollY, trackData }) {
  const resolveImageSource = (albumArt) => {
    if (!albumArt) return null;
    return typeof albumArt === 'string' ? { uri: albumArt } : albumArt;
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 65],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          height: headerHeight,
          opacity: headerOpacity,
        }
      ]}
    >
      <View style={styles.content}>
        {trackData?.albumArt && (
          <Image
            source={resolveImageSource(trackData.albumArt)}
            style={styles.albumImage}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {trackData?.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {trackData?.artist}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 16,
    backgroundColor: '#101010',

  },
  albumImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  artist: {
    fontSize: 15,
    color: '#b8b8b8',
  },
});
