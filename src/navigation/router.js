import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ChooseLanguagePage from '../pages/ChooseLanguagePage';
import ChooseCityPage from '../pages/ChooseCityPage';
import MainPage from '../pages/MainPage';
import RestaurantsListPage from '../pages/RestaurantsListPage';
import ChineseDictionary from '../pages/ChineseDictionary';
import CreditPage from '../pages/CreditPage';
import SettingsPage from '../pages/SettingsPage';
import FormPage from '../pages/FormPage';


const AppStack = createStackNavigator();

function Router(props) {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <AppStack.Screen
          name="ChooseLanguagePage"
          component={ChooseLanguagePage}
        />
        <AppStack.Screen name="ChooseCityPage" component={ChooseCityPage} />
        <AppStack.Screen name="MainPage" component={MainPage} />
        <AppStack.Screen
          name="RestaurantsListPage"
          component={RestaurantsListPage}
        />
        <AppStack.Screen
          name="ChineseDictionary"
          component={ChineseDictionary}
        />
        <AppStack.Screen
          name="CreditPage"
          component={CreditPage}
        />
        <AppStack.Screen
          name="SettingsPage"
          component={SettingsPage}
        />
        <AppStack.Screen
          name="TopMenu"
          component={TopMenu}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
