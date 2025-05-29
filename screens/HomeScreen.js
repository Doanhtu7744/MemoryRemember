import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>What is your name?</Text>
      <Button
        title="Đi đến Hồ Sơ"
        onPress={goToProfile}
      />
    </View>
  );
}

export default HomeScreen;