import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@saved_lyrics';
const MAX_SAVED_ITEMS = 50;

export const saveLyrics = async (trackData, lyrics) => {
  try {
    const existing = await getSavedLyrics();
    
    const isDuplicate = existing.some(
      item => item.title === trackData.title && item.artist === trackData.artist
    );
    
    if (isDuplicate) {
      return { success: false, message: 'Already saved' };
    }
    
    const savedItem = {
      id: Date.now().toString(),
      ...trackData,
      lyrics,
      savedAt: new Date().toISOString(),
    };
    
    let updated = [savedItem, ...existing];
    if(updated.length > MAX_SAVED_ITEMS){
      updated = updated.slice(0, MAX_SAVED_ITEMS);
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return { success: true, message: 'Saved successfully' };
  } catch (error) {
    console.error('Error saving lyrics:', error);
    return { success: false, message: 'Failed to save' };
  }
};

export const getSavedLyrics = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting saved lyrics:', error);
    return [];
  }
};

export const deleteSavedLyrics = async (id) => {
  try {
    const existing = await getSavedLyrics();
    const updated = existing.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
  } catch (error) {
    console.error('Error deleting lyrics:', error);
    return { success: false };
  }
};

export const isLyricsSaved = async (title, artist) => {
  try {
    const existing = await getSavedLyrics();
    return existing.some(
      item => item.title === title && item.artist === artist
    );
  } catch (error) {
    return false;
  }
};

export const getStorageSize = async () => {
  try{
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if(!data) return { size: 0, count: 0};

    const sizeInBytes = new Blob([data]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    const count = JSON.parse(data).length;
    return {size: sizeInKB, count};
  }catch (error) {
    return {size: 0, count: 0};
  }
};

export const clearAllSavedLyrics = async () => {
  try{
    await AsyncStorage.removeItem(STORAGE_KEY);
    return {sucess: true};
  }catch (error){
    return {sucess: false};
  }
}