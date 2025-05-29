import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Animated } from 'react-native';
import backgroundImage from '../assets/background.png';
import useGameStore from '../store';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebaseConfig';

export default function GameOverScreen({ navigation, route }) {
  const score = route?.params?.score ?? 0;
  const playerName = useGameStore((state) => state.playerName);
  const setScore = useGameStore((state) => state.setScore);

  // Khởi tạo các giá trị animation
  const titleAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const scoreBoxAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Lưu điểm số lên Firebase
    const saveScore = async () => {
      try {
        const scoresRef = ref(database, 'scores');
        const newScoreRef = push(scoresRef);
        await set(newScoreRef, {
          playerName: playerName,
          score: score,
          timestamp: Date.now()
        });
        console.log('Score saved successfully:', { playerName, score });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    };

    if (playerName && score > 0) {
      saveScore();
    }

    // Animation cho tiêu đề
    Animated.spring(titleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Animation cho điểm số
    Animated.spring(scoreAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
      delay: 300,
    }).start();

    // Animation nhấp nháy cho khung điểm số
    Animated.loop(
      Animated.sequence([
        Animated.timing(scoreBoxAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scoreBoxAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [score, playerName, scoreAnim, scoreBoxAnim, titleAnim]);

  const handlePlayAgain = () => {
    // Animation khi nhấn nút Play Again
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
      // Reset điểm về 0 trước khi chuyển màn hình
      setScore(0);
      navigation.navigate('ScoreBoard', { score });
    });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Animated.View style={{
          transform: [{ scale: titleAnim }],
          opacity: titleAnim
        }}>
          <Text style={styles.title}>Game Over 😢</Text>
        </Animated.View>

        <Animated.View style={{
          transform: [{ translateY: scoreAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0]
          })}],
          opacity: scoreAnim
        }}>
          <Text style={styles.scoreText}>Your Score</Text>
        </Animated.View>

        <Animated.View style={[
          styles.scoreBox,
          {
            transform: [{ scale: scoreBoxAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05]
            })}],
            backgroundColor: scoreBoxAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#ffe082', '#ffd54f']
            })
          }
        ]}>
          <Text style={styles.score}>{score}</Text>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={handlePlayAgain}
          >
            <Text style={styles.playAgainText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#e53935',
    marginBottom: 50,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 30,
    color: '#37474f',
    marginBottom: 20,
  },
  scoreBox: {
    backgroundColor: '#ffe082',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 80,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f57f17',
  },
  playAgainButton: {
    backgroundColor: '#43a047',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  playAgainText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
  