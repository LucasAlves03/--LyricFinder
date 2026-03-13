import axios from 'axios';

const GENIUS_ACCESS_TOKEN = 'kMc3PglYvjKLJHqkYtRYxcMlJ7nHD-rWlTEh3kc611r-FQX2xGv4y5mOwy1Jm9UK';

const decodeHtmlEntities = (text) => {
  if (!text) return text;
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
};

const extractLyricsFromHtml = (html) => {
  if (!html) return null;

  const containers = [];
  const containerRegex = /data-lyrics-container="true"[^>]*>([\s\S]*?)<\/div>/g;
  let match = containerRegex.exec(html);
  while (match) {
    containers.push(match[1]);
    match = containerRegex.exec(html);
  }

  let lyricsBlock = containers.length ? containers.join('\n') : null;

  if (!lyricsBlock) {
    const legacyMatch = html.match(/<div class="lyrics">([\s\S]*?)<\/div>/);
    if (legacyMatch) {
      lyricsBlock = legacyMatch[1];
    }
  }

  if (!lyricsBlock) return null;

  const withLineBreaks = lyricsBlock
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n');

  const stripped = withLineBreaks.replace(/<[^>]*>/g, '');
  const decoded = decodeHtmlEntities(stripped);
  return decoded.trim();
};

const getLyricsFromGenius = async (artist, title) => {
  if (!GENIUS_ACCESS_TOKEN || GENIUS_ACCESS_TOKEN === 'YOUR_KEY_HERE') {
    return null;
  }

  const query = `${artist} ${title}`.trim();
  if (!query) return null;

  try {
    const searchResponse = await axios.get(
      `https://api.genius.com/search?q=${encodeURIComponent(query)}`,
      {
        timeout: 8000,
        headers: {
          Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
        },
      }
    );

    const hits = searchResponse.data?.response?.hits || [];
    const firstHit = hits.find((hit) => hit?.result?.url);
    if (!firstHit) return null;

    const songUrl = firstHit.result.url;
    const pageResponse = await axios.get(songUrl, { timeout: 8000 });
    return extractLyricsFromHtml(pageResponse.data);
  } catch (error) {
    throw error;
  }
};

const isNetworkError = (error) => {
  return (
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ERR_NETWORK' ||
    error?.message === 'Network Error' ||
    error?.response?.status === 504
  );
};

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
  let sawTimeout = false;

  try {
    const lyrics = await getLyricsFromOVH(artist, title);
    if (lyrics) return lyrics;
  } catch (error) {
    if (isNetworkError(error)) sawTimeout = true;
    if (error?.response?.status !== 404 && !isNetworkError(error)) {
      throw error;
    }
  }

  try {
    const suggestedLyrics = await getLyricsFromOVHSuggest(artist, title);
    if (suggestedLyrics) return suggestedLyrics;
  } catch (error) {
    if (isNetworkError(error)) sawTimeout = true;
  }

  try {
    const geniusLyrics = await getLyricsFromGenius(artist, title);
    if (geniusLyrics) return geniusLyrics;
  } catch (error) {
    if (isNetworkError(error)) sawTimeout = true;
  }

  if (sawTimeout) {
    throw new Error('TIMEOUT');
  }

  return null;
};
