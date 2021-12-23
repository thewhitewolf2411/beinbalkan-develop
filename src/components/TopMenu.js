import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
} from 'react-native';


import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_DARK_BROWN_TEXT,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_BROWN,
  COLOR_PRIMARY_ORANGE,
  COLOR_PRIMARY_DARK_ORANGE_TEXT,
} from '../assets/colors/colors';

import AppNameText from './AppNameText';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


import {strings} from '../strings/strings';
import {places} from '../helper/enums';

export default class TopMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  menuClicked = () => {
    
     console.log('menuClicked');
     this.props.clicked(); // ne radi , rijesit cu veceras 
  };
  backClicked = () => {
    this.props.clicked();
  };
  render() {
    let hideText = false;
    if (this.props.hideText) {
      hideText = true;
    }
    return (
      <View style={hideText ? styles.topViewLeft : styles.topView}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => this.backClicked()}>
          <Image
            style={styles.menuImage}
            source={require('../assets/images/back_button.png')}></Image>
        </TouchableOpacity>

        {!hideText && (
          <View
            style={{
              flexDirection: 'column',
              marginLeft: 10,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
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
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PRIMARY_GREY,
  },
  description: {
    marginTop: 30,
    marginLeft: 20,
    color: COLOR_PRIMARY_DARK_ORANGE_TEXT,
    fontSize: 22,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '700',
  },
  descriptionText: {
    marginTop: 10,
    marginLeft: 20,
    width: width - 40,
    color: COLOR_PRIMARY_DARK_BROWN_TEXT,
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '400',
    paddingBottom: 10,
  },
  menu: {
    width: 52,
    height: 52,
    backgroundColor: COLOR_PRIMARY_WHITE,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  button: {
    marginLeft: 40,
    width: width - 80,
    position: 'absolute',
    bottom: 40,
  },

  menuImage: {
    width: 25,
    height: 29,
    tintColor: COLOR_PRIMARY_BROWN,
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
  topView: {
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },

  topViewLeft: {
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  row: {
    height: 'auto',
    flexDirection: 'row',
    backgroundColor: 'white',
    marginLeft: 20,
    width: width - 40,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  item: {
    marginLeft: 15,
    width: '70%',
  },

  titleItem: {
    color: COLOR_PRIMARY_BROWN,
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '600',
  },

  subtitleItem: {
    marginTop: 5,
    color: COLOR_PRIMARY_DARK_ORANGE_TEXT,
    fontSize: 11,
    marginLeft: 10,
    width: '80%',
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '400',
  },

  header: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },

  country: {
    marginBottom: 20,
    marginLeft: 15,
    color: COLOR_PRIMARY_WHITE,
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '400',
  },

  city: {
    marginLeft: 15,
    color: COLOR_PRIMARY_WHITE,
    fontSize: 24,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '800',
  },

  names: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 100,
    justifyContent: 'flex-end',
  },
});
