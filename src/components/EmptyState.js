import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';

const { width, height } = Dimensions.get('window');

const FEATURED_ALBUMS = [
  {
    id: 1,
    title: 'Astrothunder',
    artist: 'Travis Scoot',
    image: require('../../assets/Images/RandomCover.png'),
  },
  {
    id: 2,
    title: 'Let It Happen',
    artist: 'Tame Impala',
    image: require('../../assets/Images/RandomCover2.jpg'),
  },
  {
    id: 3,
    title: 'Evil Jordan',
    artist: 'Playboi Carti',
    image: require('../../assets/Images/RandomCover3.jpg'),
  },
  {
    id: 4,
    title: 'Cardigan',
    artist: 'Don Toliver',
    image: require('../../assets/Images/RandomCover4.jpg'),
  },
];

export default function EmptyState() {
  const [failedImages, setFailedImages] = useState({});
  
  // Animation values
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create looping animations
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(animatedValue1, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue1, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animatedValue2, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue2, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const rotateInterpolate = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scaleInterpolate = animatedValue2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  const renderCarouselItem = (info) => {
    const item = info.item;
    const imgSize = Math.round(width * 0.8);

    if (failedImages[item.id]) {
      return (
        <View style={[styles.carouselItem, styles.placeholderItem]}>
          <Text style={styles.placeholderText}>Image unavailable</Text>
          <Text style={styles.carouselTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      );
    }

    const sourceProp = typeof item.image === 'string' ? { uri: item.image } : item.image;

    return (
      <View style={styles.carouselItem}>
        <Image
          source={sourceProp}
          style={[styles.carouselImage, { width: imgSize, height: imgSize }]}
          resizeMode="cover"
          onLoad={() => {
            if (failedImages[item.id]) {
              setFailedImages((prev) => {
                const copy = { ...prev };
                delete copy[item.id];
                return copy;
              });
            }
          }}
          onError={(e) => {
            setFailedImages((prev) => ({ ...prev, [item.id]: true }));
          }}
        />

        <View style={styles.carouselOverlay}>
          <Text style={styles.carouselTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.carouselArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#000', '#000', '#000', '#000']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <Animated.View
          style={[
            styles.animatedGradient,
            {
              transform: [
                { rotate: rotateInterpolate },
                { scale: scaleInterpolate },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(102, 126, 234, 0.3)', 'transparent', 'rgba(29, 81, 145, 0.8)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.animatedGradient2,
            {
              opacity: animatedValue2.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 0.6, 0.3],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(31, 87, 156, 0.4)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Lyrics 4ALL</Text>
          <Text style={styles.subtitle}>
            Search your favorite song, check the lyrics and
            save to sing later with a beautiful UI.
          </Text>
          
          <View style={styles.carouselSection}>
            <Text style={styles.carouselHeader}>Popular Songs</Text>
            <Carousel
              loop
              autoPlay
              pagingEnabled
              width={width * 0.8}
              height={width * 0.8}
              autoPlayInterval={900}
              data={FEATURED_ALBUMS}
              renderItem={renderCarouselItem}
              style={styles.carousel}
              mode="horizontal-stack"
              modeConfig={{
                snapDirection: "left",
                stackInterval: 18,
              }}
            />
          </View>
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>Start searching above</Text>
            <Feather name="arrow-up" size={16} color="#667eea" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  animatedGradient: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    top: -height / 2,
    left: -width / 2,
  },
  animatedGradient2: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 1.5,
    top: -height / 4,
    right: -width / 4,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height - 200,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    
  },
  carouselSection: {
    marginBottom: 30,
    alignItems: 'center',
    
  },
  carouselHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#a8a8a8',
    margin: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  carousel: {
    width: width * 0.8,
    alignSelf: 'center',
    
  },
  carouselItem: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderItem: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  carouselImage: {
    borderRadius: 20,
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 15,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  carouselArtist: {
    fontSize: 14,
    color: '#d0d0d0',
  },
  title: {
    fontSize: 46,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: -0.5,
    
  },
  subtitle: {
    fontSize: 17,
    color: '#a8a8a8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    maxWidth: 320,
   
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.4)',
    gap: 8,
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});