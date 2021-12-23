import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_BROWN,
  COLOR_PRIMARY_ORANGE,
  COLOR_PRIMARY_BROWN_DARK,
} from '../assets/colors/colors';

import {strings} from '../strings/strings';

export default class InteractiveMapButton extends Component<{}> {
  handleClick() {
    // if (this.props.disabled == false) {
    //console.log('handleClick');

    this.props.clicked(this.props.city);
    // }
  }

  render() {
    return (
      <TouchableOpacity style={styles.about} onPress={() => this.handleClick()}>
        <Image
          style={{width: 25, height: 25, marginLeft: 20}}
          source={require('../assets/images/compass.png')}></Image>
        <View>
          <Text style={styles.aboutText}>{strings.interactiveMap}</Text>
          <Text style={styles.cityText}>{this.props.city}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  about: {
    backgroundColor: COLOR_PRIMARY_WHITE,
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLOR_PRIMARY_BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 23.0,
    elevation: 4,
  },

  aboutText: {
    color: COLOR_PRIMARY_BROWN_DARK,
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '800',
  },

  cityText: {
    color: COLOR_PRIMARY_BROWN_DARK,
    fontSize: 13,
    marginLeft: 10,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '400',
  },
});
