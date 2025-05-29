import React from 'react';
import {
    //View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
    StatusBar,
  } from 'react-native';

import useGameStore from '../store';
import logo from '../assets/logo.png';

export default function HomeScreen({ navigation }) {
    const playerName = useGameStore((state) => state.playerName);
    const setPlayerName = useGameStore((state) => state.setPlayerName);
    const addToScoreBoard = useGameStore((state) => state.addToScoreBoard);

    console.log('Zustand store state', useGameStore.getState());
    
      const handleStart = () => {
        console.log('addToScoreBoard',addToScoreBoard);
        console.log('setPlayerName',setPlayerName);
    
        if (!playerName.trim()) {
          Alert.alert('⚠️ Please enter your name!');
        } else {
          setPlayerName(playerName);
          navigation.navigate('Join');
        }
      };
    
    return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Image source={logo} style={styles.logo} />
          <Text style={styles.question}>What is your name?</Text>
    
          <TextInput
            style={styles.input}
            placeholder="Please enter the name"
            value={playerName}
            onChangeText={setPlayerName}
            keyboardType="default"
            textAlign="center"
            autoCapitalize="words"
          />
    
          {playerName?.length > 0 && <Text style={styles.playerNamePreview}>{playerName}</Text>}
    
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
    
          <StatusBar style="auto" />
        </KeyboardAvoidingView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
      },
      logo: {
        width: 200,
        height: 200,
        marginBottom: 10,
        resizeMode: 'contain',
        //marginBottom: 50,
      },
      question: {
        fontSize: 35,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 50,
      },
      input: {
        borderBottomWidth: 1,
        borderColor: '#aaa',
        width: '100%',
        fontSize: 20,
        paddingVertical: 10,
        marginBottom: 10,
      },
      playerNamePreview: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      startButton: {
        backgroundColor: '#87CEEB',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 150,
        marginButtom: 30,
      },
      buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
      },
    });
    