import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import SearchBar from './SearchBar';
import { Ionicons } from '@expo/vector-icons';


const { height } = Dimensions.get('window');

const FEATURED_TRACKS = [
  {
    id: 1,
    title: 'Astrothunder',
    artist: 'Travis Scoot',
    image: require('../../assets/Images/RandomCover.png'),
    preview: `ASTROTHUNDER
Travis Scott

(High off life)
(Yeah)

Seem like the life I fiend
Seem like the life I fiend's a little distant, yeah
Seems like the life I need, yeah
Seems like the life I need's a little distant, yeah

Light the remedy, yeah
Sit back while I ride the beat
Do it on repeat, repeat
Sins controllin' me, yeah
Angels, halos over me
I need blessings and my peace
You been out the streets, yeah
Wildin' on me and all my Gs, we been goin' for a week
Now you wanna peek, yeah
Hands up, why they tryna reach? I can't even get that deep
Told you I don't teach (yeah)
Practice, oh, no, never preach
Practice, oh, no, never preach
Infiltrate the enemy, move in on them randomly

Feels like the life I need's a little distant, yeah
Yeah
Feels like the life I need, yeah
Feels like the life I need's a little distant, yeah
Yeah, yeah, yeah' `,
  },
  {
    id: 2,
    title: 'Let It Happen',
    artist: 'Tame Impala',
    image: require('../../assets/Images/RandomCover2.jpg'),
    preview: `Let It Happen
Tame Impala

It's always around me, all this noise
But not nearly as loud as the voice saying
Let it happen, let it happen (it's gonna feel so good)
Just let it happen, let it happen

All this running around
Trying to cover my shadow
A notion growing inside
Now all the others seem shallow
All this running around
Bearing down on my shoulders
I can hear an alarm
Must be morning

I heard about a whirlwind that's coming 'round
It's gonna carry off all that isn't bound and
When it happens, when it happens (I won't be holding on)
So let it happen, let it happen

All this running around
I can't fight it much longer
Something's trying to get out
And it's never been closer
If my take-off fails
Make up some other story
But if I never come back
Tell my mother I'm sorry

I cuh-nuh duh-wuh, you wuh-nuh scri-wih
Try-guh-duh do-wee, try to pun-stoo-wee
You wuh-nuh thinkin' that I wuh-luh do-wee
They be lovin' someone and I wuh-nuh stuh-wee
Take the next ticket to take the next train
Why would I do-wee, eh you wuh tun-tun na

I cuh-nuh duh-wuh, you wuh-nuh scri-wih
Try-guh-duh do-wee, try to pun-stoo-wee
You wuh-nuh thinkin' that I wuh-nuh do-wee
They be lovin' someone and I wuh-luh stuh-wee (baby, now I'm ready, moving on)
Take the next ticket to take the next train (oh, but maybe I was ready all along)
Why would I do-wee, eh you wuh tun-tun na (oh, I'm ready for the moment and the sound)

I cuh-nuh duh-wuh, you wuh-nuh scri-wih (oh, but maybe I was ready all along)
Try-guh-duh do-wee, try to pun-stoo-wee (oh, baby, now I'm ready, moving on)
You wuh-nuh thinkin' that I wuh-luh do-wee (oh, but maybe I was ready all along)
They be lovin' someone and I wuh-nuh stuh-wee (oh, I'm ready for the moment and the sound)
Take the next ticket to take the next train (oh, but maybe I was ready all along)
(Oh, baby)`,
  },
  {
    id: 3,
    title: 'Evil Jordan',
    artist: 'Playboi Carti',
    image: require('../../assets/Images/RandomCover3.jpg'),
    preview: `EVIL J0RDAN
Playboi Carti

Begging on her knees to be popular

First I go whip out the boat
No, I can't hit on no brakes
My life is out of control
I'm tellin' you, nobody safe
I've been livin' my life limbo
My ice, it came with a tray
I'm so high, I gotta hide my face
This not a rockstar phase
I'm a emo thug in my phase
Syrup, syrup, syrup, syrup, tell her to go change
Monkey nuts, hold me, baby, I got on two chains
Roll another blunt and I might motherfuckin' faint
Spin on the block, have a pussy nigga stained
I just put on my boots, ain't worried 'bout no rain
Put a nigga down, Channel 2 front page
You was just askin' for some change, now, you changed?
Yeah, I told you, yeah, about that money, shit get strange
Fully loaded Jag, hold up, baby, Jordan paid
I put duct tape on my switch, perfect aim
They can't put me in no genre, baby, 'cause I changed the game
We fuckin' on the same ho, but we not the same
Disrespect the 5, I put your ass in the food chain (Swamp Izzo)
Bitch keep callin' my phone, she sayin' Ms. Jackson goin' through her brain (Carti)
We was just outside dancin', movin' on molly, feelin' insane (he's comin')
I fucked the bitch so nasty, we go Sephora, yeah, then we go Pink
She not so fuckin' toxic, and she care about what I think
She's nothin' like no other bitches, she care about what I drink
I think she's a fling
I think she's a playmaker
She should be on my team
She should get her a ring
Shit, it can't be me
But she can be on the team
Diamonds, they come out the water
My sock, it come with a ring
The Wraith came with the chauffeur
The chauffeur ready to take me

I am the music`,
  },
  {
    id: 4,
    title: 'Cardigan',
    artist: 'Don Toliver',
    image: require('../../assets/Images/RandomCover4.jpg'),
    preview: `Cardigan
Don Toliver

I'm finna stand tall in it, I'm all in it (uh-uh)
You be on my back like a cardigan (cardigan)
Call her again, I'm in love with your friend (call her again)
We be doing dirt, you hide the evidence (evidence)
It's evident that you ready to ride (ready to ride)
Hop up in my Jeep and put your pride to the side (pride to the side)
Go against the gang, you must be ready to hide (ready to hide)
Swangin' on the corner, bang my tape till it pop (tape till it pop)
I thought I was a goner, pledged to your honor
Burn marijuana, these diamonds is on her
Hotter than the sauna, I met her at Salata
Bought lil baby Prada, she popped it for the dollar

Don't stick around, you should save yourself (save yourself)
But you can hit my phone if you need some help (needed some help)
Don't stick around, you should save yourself (save yourself)
But you can hit my phone if you need some help (needed some help)

I'm finna stand tall in it, I'm all in it (uh-uh)
You be on my back like a cardigan (cardigan)
Call her again, I'm in love with your friend (call her again)
We be doing dirt, you hide the evidence (evidence)
It's evident that you ready to ride (ready to ride)
Hop up in my Jeep and put your pride to the side (pride to the side)
Go against the gang, you must be ready to hide (ready to hide)
Swangin' on the corner, bang my tape till it pop (tape till it pop)
I thought I was a goner, pledged to your honor
Burn marijuana, these diamonds is on her
Hotter than the sauna, I met her at Salata
Bought lil baby Prada, she popped it for the dollar
Don't stick around, you should save yourself (save yourself)
But you can hit my phone if you need some help (needed some help)
Don't stick around, you should save yourself (save yourself)
But you can hit my phone if you need some help (needed some help)

I'm finna stand tall– (tall)
I'm all– (all)
You be on my back like a cardigan (cardigan)
We be doing dirt, you hide the evidence (evidence)
Tall– (tall)
I'm all– (all)
You be on my back like a cardigan
We be doing dirt, you hide the evidence`,
  },
];

