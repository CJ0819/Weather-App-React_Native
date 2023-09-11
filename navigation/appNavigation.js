import { LogBox, View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function AppNavigation(){
  return (
   <NavigationContainer>
    <Stack.Navigator>
        <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen}/>
    </Stack.Navigator>
   </NavigationContainer>
  )
}

