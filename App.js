import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import StartScreen from "./screens/StartScreen";
import GameScreen from "./screens/GameScreen";
import GameOverScreen from "./screens/GameOverScreen";
import ScoreBoard from './screens/ScoreBoard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Join" component={StartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Game" component={GameScreen} /> 
        <Stack.Screen name="GameOver" component={GameOverScreen} /> 
        <Stack.Screen name="ScoreBoard" component={ScoreBoard}  options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}