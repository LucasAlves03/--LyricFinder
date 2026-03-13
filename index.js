import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import SearchScreen from './src/screens/SearchScreen';
import SearchLyricsScreen from './src/screens/SearchLyricsScreen';
import SavedLyricsScreen from './src/screens/SavedLyricsScreen';
import SavedLyricsDetailScreen from './src/screens/SavedLyricsDetailScreen';
import AnimatedSplash from './src/components/AnimatedSplash';
import SearchTabPreview from './src/components/SearchTabPreview';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
// attach to search => Tame impala the less i know the better
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const USE_SEARCH_PREVIEW = false;

function FadeTabScreen({ children }) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      opacity.setValue(0);
    }
  }, [isFocused, opacity]);

  return (
    <Animated.View style={{ flex: 1, opacity, backgroundColor: '#0c0c0c' }}>
      {children}
    </Animated.View>
  );
}

function SearchTab() {
  return (
    <FadeTabScreen>
      <SearchStack />
    </FadeTabScreen>
  );
}

function SavedTab() {
  return (
    <FadeTabScreen>
      <SavedStack />
    </FadeTabScreen>
  );
}

function SavedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        headerTopInsetEnabled: true, 
        headerStatusBarHeight: 10,
      }}
    >
      <Stack.Screen 
        name="SavedLyricsList" 
        component={SavedLyricsScreen}
        options={{
          headerTitle: 'Saved Lyrics',
        }}
      />
      <Stack.Screen 
        name="SavedLyricsDetail" 
        component={SavedLyricsDetailScreen}
        options={{
          headerTitle: 'Lyrics',
        }}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        headerTopInsetEnabled: true,
        headerStatusBarHeight: 10,
      }}
    >
      <Stack.Screen
        name="SearchMain"
        component={USE_SEARCH_PREVIEW ? SearchTabPreview : SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchLyrics"
        component={SearchLyricsScreen}
        options={{ headerTitle: 'Lyrics' }}
      />
    </Stack.Navigator>
  );
}
function TabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#2a2a2a',
          borderTopWidth: 1,
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#434343',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('Search', { screen: 'SearchMain' });
          },
        })}
      />
      <Tab.Screen
        name="Saved"
        component={SavedTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="bookmark" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Saved', { screen: 'SavedLyricsList' });
          },
        })}
      />
    </Tab.Navigator>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <TabNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
registerRootComponent(App);
export default App;
