import PropTypes from 'prop-types';
import React, {Component} from 'react';
//import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {StackNavigator} from 'react-navigation';
import AppNameText from './AppNameText';
import {strings} from '../strings/strings';

import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_BROWN,
  COLOR_PRIMARY_DARK_ORANGE_TEXT,
  COLOR_PRIMARY_DARK_BROWN_TEXT,
  COLOR_PRIMARY_ORANGE,
} from '../assets/colors/colors';

class SideMenu extends Component {
  navigateToScreen = route => () => {
    //const navigateAction = NavigationActions.navigate({
    //  routeName: route
    // });
    this.props.navigation.navigate(route, {});
  };

  render() {
    const language = strings.getLanguage();

    return (
      <View style={styles.container}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'column',
              marginLeft: 10,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginBottom: 20,
            }}>
            <View style={styles.titleText}>
              <AppNameText
                textStyle={{
                  color: COLOR_PRIMARY_ORANGE,
                  fontSize: 25,
                }}></AppNameText>
            </View>
            <Text style={styles.subtitleText}>{strings.weKnowBalkan}</Text>
          </View>
          {/*<View style={styles.navSectionStyle}>
            <Text
              style={styles.navItemStyle}
              onPress={this.navigateToScreen('ChineseDictionary')}>
              {strings.dictionary}
            </Text>
          </View>*/}
          <View style={styles.navSectionStyle}>
            {language === 'en' && (
              <Text
                style={styles.navItemStyle}
                onPress={this.navigateToScreen(
                  'TermsandConditionsBalkanTravelMapper',
                )}>
                Terms and Conditions Balkan Travel Mapper
              </Text>
            )}
            {language !== 'en' && (
              <Text
                style={styles.navItemStyle}
                onPress={this.navigateToScreen(
                  'TermsandConditionsBalkanTravelMapperKIN',
                )}>
                Terms and Conditions Balkan Travel Mapper 中国人
              </Text>
            )}
          </View>

          <View style={styles.navSectionStyle}>
            <Text
              style={styles.navItemStyle}
              onPress={this.navigateToScreen('CreditPage')}>
              {strings.creditPage}
            </Text>
          </View>
          <View style={styles.navSectionStyle}>
            <Text
              style={styles.navItemStyle}
              onPress={this.navigateToScreen('SettingsPage')}>
              {strings.settingsPage}
            </Text>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text></Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  navItemStyle: {
    padding: 10,
  },
  navSectionStyle: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  titleText: {
    height: 40,
  },

  subtitleText: {
    color: COLOR_PRIMARY_BROWN,
    fontSize: 12,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '400',
  },
});

SideMenu.propTypes = {
  navigation: PropTypes.object,
};

export default SideMenu;
