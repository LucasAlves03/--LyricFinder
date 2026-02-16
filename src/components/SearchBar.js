import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';

const SONG_RECOMMENDATIONS = [
  'Tame Impala - Let It Happen',
  'Travis Scott - Mafia',
  'Nemzzz - Escape',
  'Dua Lipa - Levitating',
  'The Weeknd - Blinding Lights',
  'Billie Eilish - Bad Guy',
];

export default function SearchBar({ value, onChangeText, onSubmit }) {
  const [placeholder, setPlaceholder] = useState('');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (value) {
      setPlaceholder(' ');
      return;
    }

    const currentSong = SONG_RECOMMENDATIONS[currentSongIndex];

    if (isTyping) {
      if (charIndex < currentSong.length) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentSong.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 100); 
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 9000); 
        return () => clearTimeout(timeout);
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentSong.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50); 
        return () => clearTimeout(timeout);
      } else {
        setCurrentSongIndex((currentSongIndex + 1) % SONG_RECOMMENDATIONS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, currentSongIndex, value]);

  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || ' '}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
});