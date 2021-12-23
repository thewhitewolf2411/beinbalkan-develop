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
import CircleButtonCollection from '../components/CircleButtonCollection';
import InteractiveMapButton from '../components/InteractiveMapButton';
import OrangeButton from '../components/OrangeButton';

import {strings} from '../strings/strings';
import AsyncImageAnimated from 'react-native-async-image-animated';

import MapboxGL, {
  MapView,
  PointAnnotation,
  Callout,
  Camera,
} from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGFtaXJidHMiLCJhIjoiY2tvc2gxY2hsMDFlNzJvbGxwMjRyN2dkNiJ9.TvANOBK4-E8ixFwoz4BZTw',
);

export default class RestaurantPage extends Component {
  constructor(props) {
    super(props);
    const item = this.props.route.params.item;

    this.state = {
      displayMap: false,
      initialRender: true,
      coordinate: [
        parseFloat(item.lon),
        parseFloat(item.lat),
        item.nazivEn,
        item.naziv,
        item.category,
        item.id,
      ],
      coordinates: [
        [
          parseFloat(item.lon),
          parseFloat(item.lat),
          item.nazivEn,
          item.naziv,
          item.category,
          item.id,
        ],
      ],
    };

    this.annotationRef = null;
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      const item = this.props.route.params.item;

      this.setState({
        displayMap: false,
        coordinate: [
          parseFloat(item.lon),
          parseFloat(item.lat),
          item.nazivEn,
          item.naziv,
          item.category,
          item.id,
        ],
        coordinates: [
          [
            parseFloat(item.lon),
            parseFloat(item.lat),
            item.nazivEn,
            item.naziv,
            item.category,
            item.id,
          ],
        ],
      });
    });
  }
  componentWillUnmount() {
    this.setState({
      displayMap: false,
    });
    this.unsubscribe();
  }

  buttonClicked = value => {
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
    let phone = this.formatTelNumber(number);
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
    Linking.canOpenURL(web)
      .then(supported => {
        if (!supported) {
          Alert.alert('URL is not available');
        } else {
          Linking.openURL(web);
        }
      })
      .catch(err => console.log(err));
  };
  backClicked = () => {

    this.setState({
      displayMap: false,
    });
    const {goBack} = this.props.navigation;
    goBack('MainPage');
    return true;
  };

  handleClick(item) {}

  renderAnnotation(counter, coordinates) {

    const HackMarker = ({ children }) =>
    Platform.select({
        ios: children,
        android: (
            <Text
                style={{
                    width: 40,
                    lineHeight: 66
                }}>
                {children}
            </Text>
        ),
    })

    const id = `pointAnnotation${counter}`;
    const coordinate = [coordinates[0], coordinates[1]];
    //console.log(coordinate);
    let key = coordinates[0] + '' + coordinates[1];
    if (key) {
      key = key.replace('.', '');
      key = key.replace(',', '');
      key = key.replace('.', '');
      key = key.replace(',', '');
    } else {
      key = 'coord' + counter;
    }
    // console.log('key', key);
    const itemId = coordinates[5];
    const item = coordinates[6];
    const category = coordinates[4];
    let color = 'black';
    let iconImage = '';
    //map render
    if (category === 'Atrakcije'){color = 'red'; iconImage = require('../assets/images/mapicons/nightMenu.png');}
    if (category === 'Prodavnice'){color = 'green'; iconImage = require('../assets/images/mapicons/marketMenu.png');}
    if (category === 'Restoran'){color = 'blue'; iconImage = require('../assets/images/mapicons/food1.png');}
    if (category === 'Hotel'){color = 'purple'; iconImage = require('../assets/images/mapicons/placeMenu.png');}

    return (
      <MapboxGL.PointAnnotation
        key={'rpage' + key}
        id={'point' + key}
        coordinate={coordinate}
        title={'naslov'}
        onLoad={() => this.annotationRef.refresh()}
        ref={ref => (this.annotationRef = ref)}>
        <HackMarker>
          {<Image source={iconImage} style={{ width: 15, height: 15}}/>}
        </HackMarker>

        {coordinates && coordinates[2] && (
          <MapboxGL.Callout title={coordinates[2]} />
        )}
      </MapboxGL.PointAnnotation>
    );
  }

  renderAnnotations(coordinates) {
    const items = [];
    //console.log('renderAnnotations', coordinates);
    for (let i = 0; i < coordinates.length; i++) {
      items.push(this.renderAnnotation(i, coordinates[i]));
    }

    console.log('renderAnnotations', items);
    return items;
  }

  render() {
    const item = this.props.route.params.item;
    const image = item.slider ? item.slider : item.opSlika;
    const itemName =
      strings.getLanguage() === 'en'
        ? item.nazivEn
          ? item.nazivEn
          : ''
        : item.naziv
        ? item.naziv
        : '';
    let itemDesc = null;
    let telefon = null;
    let email = null;
    let web = null;
    if (item.web) {
      web = item.web;
    }
    if (item.email) {
      email = item.email;
    }
    if (item.telefon) {
      telefon = item.telefon;
    }

    if (item.descriptionEn && item.description) {
      itemDesc =
        strings.getLanguage() === 'en' ? item.descriptionEn : item.description;
    }
    //console.log(itemDesc);

    itemDesc = itemDesc.replace('color:black;', 'color:#7A6046;');
    itemDesc = itemDesc.replace('color: black;', 'color:#7A6046;');
    itemDesc =
      '<style>div,p,a,span{color:#7A6046}</style><div style="color:#7A6046">' +
      itemDesc +
      '</div>';
    const source = {
      html: itemDesc,
    };

    if (itemDesc) {
      itemDesc = itemDesc.replace('<div>', '\n\n');
      itemDesc = itemDesc.replace('</div>', '');
      itemDesc = itemDesc.replace('<br>', '\n\n');
      itemDesc = itemDesc.replace('&nbsp;', '');
      itemDesc = itemDesc.replace('nbsp', '');
      itemDesc = itemDesc.replace('&;', '');
      itemDesc = itemDesc.replace(/<\/?[^>]+(>|$)/g, '');
      itemDesc = itemDesc.trim();
      //itemDesc = "111";
    }

    const coordinate = [this.state.coordinate[0], this.state.coordinate[1]];
    const coordinates = [...this.state.coordinates];
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

        {!this.state.displayMap && (
          <ScrollView>
            <View style={styles.header}>
              <AsyncImageAnimated
                delay={1000}
                animationStyle={'explode'}
                source={{
                  uri: 'https://bib.rutmap.com' + image,
                }}
                placeholderSource={require('../assets/images/item_header_holder.png')}
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
                <Text style={styles.city}>{itemName}</Text>
                <Text style={styles.country}>
                  {this.props.route.params.item.address}
                </Text>
              </LinearGradient>
            </View>
            {telefon && (
              <TouchableOpacity
                style={styles.row}
                onPress={() => this.openPhone(telefon)}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    marginLeft: 20,
                    tintColor: 'gray',
                  }}
                  source={require('../assets/images/phone.png')}></Image>
                <View style={[styles.item]}>
                  <View style={[styles.textContainerItems]}>
                    <Text style={[styles.titleItem]}>{telefon}</Text>
                  </View>
                  <View style={[styles.textContainerItems]}>
                    <Text style={[styles.subtitleItem]}>{strings.phone}</Text>
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
            {email && (
              <TouchableOpacity
                style={styles.row}
                onPress={() => this.openEmail(email)}>
                <Image
                  style={{
                    width: 30,
                    height: 20,
                    marginLeft: 20,
                    tintColor: 'gray',
                  }}
                  source={require('../assets/images/email.png')}></Image>
                <View style={[styles.item]}>
                  <View style={[styles.textContainerItems]}>
                    <Text style={[styles.titleItem]}>{item.email}</Text>
                  </View>
                  <View style={[styles.textContainerItems]}>
                    <Text style={[styles.subtitleItem]}>{strings.email}</Text>
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
            {itemDesc && (
              <Text style={styles.description}>{strings.description}</Text>
            )}
            {itemDesc && (
              <View style={styles.descriptionText}>
                <RenderHtml
                  style={styles.descriptionText}
                  contentWidth={width}
                  source={source}
                />
              </View>
            )}

          </ScrollView>
        )}

        {this.state.displayMap && (
          <MapView
            showUserLocation={true}
            style={styles.map}
            zoomEnabled={true}
            logoEnabled={false}>
            <MapboxGL.UserLocation />
            <Camera
              zoomLevel={12}
              animationMode={'flyTo'}
              animationDuration={1100}
              centerCoordinate={coordinate}
            />

            {coordinates != this.state.coordinates &&
              this.renderAnnotations(coordinates)}
          </MapView>
        )}

        <View style={styles.button}>
          <OrangeButton
            clicked={this.buttonClicked}
            items={[
              {
                control: 'Description',
                title: strings.description,
                subtitle: strings.object,
              },
              {
                control: 'Map',
                title: strings.mapView,
                subtitle: strings.navigation,
              },
            ]}></OrangeButton>
        </View>
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
    color: 'red',
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '400',
    paddingBottom: 100,
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
