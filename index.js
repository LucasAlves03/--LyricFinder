import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import SearchScreen from './src/screens/SearchScreen';
import SavedLyricsScreen from './src/screens/SavedLyricsScreen';
import SavedLyricsDetailScreen from './src/screens/SavedLyricsDetailScreen';
import AnimatedSplash from './src/components/AnimatedSplash';
import SearchTabPreview from './src/components/SearchTabPreview';
import { useState } from 'react';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const USE_SEARCH_PREVIEW = false;

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

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#2a2a2a',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 9,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Search"
        component={USE_SEARCH_PREVIEW ? SearchTabPreview : SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="bookmark" size={size} color={color} />
          ),
        }}
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
    <NavigationContainer>
      <TabNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

registerRootComponent(App);

export default App;
