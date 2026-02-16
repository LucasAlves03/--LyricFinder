import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../../config';

let accessToken = null;
let tokenExpirationTime = null;

const getAccessToken = async () => {
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + (response.data.expires_in - 60) * 1000;
    
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
};

export const searchTrack = async (query) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 1,
      },
    });

    if (response.data.tracks.items.length === 0) {
      return null;
    }

    const track = response.data.tracks.items[0];
    
    return {
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      releaseDate: track.album.release_date,
      previewUrl: track.preview_url,
    };
  } catch (error) {
    console.error('Error searching track:', error);
    throw error;
  }
};