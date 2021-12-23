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
  COLOR_PRIMARY_DARK_ORANGE_TEXT,
  COLOR_PRIMARY_GREY_TEXT,
} from '../assets/colors/colors';

export default class OrangeButton extends Component<{}> {
  handleClick(prop) {
    this.props.clicked(prop.control);
  }

  render() {
    return (
      <View style={styles.submit} opacity={this.props.disabled ? 0.5 : 1}>
        {this.props.items.map((prop, key) => {
          return (
            <View
              key={'locationicon' + key}
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={this.props.disabled ? 1 : 0.5}
                onPress={() => this.handleClick(prop)}
                underlayColor="#fff"
                style={{marginLeft: 20, marginRight: 20}}>
                <Text style={[styles.submitText, this.props.textStyle]}>
                  {prop.title}
                </Text>
                <Text style={[styles.subtitleText, this.props.textStyle]}>
                  {prop.subtitle}
                </Text>
              </TouchableOpacity>
              {prop.title !=
                this.props.items[this.props.items.length - 1].title && (
                <View
                  style={{
                    width: 2,
                    height: 35,
                    backgroundColor: COLOR_PRIMARY_GREY_TEXT,
                  }}></View>
              )}
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  submit: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: COLOR_PRIMARY_DARK_ORANGE_TEXT,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#FAFAFA',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '800',
  },
  subtitleText: {
    color: COLOR_PRIMARY_GREY_TEXT,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '500',
  },
});
