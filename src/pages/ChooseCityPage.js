import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  Permissions,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_ORANGE,
  COLOR_PRIMARY_BROWN,
} from '../assets/colors/colors';
import TopMenu from '../components/TopMenu';

import {axiosInstance} from '../config/axios';

import {strings} from '../strings/strings';

import LinearGradient from 'react-native-linear-gradient';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import AppNameText from '../components/AppNameText';

import {FlatGrid} from 'react-native-super-grid';
import NetworkUtils from '../helper/NetworkUtills';

const DATA = [
  {
    city: 'Sarajevo',
    country: 'Bosnia and Herzegovina',
    aboutPage: {
      image: require('../assets/images/sarajevoabout.jpg'),
    },

    background: require('../assets/images/sarajevoabout.jpg'),
  },
  {
    city: 'Skopje',
    country: 'North Macedonia',
    aboutPage: {
      image: require('../assets/images/skopjeabout.jpg'),
    },

    background: require('../assets/images/skople_background.png'),
  },
  {
    city: 'Pristina',
    country: 'Kosovo',
    aboutPage: {
      image: require('../assets/images/pristina.jpg'),
    },

    background: require('../assets/images/pristina.jpg'),
  },
  {
    city: 'Tirana',
    country: 'Albania',
    aboutPage: {
      image: require('../assets/images/tiranaabout.jpg'),
    },
    background: require('../assets/images/tirana.jpg'),
  },
];

export default class ChooseCityPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingError: false,
      isLoading: false,
      data: [],
      firstLoad: true,
    };
  }
  backClicked = () => {
    const {goBack} = this.props.navigation;
    goBack();
    return true;
  };

  menuClicked = () => {
   this.props.navigation.openDrawer();
 };

  _storeData = async data => {
    try {
      await AsyncStorage.setItem('beindata', data);
      this.setState({
        isLoading: false,
      });
      this._retrieveData();
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();

      if (this.state.firstLoad && isConnected) {
        this.setState(
          {
            isLoading: true,
            firstLoad: false,
          },
          () => {
            this.getItems();
          },
        );
      } else {
        const value = await AsyncStorage.getItem('beindata');
        if (value !== null) {
          let ary = [];
          this.setState({isLoading: false, data: JSON.parse(value)});
        } else {
          this.setState(
            {
              isLoading: true,
              firstLoad: false,
            },
            () => {
              this.getItems();
            },
          );
        }
      }
    } catch (error) {
      this.setState({
        loadingError: true,
        isLoading: false,
      });
    }
  };
  async getItems(blnFirst = false) {
    let config = {};
    //let config = {vheaders: {Authorization: 'Bearer ' + token}};

    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();

      // console.log('is connected', isConnected);
      if (isConnected) {
        const response = await axiosInstance.get(
          'vsapi.php?action=objects',
          config,
        );

        this.setState({
          loadingError: false,
        });

        this._storeData(JSON.stringify(response.data.data));
      } else {
        alert('Please check your internet connection!');
      }
    } catch (error) {
      // console.log(error);
      this.setState({
        loadingError: true,
        isLoading: false,
      });
      //  console.log(error);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // console.log('usao');

      if (Platform.OS === 'android') {
        // console.log('usao1 ');

        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'GPSLocation',
            message: 'Please enable your location services',
          },
        );
        // console.log('usao2 ');
      }

      // console.log('nema zovi _retrieveData');

      this._retrieveData();
    });

    //this.getItems(this.props.token);
  }

  onCitySelected(item) {
    this.props.navigation.navigate('MainPage', {
      item: item,
      data: [...this.state.data],
    });
  }

  renderItem(item) {
    var image = require('../assets/images/sarajevoabout.jpg');
    switch (item.city) {
      case 'Sarajevo':
        image = require('../assets/images/sarajevoabout.jpg');
        break;

      case 'Skopje':
        image = require('../assets/images/Skoplje.png');
        break;

      case 'Tirana':
        image = require('../assets/images/tirana.jpg');
        break;

      case 'Pristina':
        image = require('../assets/images/pristina.jpg');
        break;

      case 'Podgorica':
        image = require('../assets/images/Podgorica.png');
        break;

      default:
        break;
    }
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => this.onCitySelected(item)}>
        <Image
          resizeMode="cover"
          source={image}
          style={{width: '100%', height: '100%'}}></Image>
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.8)',
            'rgba(0,0,0,0.8)',
            'rgba(0,0,0,0.4)',
            'rgba(0,0,0,0.1)',
            'rgba(0,0,0,0.0)',
          ]}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          style={styles.names}>
          <Text style={styles.city}>{item.city}</Text>
          <Text style={styles.country}>{item.country}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#5DB075" />
        </View>
      );
    } else
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.topView}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() => this.menuClicked()}>
            <Image
              style={styles.menuImage}
              source={require('../assets/images/menu.png')}></Image>
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

          <Text style={[styles.goText,{alignSelf:'center'}]}>{strings.whereToGo}</Text>

          <FlatGrid
            style={{marginTop: 30}}
            itemDimension={130}
            data={DATA}
            renderItem={({item}) => this.renderItem(item)}
          />
        </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
  loadingWrapper: {flex: 1, alignItems: 'center', justifyContent: 'center'},

  container: {
    flex: 1,
    backgroundColor: COLOR_PRIMARY_GREY,
    // alignItems: 'center',
  },

  titleText: {
    marginLeft: 0
  },

  names: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 100,
    justifyContent: 'flex-end',
  },

  country: {
    marginBottom: 20,
    marginLeft: 5,
    color: COLOR_PRIMARY_WHITE,
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '400',
  },

  city: {
    marginLeft: 5,
    color: COLOR_PRIMARY_WHITE,
    fontSize: 24,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '800',
  },

  subtitleText: {
    color: COLOR_PRIMARY_BROWN,
    fontSize: 12,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '400',
  },

  goText: {
    color: COLOR_PRIMARY_BROWN,
    textAlign: 'center',
    fontSize: 32,
    width: 250,
    marginTop: 20,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '700',
  },

  item: {
    height: Math.min(230, height / 4),
    borderRadius: 20,
    overflow: 'hidden',
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
    width: 25,
    height: 29,
    tintColor: COLOR_PRIMARY_BROWN,
  },
  topView: {
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  topViewLeft: {
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
