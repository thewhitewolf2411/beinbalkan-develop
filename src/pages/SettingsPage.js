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

// import AppNameText from './AppNameText';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import {strings} from '../strings/strings';
import {places} from '../helper/enums';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';

import MapboxGL, {
  MapView,
  PointAnnotation,
  Callout,
  Camera,
} from '@react-native-mapbox-gl/maps';
import TopMenu from '../components/TopMenu';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGFtaXJidHMiLCJhIjoiY2tvc2gxY2hsMDFlNzJvbGxwMjRyN2dkNiJ9.TvANOBK4-E8ixFwoz4BZTw',
);

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bounds: [],
      status: [],
      boundsPercentage: [],
    };
  }

  backClicked = () => {
    const {goBack} = this.props.navigation;
    goBack();
    return true;
  };

  downloadCity = (city, bounds) => {
    MapboxGL.offlineManager.createPack(
      {
        name: 'field-' + city, // any
        bounds: bounds, // any LARGE area
        styleURL: MapboxGL.StyleURL.Street, // any
        minZoom: 12, // I hope, this can be any also
        maxZoom: 16, // I hope, this can be any also
      },
      (pack, status) => {
        console.log(
          '>>>>>>>>>>pack progress',
          pack.name,
          status.percentage,
          status.completedTileCount,
        );
        this.pack = pack;
        const ary = [...this.state.bounds];
        const aryStatus = [...this.state.status];

        if (!ary.includes('field-' + city)) ary.push('field-' + city);
        aryStatus['field-' + city] =
          status && status.percentage && status.percentage >= 0
            ? status.percentage.toFixed(0)
            : 0;
        this.setState({
          bounds: ary,
          status: aryStatus,
        });
      },
      (pack, error) => {
        console.log('>>>>>>>>>>pack error', pack.name, error);
      },
    );
    /*
    setTimeout(() => {
      console.log('>>>>>>>>>>pause pack', this.pack && this.pack.name);
      this.pack && this.pack.pause();
    }, 5000);

    setTimeout(() => {
      console.log('>>>>>>>>>>resume pack', this.pack && this.pack.name);
      this.pack && this.pack.resume();
    }, 15000);
    */
  };
  getPacks = () => {

    const ary = [];
    MapboxGL.offlineManager.setTileCountLimit(1000000);

    const offlinePacks = MapboxGL.offlineManager.getPacks().then(items => {
      if (items && items.length > 0) {
        items.map((item, key) => {
          if (item && item._metadata && item._metadata.name) {
            if (!ary.includes(item._metadata.name)) {
              ary.push(item._metadata.name);
            }
          }
        });
        this.setState({
          bounds: ary,
        });
      }
      //sconsole.log(items);
      console.log('get offlinePacks 2');
      console.log(ary);
    });
  };

  deletePacks = () => {
    MapboxGL.offlineManager.deletePack('field-1');
    MapboxGL.offlineManager.deletePack('field-pristina');
    MapboxGL.offlineManager.deletePack('field-sarajevo');
    MapboxGL.offlineManager.deletePack('field-skopje');
    MapboxGL.offlineManager.deletePack('field-tirana');

    this.setState({
      bounds: [],
      status: [],
    });
  };
  componentDidMount() {

    this.getPacks();
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      const item = this.props.route.params.item;

      this.getPacks();

      this.setState({
        displayMap: false,
      });
    });
  }

  render() {
    const skopjeStatus =
      this.state.status && this.state.status['field-skopje']
        ? this.state.status['field-skopje']
        : this.state.bounds.includes('field-skopje')
        ? 100
        : 0;
    const pristinaStatus =
      this.state.status && this.state.status['field-pristina']
        ? this.state.status['field-pristina']
        : this.state.bounds.includes('field-pristina')
        ? 100
        : 0;
    const tiranaStatus =
      this.state.status && this.state.status['field-tirana']
        ? this.state.status['field-tirana']
        : this.state.bounds.includes('field-tirana')
        ? 100
        : 0;
    const sarajevoStatus =
      this.state.status && this.state.status['field-sarajevo']
        ? this.state.status['field-sarajevo']
        : this.state.bounds.includes('field-sarajevo')
        ? 100
        : 0;
    return (
      <SafeAreaProvider style={styles.container}>
        <TopMenu
         clicked={this.backClicked}/>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={styles.containerCities}>
            <Text style={styles.city}>Sarajevo</Text>
            <Text style={styles.percentage}>{sarajevoStatus} %</Text>
            {sarajevoStatus <= 0 && (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() =>
                  this.downloadCity('sarajevo', [
                    [17.95784, 44.01998],
                    [18.80928, 43.76762],
                  ])
                }>
                <Text style={styles.textDownload}>{strings.download}</Text>
                <Icon name="download" size={25} color={COLOR_PRIMARY_ORANGE} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.containerCities}>
            <Text style={styles.city}>Skopje</Text>
            <Text style={styles.percentage}>{skopjeStatus} %</Text>
            {skopjeStatus <= 0 && (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() =>
                  this.downloadCity('skopje', [
                    [21.21357, 42.05974],
                    [21.63929, 41.92961],
                  ])
                }>
                <Text style={styles.textDownload}>{strings.download}</Text>
                <Icon name="download" size={25} color={COLOR_PRIMARY_ORANGE} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.containerCities}>
            <Text style={styles.city}>Pristina</Text>
            <Text style={styles.percentage}>{pristinaStatus} %</Text>
            {pristinaStatus <= 0 && (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() =>
                  this.downloadCity('pristina', [
                    [20.94715, 42.72734],
                    [21.37287, 42.59859],
                  ])
                }>
                <Text style={styles.textDownload}>{strings.download}</Text>
                <Icon name="download" size={25} color={COLOR_PRIMARY_ORANGE} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.containerCities}>
            <Text style={styles.city}>Tirana</Text>
            <Text style={styles.percentage}>{tiranaStatus}%</Text>
            {tiranaStatus <= 0 && (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() =>
                  this.downloadCity('tirana', [
                    [19.6027, 41.39613],
                    [20.02842, 41.26465],
                  ])
                }>
                <Text style={styles.textDownload}>{strings.download}</Text>
                <Icon name="download" size={25} color={COLOR_PRIMARY_ORANGE} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{flex: 1, padding: 20}}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => this.deletePacks()}>
            <Text style={styles.textRemove}>{strings.removeMaps}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PRIMARY_GREY,
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
  city: {
    marginLeft: 5,
    color: COLOR_PRIMARY_WHITE,
    fontSize: 24,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '800',
    width: '45%',
  },
  containerCities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLOR_PRIMARY_BROWN,
    borderRadius: 15,
    marginVertical: 15,
  },
  removeButton: {
    borderColor: COLOR_PRIMARY_ORANGE,
    backgroundColor: COLOR_PRIMARY_WHITE,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
  textRemove: {
    fontSize: 17,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '800',
    color: COLOR_PRIMARY_ORANGE,
  },
  downloadButton: {
    borderWidth: 2,
    borderColor: COLOR_PRIMARY_ORANGE,
    backgroundColor: COLOR_PRIMARY_WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 5,
  },
  textDownload: {
    fontSize: 17,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '800',
    color: COLOR_PRIMARY_ORANGE,
    paddingRight: 10,
  },
  percentage: {
    fontSize: 24,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '800',
    color: COLOR_PRIMARY_WHITE,
    width: '20%',
  },
});
