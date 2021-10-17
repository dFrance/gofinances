import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'

import { LightTheme, DarkTheme } from './src/global/styles/theme'


import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './src/routes/routes';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from './src/screens/Dashboard';
import { Register } from './src/screens/Register';

const { Navigator, Screen } = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  const Tab = createBottomTabNavigator();

  return (
    <ThemeProvider theme={LightTheme}>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  )
}

