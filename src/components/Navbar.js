import { View, Text, StyleSheet } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Lyrics Finder</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    paddingTop: 15,
    paddingBottom: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
});