export default function EmptyState({
  searchQuery,
  onChangeText,
  onSubmit,
  useMockSearch,
  onToggleMockSearch,
}) {
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handleOpenPreview = (track) => {
    setSelectedTrack(track);
  };

  const handleClosePreview = () => {
    setSelectedTrack(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Lyrics</Text>
        </View>

        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search your favorite songs</Text>
          <SearchBar
            value={searchQuery}
            onChangeText={onChangeText}
            onSubmit={onSubmit}
            containerStyle={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor="#6b6b6b"
            placeholderTextColor="#7a7a7a"
          />
          <TouchableOpacity
            style={[styles.mockToggle, useMockSearch && styles.mockToggleActive]}
            onPress={onToggleMockSearch}
          >
            <Text style={styles.mockToggleText}>
              {useMockSearch ? 'Mock search: ON' : 'Mock search: OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Preview some popular lyrics</Text>
          {FEATURED_TRACKS.map((track) => (
            <BlurView intensity={45} tint="dark" key={track.id} style={styles.card}>
              <View style={styles.cardRow}>
                <Image source={track.image} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={styles.cardArtist} numberOfLines={1}>
                    {track.artist}
                  </Text>
                </View>
                <TouchableOpacity style={styles.cardCta} onPress={() => handleOpenPreview(track)}>
                  <Text style={styles.cardCtaText}>View</Text>
                </TouchableOpacity>
              </View>

            </BlurView>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedTrack}
        transparent
        animationType="fade"
        onRequestClose={handleClosePreview}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={handleClosePreview} />
          <View style={styles.modalContent}>
            <BlurView intensity={35} tint="dark" style={styles.modalGlass}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleBlock}>
                  <Text style={styles.modalTitle} numberOfLines={1}>
                    {selectedTrack?.title}
                  </Text>
                  <Text style={styles.modalArtist} numberOfLines={1}>
                    {selectedTrack?.artist}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleClosePreview} style={styles.modalClose}>
                  <Ionicons name="close-outline" style={styles.modalCloseText} size={34}/>
                </TouchableOpacity>
              </View>

              <View style={styles.modalLyricsBox}>
                <Text
                  style={[
                    styles.modalLyrics,
                    !selectedTrack?.preview && styles.modalLyricsPlaceholder,
                  ]}
                >
                  {selectedTrack?.preview || 'Add lyrics preview here'}
                </Text>
              </View>
            </BlurView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
    minHeight: height - 120,
  },
  header: {
    paddingTop: 6,
    paddingBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  searchSection: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f0f0f0',
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: '#d9d9d9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
  },
  searchInput: {
    color: '#2e2e2e',
    fontWeight: '600',
  },
  mockToggle: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#353535',
  },
  mockToggleActive: {
    backgroundColor: '#333333',
    borderColor: '#777777',
  },
  mockToggleText: {
    color: '#cfcfcf',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  previewSection: {
    marginTop: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 15,
    padding: 12,
    marginBottom: 14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardImage: {
    width: 76,
    height: 76,
    borderRadius: 5,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    
  },
  cardArtist: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6a6a6a',
    marginTop: 2,
  },
  cardCta: {
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
  },
  cardCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ababab',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 2, 2, 0.95)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalGlass: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
    padding: 5,

  },
  modalTitleBlock: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#f7f7f7',
  },
  modalArtist: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cfcfcf',
    marginTop: 4,
  },
  modalClose: {
    paddingVertical: 6,
  },
  modalCloseText: {
    color: '#e5e5e5',
    fontWeight: '600',
  },
  modalLyricsBox: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalLyrics: {
    fontSize: 16,
    lineHeight: 22,
    color: '#f4f4f4',
  },
  modalLyricsPlaceholder: {
    color: '#b5b5b5',
    fontStyle: 'italic',
  },
});
