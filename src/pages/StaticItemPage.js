/* eslint-disable no-unused-vars */
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
import RenderHtml from 'react-native-render-html';

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

import LinearGradient from 'react-native-linear-gradient';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import AppNameText from '../components/AppNameText';


import {strings} from '../strings/strings';
import AsyncImageAnimated from 'react-native-async-image-animated';

export default class StaticItemPage extends Component {
  constructor(props) {
    super(props);
    const item = this.props.route.params.item;

    this.state = {
      displayMap: false,
      initialRender: true,
    };

    this.annotationRef = null;
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      const item = this.props.route.params.item;

      this.setState({
        displayMap: false,
      });
    });
  }
  componentWillUnmount() {
    this.setState({
      displayMap: false,
    });
    this.unsubscribe();
  }

  onInquiryPressed() {
    this.props.navigation.navigate('FormPage');
  }

  buttonClicked = value => {
    // console.log('clicked ', value);
    if (value === 'Description') {
      this.setState({
        displayMap: false,
      });
    } else {
      if(this.state.displayMap){
        this.setState({
          displayMap: false,
        });
        return;
      }
      else{
        this.setState({
          displayMap: true,
        });
      }
    }
  };
  openEmail = email => {
    Linking.openURL(
      'mailto:' +
        email +
        '?subject=Contact from Balkan Travel Mapper&body=Description',
    );
  };
  openPhone = number => {
    // console.log('callNumber ----> ', number);

    let phone = this.formatTelNumber(number);
    // console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };
  formatTelNumber = phoneNumberString => {
    return '+' + phoneNumberString.replace(/\D/g, '');
  };

  getValidUrl = (url = '') => {
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, '');

    if (/^(:\/\/)/.test(newUrl)) {
      return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
      return `http://${newUrl}`;
    }

    return newUrl;
  };
  openWeb = url => {
    let web = this.getValidUrl(url);
    //let web = url;
    console.log('url', web);
    Linking.openURL(web).catch(err => {
      console.error('Failed opening page because: ', err);
    });
    /*
    Linking.canOpenURL(web)
      .then(supported => {
        if (!supported) {
          Alert.alert('URL is not available');
        } else {
          Linking.openURL(web);
        }
      })
      .catch(err => console.log(err));
      */
  };
  backClicked = () => {
    const {goBack} = this.props.navigation;
    goBack();
    return true;
  };

  handleClick(item) {}

  render() {
    const item = this.props.route.params.item;
    const main = this.props.route.params.main;
    const imageFrom = this.props.route.params.image
      ? this.props.route.params.image
      : null;
    let image = null;

    if (item.picture) {
      image = item.picture;
    } else {
      if (imageFrom) image = imageFrom;
      else image = require('../assets/images/tours_main_photo.jpg');
    }
    let ads = '';
    let title = '';
    let inquiry = '';
    let description = '';
    let picture = '';
    let email = '';
    let sendInquiry = '';
    let web = null;
    if (item.link) {
      web = item.link;
    }
    if (item.title) {
      title = item.title;
    }
    if (item.description) {
      description = item.description;
    }
    if (item.ads) {
      ads = item.ads;
    }
    if (item.inquiry) {
      inquiry = item.inquiry;
    }
    if (item.email) {
      email = item.email;
    }
    if (item.picture) {
      picture = item.picture;
    }
    if (item.sendInquiry) {
      sendInquiry = item.sendInquiry;
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() => this.backClicked()}>
            <Image
              style={styles.menuImage}
              source={require('../assets/images/back_button.png')}></Image>
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
                }}></AppNameText>
            </View>
            <Text style={styles.subtitleText}>{strings.weKnowBalkan}</Text>
          </View>
        </View>

        <ScrollView>
          <View style={styles.header}>
            <AsyncImageAnimated
              delay={1000}
              animationStyle={'explode'}
              source={image}
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                width: '100%',
                height: 400,
              }}
            />
            <LinearGradient
              colors={[
                'rgba(0,0,0,0.8)',
                'rgba(0,0,0,0.8)',
                'rgba(0,0,0,0.6)',
                'rgba(0,0,0,0.4)',
                'rgba(0,0,0,0.0)',
              ]}
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}
              style={styles.names}>
              {/* <Text style={styles.city}>{title}</Text> */}
            </LinearGradient>
          </View>

          {web && (
            <TouchableOpacity
              style={styles.row}
              onPress={() => this.openWeb(web)}>
              <Image
                style={{
                  width: 27,
                  height: 32,
                  marginLeft: 20,
                  tintColor: 'gray',
                }}
                source={require('../assets/images/link.png')}></Image>
              <View style={[styles.item]}>
                <View style={[styles.textContainerItems]}>
                  <Text style={[styles.titleItem]}>{web}</Text>
                </View>
                <View style={[styles.textContainerItems]}>
                  <Text style={[styles.subtitleItem]}>{strings.web}</Text>
                </View>
              </View>
              <Image
                style={{
                  width: 10,
                  height: 17,
                  position: 'absolute',
                  right: 20,
                  tintColor: 'gray',
                }}
                source={require('../assets/images/next_button.png')}></Image>
            </TouchableOpacity>
          )}
          {description && (
            <View>
              <Text style={styles.description}>{item.title}</Text>
              <Text style={styles.descriptionText}>{description}</Text>
              <Text style={styles.descriptionText}>{inquiry}</Text>
              <TouchableOpacity onPress={() => this.onInquiryPressed()}>
                <Text style={styles.descriptionText}>{sendInquiry}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.openEmail(email)}>
                <Text style={styles.descriptionText}>{email}</Text>
              </TouchableOpacity>


            </View>
            
          )}

          <View style={{paddingBottom: 30}}>
            {main &&
              main.ads &&
              main.ads.map((adsItem, adsKey) => {
                return (
                  <TouchableOpacity onPress={() => this.openWeb(adsItem.link)}>
                    <View style={[styles.headerAdd]}>
                      <Image
                        style={{width: width * 0.9, height: (width/1.777)*0.9, borderRadius: 20}}
                        source={adsItem.picture}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
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
  containerMarker: {
    alignItems: 'center',
    width: moderateScale(100),
    backgroundColor: 'transparent',
    height: moderateScale(100),
  },
  textContainerMarker: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textMarker: {
    textAlign: 'center',
    paddingHorizontal: moderateScale(5),
    flex: 1,
  },
  iconMarker: {
    paddingTop: moderateScale(10),
    width: 45,
    height: 45,
  },
  map: {
    flex: 1,
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
    marginTop: 30,
    marginLeft: 20,
    width: width - 40,
    color: COLOR_PRIMARY_DARK_BROWN_TEXT,
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '400',
    // paddingBottom: 100,
  },
  button: {
    marginLeft: 40,
    width: width - 80,
    position: 'absolute',
    bottom: 40,
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
    marginBottom: 10,
  },

  header: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },

  headerAdd: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    width: width * 0.9, 
    height: (width/1.777)*0.9,
    display: 'flex',
    borderRadius: 10
  },

  country: {
    marginBottom: 20,
    marginLeft: 15,
    color: COLOR_PRIMARY_WHITE,
    fontSize: 13,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '400',
  },

  city: {
    marginLeft: 15,
    color: COLOR_PRIMARY_WHITE,
    fontSize: 16,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '600',
  },

  names: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 100,
    justifyContent: 'flex-end',
  },

  row: {
    height: 70,
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 20,
    width: width - 40,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },

  titleItem: {
    color: COLOR_PRIMARY_BROWN,
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '600',
  },

  item: {
    //flexDirection: 'row',
  },
  textContainerItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '85%',
  },
  subtitleItem: {
    width: '100%',
    marginTop: 5,
    color: COLOR_PRIMARY_DARK_ORANGE_TEXT,
    fontSize: 11,
    marginLeft: 10,
    flexWrap: 'wrap',
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '400',
  },
});
