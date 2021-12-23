/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';

import Router from './src/navigation/router';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import ChooseLanguagePage from './src/pages/ChooseLanguagePage';
import ChooseCityPage from './src/pages/ChooseCityPage';
import ChineseDictionary from './src/pages/ChineseDictionary';
import TermsandConditionsBalkanTravelMapper from './src/pages/TermsandConditionsBalkanTravelMapper';
import TermsandConditionsBalkanTravelMapperKIN from './src/pages/TermsandConditionsBalkanTravelMapperKIN';

import MainPage from './src/pages/MainPage';
import SideMenu from './src/components/SideMenu';
import RestaurantsListPage from './src/pages/RestaurantsListPage';
import RestaurantPage from './src/pages/RestaurantPage';
import StaticItemPage from './src/pages/StaticItemPage';
import CreditPage from './src/pages/CreditPage';
import SettingsPage from './src/pages/SettingsPage';
import FormPage from './src/pages/FormPage';

const AppStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <SideMenu {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Drawer.Screen
          options={{swipeEnabled: false}}
          name="ChooseLanguagePage"
          component={ChooseLanguagePage}
        />
        <Drawer.Screen
          options={{swipeEnabled: true}}
          name="ChooseCityPage"
          component={ChooseCityPage}
        />
        <Drawer.Screen
          options={{swipeEnabled: true}}
          name="ChineseDictionary"
          component={ChineseDictionary}
        />
        <Drawer.Screen name="MainPage" component={MainPage} />
        <Drawer.Screen
          options={{swipeEnabled: false}}
          name="RestaurantsListPage"
          component={RestaurantsListPage}
        />
        <Drawer.Screen
          options={{swipeEnabled: false}}
          name="RestaurantPage"
          component={RestaurantPage}
        />
        <Drawer.Screen
          options={{swipeEnabled: false}}
          name="StaticItemPage"
          component={StaticItemPage}
        />
        <Drawer.Screen
          options={{swipeEnabled: false}}
          name="TermsandConditionsBalkanTravelMapper"
          component={TermsandConditionsBalkanTravelMapper}
        />
        <Drawer.Screen
          options={{swipeEnabled: false}}
          name="TermsandConditionsBalkanTravelMapperKIN"
          component={TermsandConditionsBalkanTravelMapperKIN}
        />
         <Drawer.Screen
          options={{swipeEnabled: false}}
          name="CreditPage"
          component={CreditPage}
        />
         <Drawer.Screen
          options={{swipeEnabled: false}}
          name="SettingsPage"
          component={SettingsPage}
        />
         <Drawer.Screen
          options={{swipeEnabled: false}}
          name="FormPage"
          component={FormPage}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
