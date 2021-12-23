import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';

import qs from 'qs';

import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Marker from '../components/icons/Marker';
import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_BROWN,
  COLOR_PRIMARY_ORANGE,
  COLOR_PRIMARY_DARK_ORANGE_TEXT,
  COLOR_PRIMARY_DARK_BROWN_TEXT,
} from '../assets/colors/colors';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import AppNameText from '../components/AppNameText';
import CircleButtonCollection from '../components/CircleButtonCollection';
import InteractiveMapButton from '../components/InteractiveMapButton';
import OrangeButton from '../components/OrangeButton';

import {strings} from '../strings/strings';
import AsyncImageAnimated from 'react-native-async-image-animated';
import { TextInput } from 'react-native-gesture-handler';

export default class FormPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayMap: false,
      initialRender: true,
      chosenDate: new Date(),
      name: '',
      surname: '',
      email: '',
      telephone: '',
      message: '',
    };

    this.annotationRef = null;
    this.setDate = this.setDate.bind(this);
    //this.sendEmail = this.sendEmail.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleSurename = this.handleSurename.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleTelephone = this.handleTelephone.bind(this);
    this.handleMessage = this.handleMessage.bind(this);

  }

  setDate(newDate) {
    this.setState({chosenDate: newDate});
  }

  componentWillUnmount() {
    this.setState({
      displayMap: false,
    });
  }

  handleName = (e) => {
    this.setState({name: e});
  }

  handleSurename = (e) => {
    this.setState({surname: e});
  }

  handleEmail = (e) => {
    this.setState({email: e});
  }

  handleTelephone = (e) => {
    this.setState({telephone: e});
  }

  handleMessage = (e) => {
    this.setState({message: e});
  }

  sendEmail = async (to, subject, body) => {
    console.log(to, subject, body);

  let url = `mailto:${to}`;

  // Create email link query
  const query = qs.stringify({
      subject: subject,
      body: body,
  });

  if (query.length) {
      url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
      throw new Error('Provided URL can not be handled');
  }

  return Linking.openURL(url);
}

  openWeb = url => {
    let web = this.getValidUrl(url);
    //let web = url;
    console.log('url', web);
    Linking.openURL(web).catch(err => {
      console.error('Failed opening page because: ', err);
    });
  };
  backClicked = () => {
    const {goBack} = this.props.navigation;
    goBack();
    return true;
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() => this.backClicked()}>
            <Image
                style={styles.menuImage}
                source={require('../assets/images/back_button.png')}
            />
            </TouchableOpacity>

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
                }}
                />
            </View>
            <Text style={styles.subtitleText}>{strings.weKnowBalkan}</Text>
            </View>
        </View>
        <ScrollView>
            <View style={styles.aboutText}>
              <Text>Please fill out all required fields, add details of your visit including dates and number of persons in your message, and click on SEND. </Text>
            </View>

            <View style={styles.about}>
              
            <TextInput
                style={styles.textInput}
                placeholder="Name"
                placeholderTextColor={COLOR_PRIMARY_BROWN}
                selectionColor={COLOR_PRIMARY_BROWN}
                value={this.state.name}
                onChangeText={this.handleName}
            />
            </View>
            <View style={styles.about}>
            <TextInput
                style={styles.textInput}
                placeholder="Surname"
                placeholderTextColor={COLOR_PRIMARY_BROWN}
                selectionColor={COLOR_PRIMARY_BROWN}
                value={this.state.surname}
                onChangeText={this.handleSurename}
            />
            </View>
            <View style={styles.about}>
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor={COLOR_PRIMARY_BROWN}
                selectionColor={COLOR_PRIMARY_BROWN}
                value={this.state.email}
                onChangeText={this.handleEmail}
            />
            </View>
            <View style={styles.about}>
            <TextInput
                style={styles.textInput}
                placeholder="Telephone"
                placeholderTextColor={COLOR_PRIMARY_BROWN}
                selectionColor={COLOR_PRIMARY_BROWN}
                value={this.state.telephone}
                onChangeText={this.handleTelephone}
            />
            </View>
            <View style={styles.aboutFull}>
            <TextInput
                style={styles.textInput}
                placeholder="Message"
                placeholderTextColor={COLOR_PRIMARY_BROWN}
                selectionColor={COLOR_PRIMARY_BROWN}
                value={this.state.message}
                onChangeText={this.handleMessage}
            />
            </View>
            <TouchableOpacity onPress={() => this.sendEmail('info@t-mapper.com', 'Tour', this.message)}>
              <Text style={styles.descriptionText}>Send</Text>
          </TouchableOpacity>
        </ScrollView>


      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLOR_PRIMARY_GREY,
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
      titleText: {
        height: 40,
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
      menuImage: {
        width: 17,
        height: 29,
        tintColor: COLOR_PRIMARY_BROWN,
      },
      aboutText: {
        height: 80,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
      },
      about: {
        backgroundColor: COLOR_PRIMARY_WHITE,
        height: 40,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
      },
      aboutFull:{
        backgroundColor: COLOR_PRIMARY_WHITE,
        height: 140,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
      },
    textInput: {
        height: 40,
        width: '100%',
        color: COLOR_PRIMARY_BROWN,
        fontFamily: 'SourceSansPro-Light',
        fontWeight: '400',
        fontSize: 16,
        marginLeft: 10,
      },
      descriptionText: {
        marginTop: 30,
        marginLeft: 20,
        width: width - 40,
        color: COLOR_PRIMARY_DARK_BROWN_TEXT,
        fontSize: 15,
        fontFamily: 'SourceSansPro-Regular',
        fontWeight: '400',
        // paddingBottom: 100,
      },
  });
  

