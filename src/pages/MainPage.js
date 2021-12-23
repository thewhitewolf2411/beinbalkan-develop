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
  ScrollView,
  Platform,
} from 'react-native';

import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_BROWN,
  COLOR_PRIMARY_DARK_ORANGE_TEXT,
  COLOR_PRIMARY_DARK_BROWN_TEXT,
  COLOR_PRIMARY_ORANGE,
  COLOR_PRIMARY_ORANGE_TRANSPARENT,
} from '../assets/colors/colors';

import LinearGradient from 'react-native-linear-gradient';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import AppNameText from '../components/AppNameText';
import CircleButtonCollection from '../components/CircleButtonCollection';
import InteractiveMapButton from '../components/InteractiveMapButton';

import Icon from 'react-native-vector-icons/AntDesign';

import foodIcon from '../assets/images/mapicons/food1.png';
import marketIcon from '../assets/images/mapicons/marketMenu.png';
import nightIcon from '../assets/images/mapicons/nightMenu.png';
import placeIcon from '../assets/images/mapicons/placeMenu.png';

import {strings} from '../strings/strings';

import {places} from '../helper/enums';

import MapboxGL, {
  MapView,
  PointAnnotation,
  Callout,
  Camera,
} from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGFtaXJidHMiLCJhIjoiY2tvc2gxY2hsMDFlNzJvbGxwMjRyN2dkNiJ9.TvANOBK4-E8ixFwoz4BZTw',
);
export default class MainPage extends Component {
  constructor(props) {
    super(props);
    let city = this.props.route.params.item.city;
    let country = this.props.route.params.item.country;
    let about = this.props.route.params.item.aboutPage;
    this.state = {
      city: city,
      country: country,
      about: about,
      blnDetails: false,
      isSelected: false,
      data: [],
      coordinates: [],
      coordinate: [18.4131, 43.8563],
      displayMap: false,
      dataFiltered: null,
      coordinatesFiltered: null,
      bounds: [],
      status: [],
      boundsPercentage: [],
    };
  }
  componentDidMount() {
    this.getPacks();
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      const data = [...this.props.route.params.data];
      let city = this.props.route.params.item.city;
      let country = this.props.route.params.item.country;
      let about = this.props.route.params.item.aboutPage;
      const dataCoord = [];

      let data2 = [...data]
        .filter(function (item) {
          if (item.city) return item.city.toLowerCase() === city.toLowerCase();
        })
        .map(function (item) {
          dataCoord.push([
            parseFloat(item.lon),
            parseFloat(item.lat),
            item.nazivEn,
            item.naziv,
            item.category,
            item.id,
            item,
          ]);
          return item;
        });
      this.setState({
        data: [...data2],
        city: city,
        about: about,
        country: country,
        coordinates: [...dataCoord],
        coordinate: [18.0, 44.33333],
        // displayMap: false,
        dataFiltered: null,
        coordinatesFiltered: null,
      });
    });
  }

  componentWillUnmount() {
    this.setState({
      data: [],
    });
    this.unsubscribe();
  }

  showDetails = value => {
    this.setState({
      blnDetails: value,
    });
  };

  

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
    let key = coordinates[0] + '' + coordinates[1];
    if (key) {
      key = key.replace('.', '');
      key = key.replace(',', '');
      key = key.replace('.', '');
      key = key.replace(',', '');
    } else {
      key = 'coord' + counter;
    }
    const coordinate = [coordinates[0], coordinates[1]];

    const category = coordinates[4];
    const itemId = coordinates[5];
    const item = coordinates[6];
    let color = 'black';
    let iconImage = '';
    //map render
    if (category === 'Atrakcije'){color = 'red'; iconImage = require('../assets/images/mapicons/nightMenu.png');}
    if (category === 'Prodavnice'){color = 'green'; iconImage = require('../assets/images/mapicons/marketMenu.png');}
    if (category === 'Restoran'){color = 'blue'; iconImage = require('../assets/images/mapicons/food1.png');}
    if (category === 'Hotel'){color = 'purple'; iconImage = require('../assets/images/mapicons/placeMenu.png');}
    return (
      <MapboxGL.PointAnnotation
        key={'mainpage' + key + itemId}
        id={'point' + key}
        coordinate={coordinate}
        onSelected={() => {
          this.displayMap;
          this.setState({
            displayMap: !this.state.displayMap,
          });
          this.props.navigation.navigate('RestaurantPage', {
            item: item,
            navigatedFromMap: true,
          });
        }}
        title={coordinates && coordinates[2] ? coordinates[2] : 'Item'}
        onLoad={() => this.annotationRef.refresh()}
        ref={ref => (this.annotationRef = ref)}>
        <HackMarker>
          {<Image source={iconImage} style={{ width: 15, height: 15}}/>}
        </HackMarker>

        {coordinates && coordinates[2] && (
          <MapboxGL.Callout key={'marker' + key} title={coordinates[2]} />
        )}
      </MapboxGL.PointAnnotation>
    );
  }

  renderAnnotations() {
    const items = [];

    const coords = this.state.coordinatesFiltered
      ? this.state.coordinatesFiltered
      : this.state.coordinates;

    //console.log('cors', coords);
    for (let i = 0; i < coords.length; i++) {
      items.push(this.renderAnnotation(i, coords[i]));
    }

    return items;
  }

  handleMapClick = city => {
    //  console.log('explore', city);
    this.setState({
      displayMap: !this.state.displayMap,
    });
  };
  menuClicked = () => {
    //  console.log('menuClicked');
    this.props.navigation.openDrawer();
  };
  backClicked = () => {
    if (this.state.displayMap) {
      this.setState({displayMap: false});
      return false;
    } else {
      const {goBack} = this.props.navigation;
      goBack();
      return true;
    }
  };

  handleClick = type => {
    //    console.log('handleClick ', type, this.state.data);
    // if (type == places.RESTAURANTS){
    this.props.navigation.navigate('RestaurantsListPage', {
      data: [...this.state.data],
      type: type,
      about: this.state.about,
      city: this.state.city,
      country: this.state.country,
    });
    // }
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

  render() {
    const coordinate = [...this.state.coordinate];
    const coordinates = this.state.coordinatesFiltered
      ? [...this.state.coordinatesFiltered]
      : [...this.state.coordinates];

    const centerCoord =
      coordinates && coordinates[0] && coordinates[0][1]
        ? [coordinates[0][0], coordinates[0][1]]
        : [18.4131, 43.8563];

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
      <SafeAreaView style={styles.container}>
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() => this.backClicked()}>
            <Image
              style={styles.backImage}
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
            {!this.state.displayMap && !this.state.blnDetails && (
              <View>
                <View style={styles.item}>
                  <Image
                    source={this.props.route.params.item.background}
                    style={{width: '100%', height: 160}}></Image>
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
                    <Text style={styles.city}>
                      {this.props.route.params.item.city}
                    </Text>
                    <Text style={styles.country}>
                      {this.props.route.params.item.country}
                    </Text>
                  </LinearGradient>
                </View>

                <TouchableOpacity
                  onPress={() => this.showDetails(true)}
                  style={styles.about}>
                  <Image
                    style={{width: 25, height: 25, marginLeft: 20}}
                    source={require('../assets/images/location.png')}></Image>
                  <Text style={styles.aboutText}>
                    {strings.findMoreAbout + this.props.route.params.item.city}
                  </Text>
                  <Image
                    style={{
                      width: 9,
                      height: 15,
                      position: 'absolute',
                      right: 20,
                    }}
                    source={require('../assets/images/next.png')}></Image>
                </TouchableOpacity>

                <View style={styles.circleButtonView}>
                  <CircleButtonCollection
                    handleClick={type =>
                      this.handleClick(type)
                    }></CircleButtonCollection>
                </View>

                <View style={styles.map}>
                  <Image
                    source={require('../assets/images/map_background.png')}
                    style={{width: '100%', height: 160}}></Image>
                  <View
                    style={{
                      position: 'absolute',
                      width: width - 40,
                      bottom: 0,
                      top: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{width: width - 40}}>
                      <InteractiveMapButton
                        clicked={() =>
                          this.handleMapClick(this.props.route.params.item.city)
                        }
                        city={
                          this.props.route.params.item.city
                        }></InteractiveMapButton>
                    </View>
                  </View>
                </View>

                <View style={{
                    width: '90%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {this.props.route.params.item.city === 'Sarajevo' ? 
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
                  : null}
                  {this.props.route.params.item.city === 'Skopje' ? 
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
                  : null}
                  {this.props.route.params.item.city === 'Pristina' ? 
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
                  : null}
                  {this.props.route.params.item.city === 'Tirana' ? 
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
                  : null}
                </View>

              </View>
            )}

            {!this.state.displayMap && this.state.blnDetails && (
              <View>
                <View style={styles.item}>
                  <Image
                    source={this.state.about.image}
                    style={{width: '100%', height: 160}}></Image>
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
                    <Text style={styles.city}>
                      {this.props.route.params.item.city}
                    </Text>
                    <Text style={styles.country}>
                      {this.props.route.params.item.country}
                    </Text>
                  </LinearGradient>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => this.showDetails(false)}
                    style={styles.about}>
                    <Image
                      style={{width: 25, height: 25, marginLeft: 20}}
                      source={require('../assets/images/location.png')}></Image>
                    <Text style={styles.aboutText}>
                      {strings.returnToListOf +
                        this.props.route.params.item.city}
                    </Text>
                    <Image
                      style={{
                        width: 9,
                        height: 15,
                        position: 'absolute',
                        right: 20,
                      }}
                      source={require('../assets/images/next.png')}></Image>
                  </TouchableOpacity>
                </View>
                <View>
                  {this.state.city === 'Sarajevo' &&
                    (strings.getLanguage() === 'en' ? (
                      <View>
                        <View>
                          <Text style={styles.description}>
                            {'About Sarajevo'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            Sarajevo is the capital of Bosnia and Herzegovina.
                            Sarajevo is the country's administrative, economic,
                            cultural, university and sport center. The City of
                            Sarajevo is made up of four municipalities: Stari
                            Grad, Centar, Novo Sarajevo and Novi Grad and
                            surrounded by the Olympic mountains Bjelasnica,
                            Igman, Jahorina and Trebevic. The average land
                            elevation of the city is 500 m above sea level.{' '}
                            {'\n\n'}
                            Most of the Sarajevo’s tourist attractions are
                            located in the Old Town known as Bascarsija
                            spreading towards the city centre easily reachable
                            on foot and well connected to other parts of the
                            city and to the surrounding mountains and other
                            natural and cultural sites by public transportation.
                            {'\n\n'}
                            The city was founded in the 15th century but bares
                            traces to the Roman period. The harmonized fusion of
                            the medieval, Ottoman, Austro-Hungarian and
                            Socialist period has formulated a certain magic
                            hidden in corners, alleys, roofs, pillars and
                            bridges of the city. The result is a city with a
                            fascinating history and a unique cultural mix.
                            Within one sq kilometer, you will come across four
                            different religious buildings.{'\n\n'}
                            Most of the Sarajevo’s tourist attractions are
                            located in the Old Town known as Bascarsija
                            spreading towards the city centre easily reachable
                            on foot and well connected to other parts of the
                            city and to the surrounding mountains and other
                            natural and cultural sites by public transportation.
                          </Text>

                          <Text style={styles.description}>{'Factsheet'}</Text>
                          <Text style={styles.descriptionText}>
                            Location: Bosnia and Herzegovina {'\n'}
                            Area: 141,5 km² {'\n'}
                            Altitude: 500 m above sea level {'\n'}
                            Climate: Mild continental climate {'\n'}
                            Population: cca 438.000 citizens (291.000 citizens
                            in four City of Sarajevo municipalities; 2013){'\n'}
                            Population ethnic diversity: Bosniaks, Croats,
                            Serbs, Jews and other ethnic groups {'\n'}
                            Time Zone – European Time Zone (GMT +1) {'\n'}
                            Power Supply – The electric supply is 220V with 50Hz
                            frequency {'\n'}
                            Water – It is safe to drink tap water in Sarajevo{' '}
                            {'\n'}
                            Currency: Convertible Mark - international
                            abbreviation is BAM, i.e. KM is used locally
                            (1.96KM=1€; 1KM=3.97¥). Coins: 5, 10, 20 and 50
                            pfennig; 1, 2 and 5 KM; Banknotes: 10, 20, 50, 100
                            and 200 KM.
                          </Text>

                          <Text style={styles.description}>
                            {'Important telephone numbers'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            Police 122 {'\n'}
                            Fire 123 {'\n'}
                            Emergency 124{'\n'}
                            Mountain Rescue +387 61 29 94 43; 121{'\n'}
                            Rescue Club 2000 + 387 61 91 19 11; 062 67 27 72
                            {'\n'}
                            BIHAMK – Road Assistance 1282; (www.bihamk.ba){'\n'}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <View>
                          <Text style={styles.description}>
                            {'关于萨拉热窝(Sarajevo)'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            萨拉热窝是波斯尼亚-黑塞哥维那（Bosnia and
                            Herzegovina）的首都。它是国家的行政、经济、文化、大学和运动中心。该城市由四个行政区构成：
                            Stari Grad, Centar, Novo Sarajevo and Novi
                            Grad，四周被奥林匹克群山环绕：Bjelasnica, Igman,
                            Jahorina and Trebevic。平均海拔高度为500m.{'\n\n'}
                            萨拉热窝的大多数旅游景点都分布在老城区——Bascarsija。游客可以步行或乘坐公共交通游览朝向市中心分布的各景点，或者城市的其他地方，周围的山峰，以及其他自然或文化景点。
                            {'\n\n'}
                            该城市建立于15世纪，但其悠久的历史可以追溯到罗马时期。中世纪、奥斯曼帝国时期、奥匈帝国时期、社会主义时期的和谐融合使得这座城市的各个角落、小巷、房顶、石柱和桥梁都弥漫着一种神奇的魅力。这座城市就是迷人历史和独特文化的结合。方圆一公里范围内，游客将会看到四种不同的宗教建筑
                          </Text>

                          <Text style={styles.description}>{'概况'}</Text>
                          <Text style={styles.descriptionText}>
                            位置：波斯尼亚-黑塞哥维那{'\n'}
                            面积：141,5 km²{'\n'}
                            海拔：500m{'\n'}
                            气候：温带大陆性气候{'\n'}
                            人口： 43.8万 (萨拉热窝四个行政区人口为29.1万; 2013)
                            {'\n'}
                            民族：波斯尼亚人、克罗地亚人、塞尔维亚人、犹太人和其他民族
                            {'\n'}
                            时区：欧洲时区（GMT +1){'\n'}
                            电源：220V 50Hz{'\n'}
                            饮用水：自来水可直接饮用{'\n'}
                            货币：可兑换马克（波黑马克）——国际缩写为BAM，当地称为KM（1.95KM=1€）。硬币有5，10,20,和50芬尼；1，2和5KM；纸币：10,
                            20, 50, 100 和 200 KM。
                          </Text>

                          <Text style={styles.description}>
                            {'重要电话号码'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            警察：122{'\n'}
                            火警：123{'\n'}
                            紧急救援：124{'\n'}
                            山间救护：+387 61 29 94 43; 121{'\n'}
                            救护队：2000 + 387 61 91 19 11; 062 67 27 72{'\n'}
                            BIHAMK（波斯尼亚-黑塞哥维那汽车摩托车俱乐部）——道路救援1282；(www.bihamk.ba)
                          </Text>
                        </View>
                      </View>
                    ))}

                  {this.state.city === 'Skopje' &&
                    (strings.getLanguage() === 'en' ? (
                      <View>
                        <View>
                          <Text style={styles.description}>
                            {'About Skopje'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            North Macedonia’s fascinating capital, Skopje, is
                            one of a kind city-break and foodie destination.
                            With centuries old tradition and a population of
                            almost one million, Skopje is country's political,
                            economic, cultural, university and sport center.
                            Skopje region comprises seventeen municipalities,
                            covering the area of 1812 sq kilometers. With Vardar
                            River running through the city, the River Treska
                            Canyon and Lake Matka natural havens being located
                            just outside the city, and the mountains surrounding
                            Skopje there is a just a perfect cup of nature. The
                            average land elevation of the city is 240 m above
                            sea level.
                            {'\n\n'}
                            This city has been inhabited since 4000 BC, with
                            Neolithic remains found at the Kale Fortress. It has
                            been conquered by many different civilizations from
                            the Illyrians, Romans, Dardanians, Byzantines,
                            Ottoman, Serbians and Bulgarians. Hence, the city is
                            a combination of the past with archaeological sites,
                            old fortresses, old bazaar and cobbled streets, and
                            the 21st eclectic monumental sculptures, amusing new
                            facades and details revealing baroque and
                            neoclassical styles.
                            {'\n\n'}
                            City's tourist and culinary landscape scatters
                            around Skopje’s Old Bazaar. This is an old square
                            dating back to the Ottoman period, and nowadays the
                            largest bazaar in the Western Balkans. And that's
                            not all. The city is a birth place of Mother Teresa
                            and is a home to a small museum witnessing her
                            interesting life.
                          </Text>

                          <Text style={styles.description}>{'Factsheet'}</Text>
                          <Text style={styles.descriptionText}>
                            Location: North Macedonia{'\n'}
                            Area: 571,5 km²{'\n'}
                            Altitude: 270 m above sea level{'\n'}
                            Climate: Continental sub-Mediterranean climate{'\n'}
                            Population: 506.926 citizens (2002){'\n'}
                            Population ethnic diversity: Macedonians, Albanians,
                            Roma and other ethnic groups{'\n'}
                            Time Zone – European Time Zone (GMT +1){'\n'}
                            Power Supply – The electric supply is 230V with 50Hz
                            frequency{'\n'}
                            Water – It is safe to drink tap water in Skopje
                            {'\n'}
                            Currency: Macedonian Denar - international
                            abbreviation is MKD, i.e. ден is used locally (61.30
                            ден = 1€; 7.98 ден = 1¥). Coins: 1, 2, 5, 10 and 50
                            denars; Banknotes: 10, 50, 100, 200, 500, 1000 and
                            2000 denars.
                          </Text>

                          <Text style={styles.description}>
                            {'Important telephone numbers'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            Police 192{'\n'}
                            Fire 193{'\n'}
                            Emergency 194{'\n'}
                            Crisis Management Centre 112{'\n'}
                            AMSM – Road Assistance 196{'\n'}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <View>
                          <Text style={styles.description}>
                            {'关于斯科普里（Skopje)'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            马其顿北部的首都斯科普里是一个绝佳的城市休闲去处和美食胜地。这里历史悠久，人口近百万，是国家的政治、经济、文化、大学和体育中心。斯科普里地区包括17个市，面积1812平方公里。瓦尔达河（Vardar
                            River）流经整个城市，自然风光秀丽的特雷斯卡河峡谷（River
                            Treska Canyon）和马特卡湖（Lake
                            Matka）坐落在城市外围，周围群山环绕，整个城市湖光山色，景致美不胜收。这座城市的平均陆地海拔为240米。
                            {'\n\n'}
                            凯勒堡垒（Kale
                            Fortress）发现的新石器时代的遗迹表明，早在公元前4000年，这里就有人居住。这里曾被多种文明所征服过，包括伊利里亚人、罗马人、达达尼亚人、拜占庭人、奥斯曼人、塞尔维亚人和保加利亚人。因此，这座城市融合了过去考古遗址、古老的堡垒、古老的集市和鹅卵石街道，以及21世纪的不拘一格的纪念雕塑，其崭新而又有趣的外观和细节展现了巴洛克风格和新古典主义风格。
                            {'\n\n'}
                            该市旅游景点和餐厅遍布斯科普里的老集市周围。这个古老的广场，可以追溯到奥斯曼帝国统治时期，现在它是巴尔干半岛西部最大的集市。当然这里远不止有这些。这座城市还是特蕾莎修女（Mother
                            Teresa）的出生地，见证她一生有趣生活的小型博物馆也坐落在这里。
                          </Text>

                          <Text style={styles.description}>{'概况'}</Text>
                          <Text style={styles.descriptionText}>
                            位置：北马其顿{'\n'}
                            面积：5715平方公里{'\n'}
                            海拔：270米{'\n'}
                            气候：大陆性亚地中海气候{'\n'}
                            人口：506.926人（2002年{'\n'}）
                            种族多样性：马其顿人、阿尔巴尼亚人、罗姆人和其他族裔群体
                            {'\n'}
                            时区–欧洲时区（GMT+1{'\n'}）
                            电源-电源为230V，频率为50Hz{'\n'}
                            水源:斯科普里自来水可直接饮用{'\n'}
                            货币：马其顿第纳尔，国际缩写为MKD (61.30ден= 1€;
                            7.98 ден =
                            1¥)。硬币：1、2、5、10和50第纳尔；纸币：10、50、100、200、500、1000和2000第纳尔。
                          </Text>

                          <Text style={styles.description}>
                            {'重要电话号码'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            警察192{'\n'}
                            火警193{'\n'}
                            紧急情况194{'\n'}
                            危机管理中心112{'\n'}
                            AMSM–道路援助196
                          </Text>
                        </View>
                      </View>
                    ))}

                  {this.state.city === 'Tirana' &&
                    (strings.getLanguage() === 'en' ? (
                      <View>
                        <View>
                          <Text style={styles.description}>
                            {'About Tirana'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            Tirana, the capital city of Albania, is the
                            country’s largest city and main industrial centre,
                            with strong metal and food processing, production of
                            textiles, pharmaceuticals and cosmetics industries.
                            The city lies 27 km east of the Adriatic Sea coast
                            and along the Ishm River, at the end of a fertile
                            plain. It was founded in 1614 by a Turkish general,
                            Barkinzade Süleyman Paşa. It was built as a single
                            settlement and over time it became an important
                            trading centre. Tirana has been the capital of
                            Albania since 1920 and has been developing ever
                            since, with new buildings rising from the dust and
                            parks and green areas spreading in all directions,
                            adding new charm to the city. Tirana exudes life and
                            energy thoughout the year.{'\n\n'}
                            The city’s most popular cultural sites revolve
                            around the statue and square dedicated to the
                            Albanian national hero, Skanderberg. Sqanderberg
                            Square was built during the reign of King Zog I
                            (1928 – 1939) according to the design of eminent
                            Italian architects. It is a feast to the eyes packed
                            with museums and other important educational and
                            cultural monuments. Nearby and in other parts of
                            Tirana, an important legacy belonging to the
                            communist era with many bunkers built during the
                            Enver Xohxa reign will entice anyone’s attention.
                          </Text>

                          <Text style={styles.description}>{'Factsheet'}</Text>
                          <Text style={styles.descriptionText}>
                            Location: Albania{'\n'}
                            Area: 1652 km²{'\n'}
                            Altitude: 110 m above sea level{'\n'}
                            Climate: Mediterranean climate{'\n'}
                            Population: 906.166 citizens (instat.gov.al, 2020)
                            {'\n'}
                            Population ethnic diversity: Albanians, Greek, other
                            ethnic groups including Macedonian, Romani, Vlach,
                            Turkish, Italian, and Serbo-Croatian{'\n'}
                            Time Zone – European Time Zone (GMT +1){'\n'}
                            Power Supply – The electric supply is 230V with 50Hz
                            frequency{'\n'}
                            Water – It is not safe to drink tap water in Tirana
                            {'\n'}
                            Currency: Albanian Lek - international abbreviation
                            is ALL, symbol is L (1€=124.2L; 1L=0.008€;
                            1L=0.0626¥).
                            {'\n'} Coins: 5 L, 10 L, 20 L, 50 L, 100 L (1L is
                            rarely used); Banknotes: 200 L, 500 L, 1000 L, 2000
                            L, 5000 L.
                          </Text>

                          <Text style={styles.description}>
                            {'Important telephone numbers'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            Fire: 129{'\n'}
                            Ambulance: 127{'\n'}
                            Road Police: 126{'\n'}
                            Emergency Service Central: 112{'\n'}
                            National Search and Rescue Center: +355 4 22 4 0081
                            {'\n'}
                            nsarc@aaf.mil.al // qkksh@mod.gov.al{'\n'}
                            Fax: +355 4 22 4 0087 // +355 4 22 7 0408{'\n'}
                            Under this SPOC are Air Rescue Coordination Center
                            (ARCC), located in Rinas, Tirana and Maritime Rescue
                            Coordination Center (MRCC) located in Durres.{'\n'}
                            Road Assistance: +355 69 600 2503{'\n'}
                            info@tak-fak.al{'\n'}
                            Street “Shyqyri Bërxolli” No.65.
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <View>
                          <Text style={styles.description}>
                            {'地拉那（Tirana）'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            阿尔巴尼亚首都地拉那是该国最大的城市和主要工业中心，拥有强大的金属和食品加工、纺织、医药和化妆品生产工业。该市位于亚得里亚海（the
                            Adriatic Sea ）海以东27公里处，伊秀河（Ishm
                            River）沿岸，富饶平原的末端。它是由土耳其将军Barkinzade
                            Süleyman
                            Paşa于1614年建立。最初这里仅仅是一个定居点，随着时间的推移，它成为一个重要的贸易中心。地拉那从1920年起就是阿尔巴尼亚的首都，此后不断发展，新建筑拔地而起，公园和绿地遍布各地，为城市增添了新的魅力。地拉那在一年中都散发着生命和活力。
                            {'\n\n'}
                            这座城市最受欢迎的文化遗址都围绕着阿尔巴尼亚民族英雄斯坎德贝格（Skanderberg）的雕像和广场。斯坎德贝格广场是在国王佐格一世（King
                            Zog I
                            1928-1939）统治时期，根据意大利著名建筑师们的设计建造的。这里遍布博物馆和其他重要的教育和文化古迹，令人大饱眼福。在地拉那附近和其他地方，您会被地堡所吸引，它们是属于共产主义时代遗产，在Enver
                            Xohxa统治期间建造。
                          </Text>

                          <Text style={styles.description}>{'概况'}</Text>
                          <Text style={styles.descriptionText}>
                            地点：阿尔巴尼亚{'\n'}
                            面积：1652平方公里{'\n'}
                            海拔：海拔110米{'\n'}
                            气候：地中海气候{'\n'}
                            人口：906166人（2020年{'\n'}）
                            人口种族多样性：阿尔巴尼亚人、希腊人、其他民族，包括马其顿人、罗姆人、瓦拉几人、土耳其人、意大利人和塞尔维亚-克罗地亚人
                            {'\n'}
                            时区–欧洲时区（GMT+1){'\n'}
                            电源-电源为230V，频率为50Hz{'\n'}
                            水-在地拉那喝自来水是不安全的{'\n'}
                            货币：阿尔巴尼亚列克-国际缩写为ALL，符号为L(1€=124.2L;
                            1L=0.008€; 1L=0.0626¥)。 硬币：5 L, 10 L, 20 L, 50
                            L, 100 L (1L很少使用)；纸币：200 L, 500 L, 1000 L,
                            2000 L, 5000 L。
                          </Text>

                          <Text style={styles.description}>
                            {'重要电话号码'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            火警: 129{'\n'}
                            救护车: 127{'\n'}
                            道路警察: 126{'\n'}
                            紧急服务中心： 112{'\n'}
                            国家搜救中心: +355 4 22 4 0081{'\n'}
                            邮箱：nsarc@aaf.mil.al // qkksh@mod.gov.al{'\n'}
                            传真: +355 4 22 4 0087 // +355 4 22 7 0408{'\n'}
                            空中救援协调中心（ARCC），位于里纳斯(Rinas)，地拉那和海上救援协调中心（MRCC）位于杜勒斯Durres。
                            {'\n'}
                            道路援助: 电话： +355 69 600 2503{'\n'}
                            邮箱：info@tak-fak.al{'\n'}
                            地址：Street “Shyqyri Bërxolli” No.65.
                          </Text>
                        </View>
                      </View>
                    ))}

                  {this.state.city === 'Pristina' &&
                    (strings.getLanguage() === 'en' ? (
                      <View>
                        <View>
                          <Text style={styles.description}>
                            {'About Pristina'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            The largest city and the capital of Kosovo is
                            Pristina. This lively city hosts more than 500,000
                            people and is the cultural, economic, and
                            administrative center of the country.{'\n\n'}
                            Pristina is a beautiful city, with a lot in store
                            for tourists. Up until World War II, Pristina simply
                            appeared as an oriental town before becoming the
                            capital city. The oriental appearance, however, was
                            entirely changed as the intensive modernization of
                            the city of Pristina in the period of socialist
                            Yugoslavia had wholly altered the city’s structure
                            including the destroying of the city’s “Old Çarshia”
                            or shopping street along with most of the 18th and
                            19th century city buildings being replaced with new
                            ones. Now, especially in 2019, Pristina has gained
                            international attention for its constant incentives
                            to modernize parts of the city e.g. by planting
                            environmental friendly stools to fight air
                            pollution.{'\n\n'}
                            The old and narrow cobble stone streets along with
                            houses that were made of mud existing at the time
                            were replaced with wide streets, attractive tall
                            buildings, and new modern complexes including the
                            Radio Station, the Press and Publishing Hall, the
                            Television of Pristina, the Assembly Building, the
                            University Library, various Banking centers, and
                            more.{'\n\n'}
                            Pristina is the main high education center for the
                            country of Kosovo while it is home of the Academy of
                            Arts and Sciences in the country where the most
                            important intellectuals are gathered. Pristina is
                            also home to the Institute of History and the
                            Institute of Albanology as well. The NEWBORN
                            sculpture is too located in Pristina, along with the
                            Mother Theresa Statue, and numerous other historical
                            momentums such as mosques, churches, museums and
                            such.{'\n\n'}
                            The trendiest areas of Pristina include the Qafa
                            locality (the neck) which is near the city center,
                            Sheshi-Mother Theresa Boulevard, and Kurrizi (the
                            spine) which include various cafés and other hangout
                            centers, shops, which are Working Hours in tunnels
                            that are built among buildings that are
                            residential,. The beautiful city of Pristina exposes
                            and endures all four dissimilar seasons of the year.
                            The summer season is the most entertaining and
                            thriving period of the year in Kosovo where all of
                            the city’s energy and beauty is revealed. As you
                            walk along the streets of the city during the
                            summer, you will find yourself among many cages,
                            bars, shops, and other hangout centers having fun
                            and blistering healthy laughter and joyful locals.
                            {'\n\n'}
                            Finally, the city of Pristina, although sometimes
                            dusty and disorganized, is known to have delicious
                            food, friendly people, fun venues, an astonishing
                            nightlife, and an overall great lifestyle.
                          </Text>

                          <Text style={styles.description}>{'Factsheet'}</Text>
                          <Text style={styles.descriptionText}>
                            Location: Kosovo{'\n'}
                            Area: 572 km²{'\n'}
                            Altitude: 652 m above sea level{'\n'}
                            Climate: Mild continental climate{'\n'}
                            Population: 500.000 citizens{'\n'}
                            Time Zone – European Time Zone (GMT +1){'\n'}
                            Power Supply – The electric supply is 230V with 50Hz
                            frequency{'\n'}
                            Water – It is safe to drink tap water in Pristina
                            {'\n'}
                            Currency: EUR (€), 1€= 7.76 ¥
                          </Text>

                          <Text style={styles.description}>
                            {'Important telephone numbers'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            General emergencies: 112{'\n'}
                            Police: 192{'\n'}
                            Fire: 193{'\n'}
                            Emergency: 194{'\n'}
                            KTA Road Assistance: 1955{'\n'}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <View>
                          <Text style={styles.description}>
                            {'关于普里什蒂（Pristina）'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            科索沃最大的城市和首都是普里什蒂纳。这座生机勃勃的城市拥有50多万人口，是此地区的文化、经济和行政中心。
                            {'\n\n'}
                            普里什蒂纳是一个风景优美的城市，有很多值得游客参观的地方。在第二次世界大战前，普里什蒂纳只是一个东方城镇而不并是首都。然而，这种东方特色在社会主义南斯拉夫时期彻底发生了改变。这一时期该市密集的现代化改变了原来的城市结构，城市的“旧卡西亚”（Old
                            Çarshia）和商业街被摧毁，
                            18世纪和19世纪的大部分城市建筑也被新建筑所取代。现在，特别是在2019年，普里什蒂纳因其不断鼓励实现现代化而备受国际关注，例如人们在这里放置环保长凳来防治空气污染。
                            {'\n\n'}
                            曾经古老而又狭窄的鹅卵石街道和现存的泥房子被宽阔的街道、漂亮高大建筑和全新的现代综合建筑群所取代。这些建筑群包括广播电台、新闻出版厅、普里什蒂纳电视台、议会大楼、大学图书馆、各种银行中心等。
                            {'\n\n'}
                            普里什蒂纳是科索沃的主要高等教育中心，同时也是该国群英荟萃的文理学院的所在地。这里也有历史研究所和阿尔巴尼亚语言和社会研究所。这里还有新雕塑，特雷莎修女雕像，清真寺、教堂、博物馆等众多其他历史古迹。
                            {'\n\n'}
                            普里什蒂纳最时髦的地区包括靠近市中心的卡法地区（Qafa）（颈部）、谢希-特雷莎修女大道（Sheshi-Mother
                            Theresa
                            Boulevard）和库里茨地区Kurrizi（脊柱）。这里有各种咖啡馆和休闲中心、商店。这些店开在住宅楼之间的隧道中。普里什蒂纳一年四季呈现着不同的美景。夏季是科索沃一年中最好玩的旅游旺季，城市的活力和美丽都得以展现。漫步在夏天城市的街道上，置身于酒吧、商店和休闲中心之中，您可以尽情享受快乐，沐浴健康的笑声和当地人的欢乐。
                            {'\n\n'}
                            普里什蒂纳，虽然有时也会略有灰尘，稍显无序，但众所周知，这里有美味的食物，善良的居民，好玩的场所，丰富的夜生活。总体来说这里的生活方式还是很棒！
                          </Text>

                          <Text style={styles.description}>{'概况'}</Text>
                          <Text style={styles.descriptionText}>
                            地点：科索沃{'\n'}
                            面积：572平方公里{'\n'}
                            海拔：652米{'\n'}
                            气候：温和的大陆性气候{'\n'}
                            人口：50万{'\n'}
                            时区–欧洲时区（GMT+1{'\n'}）
                            电源-电源为230V，频率为50Hz{'\n'}
                            水-在普里什蒂纳自来水可直饮{'\n'}
                            货币：欧元（€），1€=7.76¥{'\n'}
                          </Text>

                          <Text style={styles.description}>
                            {'重要电话号码'}
                          </Text>
                          <Text style={styles.descriptionText}>
                            一般紧急情况：112{'\n'}
                            警察：192{'\n'}
                            消防：193{'\n'}
                            紧急情况：194{'\n'}
                            KTA道路援助：1955{'\n'}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            )}
          </ScrollView>
        )}
        {this.state.displayMap && (
          <MapView
            showUserLocation={true}
            style={styles.mapView}
            zoomEnabled={true}
            logoEnabled={false}>
            <MapboxGL.UserLocation />
            <Camera
              zoomLevel={11}
              animationMode={'flyTo'}
              animationDuration={1100}
              centerCoordinate={centerCoord}
            />

            {this.renderAnnotations()}
          </MapView>
        )}
      </SafeAreaView>
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
  circleButtonView: {
    width: '100%',
    marginTop: 40,
    marginLeft: 20,
    width: width - 40,
  },

  map: {
    marginLeft: 20,
    width: width - 40,
  },
  mapView: {
    flex: 1,
    paddingVertical: 10,
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

  aboutText: {
    color: COLOR_PRIMARY_BROWN,
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '400',
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

  backImage: {
    width: 17,
    height: 29,
    tintColor: COLOR_PRIMARY_BROWN,
  },
  menuImage: {
    width: 30,
    height: 19,
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

  names: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 100,
    justifyContent: 'flex-end',
  },

  topView: {
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
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

  item: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
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
