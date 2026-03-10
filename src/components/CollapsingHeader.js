import { View, Text, Image, StyleSheet, Animated } from 'react-native';

export default function CollapsingHeader({ scrollY, trackData }) {
  const resolveImageSource = (albumArt) => {
    if (!albumArt) return null;
    return typeof albumArt === 'string' ? { uri: albumArt } : albumArt;
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 60],
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
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    zIndex: 100,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15, 
    height: '100%',
  },
  albumImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
    marginBottom:20,
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
