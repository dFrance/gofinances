import React from 'react';
import { StatusBar, Platform } from 'react-native'
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
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
import { CategorySelect } from './src/screens/CategorySelect';

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
        {Platform.OS === 'ios' &&
          <StatusBar barStyle="light-content" />
        }
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  )
}

