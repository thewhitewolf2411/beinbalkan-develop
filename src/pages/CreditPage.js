import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

import TopMenu from '../components/TopMenu';

import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_DARK_BROWN_TEXT,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_BROWN,
  COLOR_PRIMARY_ORANGE,
  COLOR_PRIMARY_DARK_ORANGE_TEXT,
} from '../assets/colors/colors';

import {strings} from '../strings/strings';
import {places} from '../helper/enums';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class CreditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  handleClick(type) {
    //  console.log(type);

    this.props.route.params(item, {});
  }

  backClicked = () => {
    const {goBack} = this.props.navigation;
    goBack();
    return true;
  };

  render() {
    return (
      <ScrollView>
        <TopMenu
          clicked={this.backClicked}
          items={[
            {title: strings.description, subtitle: strings.object},
            {title: strings.mapView, subtitle: strings.navigation},
          ]}></TopMenu>
        <View style={styles.background}>
          <Text style={styles.descriptionText}>
            Credit Page/致敬{'\n\n'}
            We thank the people, companies and organizations listed below for
            supporting in our efforts to bring this app to life!{'\n\n'}
            我们感谢以下人物、公司和组织为此款手机应用程序的推出所做的努力！
            {'\n\n'}
            Alban Rafuna – BeInBalkan CEO{'\n\n'}
            Diar Ramadani{'\n\n'}
            Tao Yang 陶杨 our Official Translator{'\n\n'}
            RCC{'\n\n'}
            Tourism Association of Bosnia and Herzegovina{'\n\n'}
            Skopje City{'\n\n'}
            Kruševo Municipality{'\n\n'}
            Pixabay
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
});
