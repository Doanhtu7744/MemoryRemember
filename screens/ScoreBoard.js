import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import useGameStore from '../store';
import backgroundImage from '../assets/background.png';

export default function ScoreBoard() {
  const [highScores, setHighScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const currentScore = route.params?.score ?? 0;
  const playerName = useGameStore((state) => state.playerName);

  useEffect(() => {
    const scoresRef = ref(database, 'scores');
    onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      const playerScores = {};

      if (data) {
        // Lấy điểm cao nhất của mỗi người chơi
        Object.entries(data).forEach(([key, entry]) => {
          if (!playerScores[entry.playerName] || playerScores[entry.playerName].score < entry.score) {
            playerScores[entry.playerName] = {
              playerName: entry.playerName,
              score: entry.score,
              timestamp: entry.timestamp
            };
          }
        });

        // Kiểm tra và cập nhật điểm cho người chơi hiện tại
        if (currentScore > 0) {
          const existingScore = playerScores[playerName]?.score ?? 0;
          if (currentScore > existingScore) {
            playerScores[playerName] = {
              playerName: playerName,
              score: currentScore,
              timestamp: Date.now()
            };
          }
        }

        // Chuyển đổi object thành mảng và sắp xếp
        const sortedScores = Object.values(playerScores).sort((a, b) => b.score - a.score);
        
        // Thêm rank cho mỗi người chơi
        const rankedScores = sortedScores.map((score, index) => ({
          ...score,
          rank: index + 1,
          isNewScore: score.playerName === playerName && score.score === currentScore
        }));

        setHighScores(rankedScores);
      }
      setLoading(false);
    });
  }, [currentScore, playerName]);

  const handleContinue = () => {
    navigation.navigate('Join', { score: currentScore });
  };

  const renderItem = ({ item }) => {
    const isCurrentPlayer = item.playerName === playerName;
    return (
      <View style={[
        styles.scoreItem,
        isCurrentPlayer && styles.currentPlayer,
        item.isNewScore && styles.newScore
      ]}>
        <Text style={styles.rank}>{item.rank}</Text>
        <Text style={styles.playerName}>{item.playerName}</Text>
        <Text style={styles.score}>{item.score}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <Text style={styles.title}>🏆 High Scores</Text>
      <FlatList
        data={highScores}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No scores yet</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "orange",
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  currentPlayer: {
    backgroundColor: '#e3f2fd',
  },
  newScore: {
    backgroundColor: '#c8e6c9',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 2,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
