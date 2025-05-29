import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import useGameStore from '../store';

import backgroundImage from '../assets/background.png';
import groupBg from '../assets/Group.png';
import CenterImage from '../assets/Center.png';

export default function StartScreen({ navigation }) {
  const previousNumber = useGameStore((state) => state.previousNumber);
  const setPreviousNumber = useGameStore((state) => state.setPreviousNumber);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;
  const centerImageAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const number = Math.floor(Math.random() * 990) + 10;
    setPreviousNumber(number);
    console.log(`StartScreen number: ${number}`);

    Animated.spring(titleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.delay(300),
      Animated.spring(numberAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(600),
      Animated.spring(centerImageAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePlayPress = () => {
  
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('Game');
    });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <Animated.View
        style={{
          transform: [
            {
              scale: titleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ],
          opacity: titleAnim,
        }}
      >
        <Text style={styles.title}>Number Chain</Text>
      </Animated.View>

      {previousNumber !== null && (
        <Animated.View
          style={{
            transform: [
              {
                scale: numberAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: numberAnim,
          }}
        >
          <ImageBackground source={groupBg} style={styles.groupContainer} resizeMode="contain">
            <Text style={styles.rememberText}>Remember this number</Text>
            <Text style={styles.numberText}>{previousNumber}</Text>
          </ImageBackground>
        </Animated.View>
      )}

      <Animated.View
        style={{
          transform: [
            {
              scale: centerImageAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: centerImageAnim,
        }}
      >
        <Image source={CenterImage} style={styles.Center} />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{ scale: buttonScaleAnim }],
        }}
      >
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={handlePlayPress}
        >
          <Text style={styles.playButtonText}>Got it! Play Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, alignItems: 'center', paddingTop: 60 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#0076A3', marginBottom: 80 },
  groupContainer: { width: 300, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: -40 },
  rememberText: { fontSize: 20, color: 'white', fontWeight: 'bold', marginBottom: 5 },
  numberText: { fontSize: 60, color: '#fff', fontWeight: 'bold' },
  Center: { width: 250, height: 250, resizeMode: 'contain', marginBottom: 70 },
  playButton: { backgroundColor: '#FF9149', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10, elevation: 3 },
  playButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
