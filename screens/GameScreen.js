import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ImageBackground, Animated, Platform } from 'react-native';
import useGameStore from '../store';
import backgroundImage from '../assets/background.png';
import explainImage from '../assets/explain.png';

export default function GameScreen({ navigation }) {
  const {
    displayNumber,
    setDisplayNumber,
    previousNumber,
    setPreviousNumber,
    score,
    setScore,
    playerName,
    addToScoreBoard,
  } = useGameStore();

  const [options, setOptions] = useState([]);
  const [timer, setTimer] = useState(() => {
    if (score <= 10) return 10;
    if (score <= 20) return 8;
    if (score <= 40) return 6;
    return 4;
  });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasRecordedScore, setHasRecordedScore] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const numberScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const progressBarWidth = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);
  const mountedRef = useRef(true);
  const animationRef = useRef(null);

  const styles = useMemo(() => StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    topWrapper: { paddingTop: 50, paddingHorizontal: 20 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    levelText: { fontSize: 18, fontWeight: 'bold', color: '#004d40' },
    progressBarBackground: { 
      width: '100%', 
      height: 10, 
      backgroundColor: '#cfd8dc', 
      borderRadius: 5,
      overflow: 'hidden'
    },
    progressBarFill: { 
      height: '100%', 
      backgroundColor: '#4fc3f7', 
      borderRadius: 5,
      width: '100%',
      transformOrigin: 'left'
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#004d40', marginBottom: 30 },
    displayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20, position: 'relative' },
    explainContainer: { position: 'absolute', left: 20 },
    explainImage: { width: 90, height: 90, resizeMode: 'contain', marginLeft: -15, marginBottom: 20 },
    numberContainer: { width: '100%', alignItems: 'center' },
    displayNumber: { fontSize: 70, fontWeight: 'bold', color: '#004d40', textAlign: 'center' },
    questionText: { fontSize: 18, marginBottom: 20 },
    grid: { alignItems: 'center', justifyContent: 'center', gap: 10 },
    row: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
    button: { width: 180, height: 80, margin: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
    buttonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  }), []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const getRandomNumber = useCallback((exclude) => {
    let num;
    if (score <= 10) {
      do {
        num = Math.floor(Math.random() * 990) + 10; // 10-999
      } while (num === exclude);
    } else if (score <= 20) {
      do {
        num = Math.floor(Math.random() * 1000) + 1000; // 1000-1999
      } while (num === exclude);
    } else if (score <= 40) {
      do {
        num = Math.floor(Math.random() * 8000) + 2000; // 2000-9999
      } while (num === exclude);
    } else {
      do {
        num = Math.floor(Math.random() * 90000) + 10000; // 10000-99999
      } while (num === exclude);
    }
    return num;
  }, [score]);

  const generateOptions = useCallback((correctNumber) => {
    const options = [correctNumber];
    while (options.length < 6) {
      const rand = getRandomNumber(correctNumber);
      if (!options.includes(rand)) options.push(rand);
    }
    return options.sort(() => Math.random() - 0.5);
  }, [getRandomNumber]);

  const startGame = useCallback(() => {
    if (!mountedRef.current) return;
    const newNumber = getRandomNumber(previousNumber);
    setDisplayNumber(newNumber);
    const newOptions = generateOptions(previousNumber);
    setOptions(newOptions);
  }, [getRandomNumber, generateOptions, previousNumber, setDisplayNumber]);

  const startTimer = useCallback(() => {
    if (!mountedRef.current) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (!mountedRef.current) {
        clearInterval(timerRef.current);
        return;
      }
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (timer === 0 && !isGameOver && mountedRef.current) {
      handleEndGame('⏰ Time out!', 'You did not answer in time.');
    }
  }, [timer, isGameOver, handleEndGame]);

  useEffect(() => {
    if (!isGameOver && mountedRef.current) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameOver, startTimer]);

  const handleEndGame = useCallback((title, message) => {
    if (!mountedRef.current) return;
    setIsGameOver(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (!hasRecordedScore) {
      console.log('Attempting to call addToScoreBoard');
      console.log('Type of addToScoreBoard:', typeof addToScoreBoard);
      addToScoreBoard(playerName, score);
      setHasRecordedScore(true);
    }

    Alert.alert(title, message, [
      {
        text: 'OK',
        onPress: () => navigation.navigate('GameOver', { score }),
      },
    ]);
  }, [hasRecordedScore, addToScoreBoard, playerName, score, navigation]);

  const animateNumber = useCallback(() => {
    if (!mountedRef.current) return;
    if (animationRef.current) {
      animationRef.current.stop();
    }
    animationRef.current = Animated.sequence([
      Animated.timing(numberScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(numberScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);
    animationRef.current.start();
  }, [numberScale]);

  const animateButton = useCallback((scale) => {
    if (!mountedRef.current) return;
    Animated.spring(buttonScale, {
      toValue: scale,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  const animateProgressBar = useCallback(() => {
    if (!mountedRef.current) return;
    const maxTime = score <= 10 ? 10 : score <= 20 ? 8 : score <= 40 ? 6 : 4;
    Animated.timing(progressBarWidth, {
      toValue: timer / maxTime,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progressBarWidth, timer, score]);

  useEffect(() => {
    if (mountedRef.current) {
      animateNumber();
      animateProgressBar();
    }
  }, [displayNumber, timer, animateNumber, animateProgressBar]);

  const handleAnswer = useCallback((selected) => {
    if (!mountedRef.current || isGameOver) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setSelectedAnswer(selected);
    const isCorrect = selected === previousNumber;

    animateButton(0.95);
    const timeoutId = setTimeout(() => {
      if (!mountedRef.current) return;
      animateButton(1);
      if (isCorrect) {
        console.log('Current display number:', displayNumber);
        const newScore = score + 1;
        setScore(newScore);
        // Set timer based on new score
        if (newScore <= 10) {
          setTimer(10);
        } else if (newScore <= 20) {
          setTimer(8);
        } else if (newScore <= 40) {
          setTimer(6);
        } else {
          setTimer(4);
        }
        setPreviousNumber(displayNumber);
        setSelectedAnswer(null);
        setOptions(generateOptions(displayNumber));
        const nextNumber = getRandomNumber(displayNumber);
        setDisplayNumber(nextNumber);
        startTimer();
      } else {
        handleEndGame('❌ Wrong Answer!', 'That was not the correct number.');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isGameOver, previousNumber, score, displayNumber, animateButton, handleEndGame, getRandomNumber, generateOptions, setScore, setPreviousNumber, setDisplayNumber, startTimer]);

  // Memoize button render
  const renderButton = useCallback((option, index) => (
    <Animated.View
      key={index}
      style={{
        transform: [{ scale: selectedAnswer === option ? buttonScale : 1 }]
      }}
    >
      <TouchableOpacity
        onPress={() => handleAnswer(option)}
        disabled={selectedAnswer !== null}
        style={[
          styles.button,
          {
            backgroundColor:
              selectedAnswer === null
                ? '#2196f3'
                : option === previousNumber
                ? 'green'
                : 'red',
          },
        ]}
      >
        <Text style={styles.buttonText}>{option}</Text>
      </TouchableOpacity>
    </Animated.View>
  ), [selectedAnswer, buttonScale, handleAnswer, previousNumber, styles]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.topWrapper}>
        <View style={styles.topBar}>
          <Text style={styles.levelText}>Score: {score}</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <Animated.View 
            style={[
              styles.progressBarFill, 
              {
                transform: [{
                  scaleX: progressBarWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                  })
                }]
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Remember this number</Text>
        <View style={styles.displayRow}>
          <View style={styles.explainContainer}>
            <Image source={explainImage} style={styles.explainImage} />
          </View>
          <View style={styles.numberContainer}>
            <Animated.Text 
              style={[
                styles.displayNumber,
                {
                  transform: [{ scale: numberScale }]
                }
              ]}
            >
              {displayNumber}
            </Animated.Text>
          </View>
        </View>

        <Text style={styles.questionText}>Which number has appeared before</Text>
        <View style={styles.grid}>
          {[0, 1, 2].map((row) => (
            <View key={row} style={styles.row}>
              {[0, 1].map((col) => {
                const index = row * 2 + col;
                const option = options[index];
                return renderButton(option, index);
              })}
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}
