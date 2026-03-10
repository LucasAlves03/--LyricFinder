import SearchScreen from '../screens/SearchScreen';

const DEFAULT_TRACK_DATA = {
  title: 'Let It Happen',
  artist: 'Tame Impala',
  album: 'Currents',
  albumArt: require('../../assets/Images/RandomCover2.jpg'),
};

const DEFAULT_LYRICS =
`It's always around me, all this noise
But not nearly as loud as the voice saying
"Let it happen, let it happen"`;

export default function SearchTabPreview({ trackData, lyrics }) {
  return (
    <SearchScreen
      mockMode
      mockData={trackData || DEFAULT_TRACK_DATA}
      mockLyrics={lyrics || DEFAULT_LYRICS}
    />
  );
}
