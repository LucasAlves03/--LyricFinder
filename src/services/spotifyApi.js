import axios from 'axios';

const MUSICBRAINZ_USER_AGENT = 'LyricsApp/1.0 ( https://example.com )';

const fetchFromITunes = async (query) => {
  const response = await axios.get('https://itunes.apple.com/search', {
    params: {
      term: query,
      entity: 'song',
      limit: 1,
    },
  });

  const result = response.data?.results?.[0];
  if (!result) return null;

  const artwork = result.artworkUrl100
    ? result.artworkUrl100.replace('100x100', '600x600')
    : null;

  return {
    title: result.trackName,
    artist: result.artistName,
    album: result.collectionName,
    albumArt: artwork,
    releaseDate: result.releaseDate,
    previewUrl: result.previewUrl,
  };
};

const fetchFromMusicBrainz = async (query) => {
  const response = await axios.get('https://musicbrainz.org/ws/2/recording', {
    headers: {
      'User-Agent': MUSICBRAINZ_USER_AGENT,
    },
    params: {
      query,
      fmt: 'json',
      limit: 1,
    },
  });

  const recording = response.data?.recordings?.[0];
  if (!recording) return null;

  const artist = recording['artist-credit']?.[0]?.name || 'Unknown Artist';
  const release = recording.releases?.[0];
  const album = release?.title || 'Unknown Album';
  const releaseId = release?.id;

  let albumArt = null;
  if (releaseId) {
    try {
      const artResponse = await axios.get(`https://coverartarchive.org/release/${releaseId}`);
      const images = artResponse.data?.images || [];
      const frontImage = images.find((img) => img.front) || images[0];
      albumArt = frontImage?.thumbnails?.large || frontImage?.image || null;
    } catch (error) {
      if (error?.response?.status !== 404) {
        throw error;
      }
    }
  }

  return {
    title: recording.title,
    artist,
    album,
    albumArt,
    releaseDate: recording['first-release-date'],
    previewUrl: null,
  };
};

export const searchTrack = async (query) => {
  try {
    const itunesResult = await fetchFromITunes(query);
    if (itunesResult) return itunesResult;

    const mbResult = await fetchFromMusicBrainz(query);
    if (mbResult) return mbResult;

    return null;
  } catch (error) {
    console.error('Error searching track:', error);
    throw error;
  }
};
