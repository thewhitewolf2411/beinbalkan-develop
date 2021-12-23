import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import CircleButton from './CircleButton';

import {strings} from '../strings/strings';

import {places} from '../helper/enums';

export default class CircleButtonCollection extends Component<{}> {
  handleClick() {
    if (this.props.disabled == false) {
      this.props.clicked();
    }
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={styles.circleButtonView}>
            <CircleButton
              clicked={() => this.props.handleClick(places.SHOP)}
              iconWidth={29}
              iconHeight={25}
              title={strings.shop}
              icon={require('../assets/images/shop.png')}></CircleButton>
          </View>

          <View style={styles.circleButtonView}>
            <CircleButton
              clicked={() => this.props.handleClick(places.ATTRACTIONS)}
              iconWidth={19}
              iconHeight={25}
              title={strings.topAttractions}
              icon={require('../assets/images/attractions.png')}></CircleButton>
          </View>

          <View style={styles.circleButtonView}>
            <CircleButton
              clicked={() => this.props.handleClick(places.HOTELS)}
              iconWidth={25}
              iconHeight={25}
              title={strings.hotels}
              icon={require('../assets/images/hotels.png')}></CircleButton>
          </View>

          <View style={styles.circleButtonView}>
            <CircleButton
              clicked={() => this.props.handleClick(places.RESTAURANTS)}
              iconWidth={25}
              iconHeight={25}
              title={strings.restaurants}
              icon={require('../assets/images/restaurants.png')}></CircleButton>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: 20,
          }}>
          <View style={styles.circleButtonView}>
            <CircleButton
              clicked={() => this.props.handleClick(places.TOURS)}
              iconWidth={15}
              iconHeight={25}
              title={strings.tours}
              icon={require('../assets/images/tours.png')}></CircleButton>
          </View>

          <View style={styles.circleButtonView}>
            <CircleButton
              clicked={() => this.props.handleClick(places.TRANSPORTATION)}
              iconWidth={25}
              iconHeight={25}
              title={strings.transportation}
              icon={require('../assets/images/transportation.png')}></CircleButton>
          </View>

          <View style={styles.circleButtonView}>
            <CircleButton
              clicked={() => this.props.handleClick(places.EXPLORE)}
              iconWidth={25}
              iconHeight={25}
              title={strings.explore}
              icon={require('../assets/images/explore.png')}></CircleButton>
          </View>

          <View style={styles.circleButtonView}>
            <CircleButton
              clicked={() => this.props.handleClick(places.DICTIONARY)}
              iconWidth={19}
              iconHeight={25}
              title={strings.dictionary}
              icon={require('../assets/images/dictionary.png')}></CircleButton>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circleButtonView: {
    width: 80,
    height: 100,
  },
});
