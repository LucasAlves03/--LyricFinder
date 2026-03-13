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

const normalizeTitle = (title) => {
  if (!title) return title;
  let cleaned = title.trim();

  cleaned = cleaned.replace(/\s*\[[^\]]*\]\s*/g, ' ');
  cleaned = cleaned.replace(/\s*\([^)]*\)\s*/g, ' ');

  const dashParts = cleaned.split(/\s[-–—]\s/);
  if (dashParts.length > 1) {
    const suffix = dashParts.slice(1).join(' ').toLowerCase();
    if (
      /(remaster|live|acoustic|mix|version|edit|radio|mono|stereo|deluxe|bonus|demo)/.test(suffix)
    ) {
      cleaned = dashParts[0];
    }
  }

  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
};

const normalizeArtist = (artist) => {
  if (!artist) return artist;
  let cleaned = artist.trim();
  cleaned = cleaned.replace(/\s*(feat\.?|featuring|with)\s.+$/i, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
};

const buildCandidatePairs = (artist, title) => {
  const pairs = [];
  const original = { artist, title };
  const cleanedTitle = normalizeTitle(title);
  const cleanedArtist = normalizeArtist(artist);

  pairs.push(original);
  pairs.push({ artist, title: cleanedTitle });
  pairs.push({ artist: cleanedArtist, title });
  pairs.push({ artist: cleanedArtist, title: cleanedTitle });

  const seen = new Set();
  return pairs.filter((pair) => {
    if (!pair.artist || !pair.title) return false;
    const key = `${pair.artist.toLowerCase()}::${pair.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
  const candidates = buildCandidatePairs(artist, title);

  try {
    for (const candidate of candidates) {
      try {
        const response = await axios.get(
          `https://api.lyrics.ovh/v1/${encodeURIComponent(candidate.artist)}/${encodeURIComponent(candidate.title)}`,
          { timeout: 8000 }
        );

        if (response.data.lyrics) {
          return response.data.lyrics;
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          continue;
        }
        throw error;
      }
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const getLyricsFromOVHSuggest = async (artist, title) => {
  try {
    const queryVariants = [
      `${artist} ${title}`,
      `${normalizeArtist(artist)} ${normalizeTitle(title)}`,
    ].filter(Boolean);

    for (const query of queryVariants) {
      const response = await axios.get(
        `https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`,
        { timeout: 8000 }
      );

      const results = response.data?.data || [];
      for (const result of results.slice(0, 5)) {
        const resultArtist = result?.artist?.name;
        const resultTitle = result?.title;
        if (!resultArtist || !resultTitle) continue;

        try {
          const lyricsResponse = await axios.get(
            `https://api.lyrics.ovh/v1/${encodeURIComponent(resultArtist)}/${encodeURIComponent(resultTitle)}`,
            { timeout: 8000 }
          );

          if (lyricsResponse.data.lyrics) {
            return lyricsResponse.data.lyrics;
          }
        } catch (error) {
          if (error?.response?.status === 404) {
            continue;
          }
          throw error;
        }
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
