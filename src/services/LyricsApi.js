import axios from 'axios';


const getLyricsFromOVH = async (artist, title) => {
  try {
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
      { timeout: 8000 } 
    );

    if (response.data.lyrics) {
      return response.data.lyrics;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const getLyricsFromOVHSuggest = async (artist, title) => {
  try {
    const response = await axios.get(
      `https://api.lyrics.ovh/suggest/${encodeURIComponent(artist + ' ' + title)}`,
      { timeout: 8000 }
    );

    if (response.data.data && response.data.data.length > 0) {
      const firstResult = response.data.data[0];
      const lyricsResponse = await axios.get(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(firstResult.artist.name)}/${encodeURIComponent(firstResult.title)}`,
        { timeout: 8000 }
      );
      
      if (lyricsResponse.data.lyrics) {
        return lyricsResponse.data.lyrics;
      }
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getLyrics = async (artist, title) => {
  try {
    const lyrics = await getLyricsFromOVH(artist, title);
    if (lyrics) {
      return lyrics;
    }
  } catch (primaryError) {
    if (primaryError.code === 'ECONNABORTED' || 
        primaryError.code === 'ERR_NETWORK' ||
        primaryError.message === 'Network Error') {
      
      try {
        const suggestedLyrics = await getLyricsFromOVHSuggest(artist, title);
        if (suggestedLyrics) {
          return suggestedLyrics;
        }
      } catch (fallbackError) {
        throw new Error('TIMEOUT');
      }
      
      throw new Error('TIMEOUT');
    }
    
    if (primaryError.response?.status === 404) {
      return null;
    }
    
    if (primaryError.response?.status === 504) {
      throw new Error('TIMEOUT');
    }
    
    throw primaryError;
  }
  
  return null;
};