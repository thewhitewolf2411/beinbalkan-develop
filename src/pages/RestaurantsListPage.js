import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';

import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_DARK_BROWN_TEXT,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_BROWN,
  COLOR_PRIMARY_ORANGE,
  COLOR_PRIMARY_DARK_ORANGE_TEXT,
} from '../assets/colors/colors';

import LinearGradient from 'react-native-linear-gradient';

import {staticData} from '../helper/data';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import AppNameText from '../components/AppNameText';
import OrangeButton from '../components/OrangeButton';
import AsyncImageAnimated from 'react-native-async-image-animated';
import {strings} from '../strings/strings';
import {places} from '../helper/enums';

import MapboxGL, {MapView, Camera} from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGFtaXJidHMiLCJhIjoiY2tvc2gxY2hsMDFlNzJvbGxwMjRyN2dkNiJ9.TvANOBK4-E8ixFwoz4BZTw',
);

export default class RestaurantsListPage extends Component {
  constructor(props) {
    super(props);
    let city = this.props.route.params.city;
    let country = this.props.route.params.country;
    let about = this.props.route.params.about;

    let category = this.props.route.params.type;
    let blnInfoPage = false;
    if (category === 'transportation') {
      blnInfoPage = true;
    }
    if (category === 'explore') {
      blnInfoPage = false;
    }
    if (category === 'tours') {
      blnInfoPage = false;
    }
    this.state = {
      data: [],
      coordinates: [],
      coordinate: [18.0, 44.33333],
      type: category,
      city: city,
      about: about,
      displayMap: false,
      blnInfoPage: blnInfoPage,
      country,
      blnSearch: false,
      isChecked: false,
      searchValue: '',
      dataFiltered: null,
      coordinatesFiltered: null,
    };
    this.scrollListReftop = null;
  }

  setSearch = value => {
    this.setState({searchValue: value});
  };
  showSearch = value => {
    this.setState({
      blnSearch: value,
    });
  };

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
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
        if (this.scrollListReftop) {
          this.scrollListReftop.scrollTo({x: 0, y: 0, animated: true});
        }
  
        const data = [...this.props.route.params.data];
        let city = this.props.route.params.city;
        let country = this.props.route.params.country;
        let about = this.props.route.params.about;
  
        let category = this.props.route.params.type;
  
        let blnInfoPage = false;
        const dataCoord = [];
        if (category === 'dictionary') {
          blnInfoPage = true;
        }
        if (category === 'transportation') {
          blnInfoPage = true;
        }
        if (category === 'explore') {
          blnInfoPage = false;
        }
        if (category === 'tours') {
          blnInfoPage = false;
        }
        let data2 = [...data]
          .filter(function (item) {
            if (item && item.category && item.categoryEn) {
              return item.categoryEn.toLowerCase() === category.toLowerCase();
            }
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
          coordinates: [...dataCoord],
          coordinate: [18.0, 44.33333],
          type: category,
          city: city,
          about: about,
          displayMap: false,
          blnInfoPage: blnInfoPage,
          country,
          searchValue: '',
          dataFiltered: null,
          coordinatesFiltered: null,
        });
      });
  }

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

  openEmail = email => {
    Linking.openURL(
      'mailto:' +
        email +
        '?subject=Contact from Balkan Travel Mapper&body=Description',
    );
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
  componentWillUnmount() {
    this.setState({
      data: [],
    });
    this.unsubscribe();
  }

  backClicked = () => {
    this.setState({displayMap: false});
    const {goBack} = this.props.navigation;
    goBack();
    return true;
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
        key={'rlpage' + key + itemId}
        id={'point' + key}
        coordinate={coordinate}
        title={coordinates && coordinates[2] ? coordinates[2] : 'Item'}
        onSelected={() => {
          this.props.navigation.navigate('RestaurantPage', {
            item: item,
            navigatedFromMap: true,
          });
        }}
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

  renderAnnotations() {
    const items = [];

    const coords = this.state.coordinatesFiltered
      ? this.state.coordinatesFiltered
      : this.state.coordinates;

    for (let i = 0; i < coords.length; i++) {
      items.push(this.renderAnnotation(i, coords[i]));
    }

    return items;
  }

  handleClick(item) {
    //('page clicked', item);
    this.props.navigation.navigate('RestaurantPage', {item: item});
  }

  handleClickCustom(item, main) {
    //('page clicked', item);

    this.props.navigation.navigate('StaticItemPage', {
      item: item,
      main: main,
      image:
        this.state.about && this.state.about.image
          ? this.state.about.image
          : null,
    });
  }

  renderHeaderTours() {
    let image = require('../assets/images/tours_main_photo.jpg');

    return (
      <View style={[styles.header, {paddingBottom: 10}]}>
        <Image source={image} style={{width: '100%', height: 180}} />
      </View>
    );
  }

  renderCustomItemImage(item) {
    let image = null;
    if (item && item.mainPicture) {
      image = item.mainPicture;
    } else {
      if (this.state.type === 'tours')
        image = require('../assets/images/tours_main_photo.jpg');
      else if (this.state.type === 'explore') {
        if (this.state.about.image) {
          image = this.state.about.image;
        } else {
          image = require('../assets/images/cat_header_holder.jpg');
        }
        //else image = require('../assets/images/cat_header_holder.jpg');
      }
    }

    return (
      <View style={[styles.header, {paddingBottom: 10}]}>
        <Image source={image} style={{width: '100%', height: 180}} />
      </View>
    );
  }

  handleSearch = text => {
    if (text && text.length > 2) {
      const data = [...this.state.data];
      let data2 = [...data];
      const dataCoord = [];

      data2 = data2
        .filter(function (item) {
          if (item && item.nazivEn && item.naziv) {
            return item.nazivEn.toLowerCase().includes(text.toLowerCase());
          }
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
        dataFiltered: data2,
        coordinatesFiltered: dataCoord,
        searchValue: text,
      });

    } else {
      this.setState({
        dataFiltered: null,
        coordinatesFiltered: null,
        searchValue: text,
      });
    }
  };

  renderHeader() {
    let image = require('../assets/images/cat_header_holder.jpg');

    if (this.state.blnInfoPage) {
      if (this.state.about.image) {
        image = this.state.about.image;
      }
    } else {
      if (this.state.type === places.RESTAURANTS) {
        image = require('../assets/images/restaurants_header.png');
      }
      if (this.state.type === places.HOTELS) {
        image = require('../assets/images/hotels_main_photo.jpg');
      }
    }

    let typeName = '';

    if (places.RESTAURANTS === this.state.type) {
      typeName = strings.restaurants;
    }
    if (places.ATTRACTIONS === this.state.type) {
      typeName = strings.topAttractions;
    }
    if (places.DICTIONARY === this.state.type) {
      typeName = strings.dictionary;
    }
    if (places.EXPLORE === this.state.type) {
      typeName = strings.explore;
    }
    if (places.HOTELS === this.state.type) {
      typeName = strings.hotels;
    }
    if (places.SHOP === this.state.type) {
      typeName = strings.shop;
    }
    if (places.TOURS === this.state.type) {
      typeName = strings.tours;
    }
    if (places.TRANSPORTATION === this.state.type) {
      typeName = strings.transportation;
    }

    return (
      <View style={[styles.header, {paddingBottom: 10}]}>
        <Image source={image} style={{width: '100%', height: 180}} />
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
          <Text style={styles.city}>{typeName}</Text>
          <Text style={styles.country}>{this.state.country}</Text>
        </LinearGradient>
      </View>
    );
  }

  renderItemCustom = (item, key, main) => {
    let imgSource = require('../assets/images/item_holder.png');

    if (item && item.picture && item.picture !== '') {
      imgSource = item.picture;
    }
    return (
      <TouchableOpacity onPress={() => this.handleClickCustom(item, main)}>
        <View style={styles.row}>
          <AsyncImageAnimated
            source={imgSource}
            placeholderSource={require('../assets/images/item_holder.png')}
            style={{width: 60, height: 60, marginLeft: 10, borderRadius: 10}}
          />

          <View style={[styles.item]}>
            <Text style={[styles.titleItem]}>{item.title}</Text>
          </View>
          <Image
            style={{width: 10, height: 17, position: 'absolute', right: 20}}
            source={require('../assets/images/next_button.png')}
          />
        </View>
      </TouchableOpacity>
    );
  };
  renderItem = (item, key) => {
    return (
      <TouchableOpacity onPress={() => this.handleClick(item)}>
        <View style={styles.row}>
          <AsyncImageAnimated
            source={{
              uri: 'https://bib.rutmap.com' + item.opSlika,
            }}
            placeholderSource={require('../assets/images/item_holder.png')}
            style={{width: 60, height: 60, marginLeft: 10, borderRadius: 10}}
          />

          <View style={[styles.item]}>
            <Text style={[styles.titleItem]}>
              {strings.getLanguage() === 'en' ? item.nazivEn : item.naziv}
            </Text>
            <Text style={[styles.subtitleItem]}>{item.address}</Text>
          </View>
          <Image
            style={{width: 10, height: 17, position: 'absolute', right: 20}}
            source={require('../assets/images/next_button.png')}
          />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    let email = 'info@t-mapper.com';
    let web = 'http://be-institute.com/en/about-us/';
    if (this.state.blnInfoPage) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={[styles.topView, {paddingBottom: 20}]}>
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
          <ScrollView
            ref={ref => {
              this.scrollListReftop = ref;
            }}>
            <View>
              {this.state.type === places.TOURS && this.renderHeaderTours()}
              {this.state.type !== places.TOURS &&
                this.state.type !== places.DICTIONARY &&
                this.renderHeader()}

              {this.state.type === places.DICTIONARY && (
                <View style={styles.background}>
                  <Text style={styles.description}>
                    COMMON USEFUL TERMS{'\n'}日常用语
                  </Text>
                  <Text style={styles.descriptionText}>

                    Hello 你好{'\n'}
                    Please 请{'\n'}
                    Thank you 谢谢{'\n'}
                    Yes 是{'\n'}
                    No 不是{'\n'}
                    Sorry (apology) 对不起{'\n'}
                    Toilets 厕所/卫生间/洗手间{'\n'}
                    Accessible toilets 残疾人专用厕所{'\n'}
                    Exit 出口{'\n'}
                    No smoking 禁烟 /禁止吸烟{'\n'}
                    Pleased to meet you 很高兴认识你{'\n'}
                    How are you? 你好！{'\n'}I am fine, thank you. 很好！谢谢！
                    {'\n'}
                    Goodbye 再见{'\n'}
                    What is this? 这是什么?{'\n'}
                    Do you have...? 有没有 …?{'\n'}
                    How much? 多少钱? {'\n'}
                    It is too expensive. 太贵了.{'\n'}
                    Excuse me...! 请问！{'\n'}
                    Excuse me 抱歉！{'\n'}
                    What is this? 这是什么？{'\n'}
                    Where is the train station? 火车站在哪里?{'\n'}I want to go
                    to the airport. 我想去机场.{'\n'}
                    Where is the bathroom? 厕所在哪里?{'\n'}
                    Free of Charge 免费{'\n'}
                    Do you accept Union Pay? 我们支持银联支付?{'\n'}
                  </Text>

                  <Text style={styles.description}>
                    INTERNATIONAL RESTAURANT{'\n'}国际餐厅
                  </Text>
                  <Text style={styles.descriptionText}>
                    Italian 意大利餐厅 {'\n'}
                    Mexican 墨西哥餐厅{'\n'}
                    Asian 亚洲餐厅 {'\n'}
                    Chinese 中餐{'\n'}
                    Japanese 日本餐厅{'\n'}
                    Mediterranean 地中海餐厅{'\n'}
                    Turkish 土耳其餐厅{'\n'}
                    Indian Cuisine 印度菜{'\n'}
                    Winery 酒庄 {'\n'}
                    Pizza 比萨店 {'\n'}
                    Fast Food 快餐 {'\n'}
                    Gluten-Free 无麸质{'\n'}
                    Vegan 素食主义者餐厅 {'\n'}
                    Vegetarian 素食餐厅 {'\n'}
                    Buffet 自助餐菜单 {'\n'}
                    Entertainment & Music 娱乐与音乐{'\n'}
                    Cafe and Food 咖啡厅和美食
                  </Text>
                  <Text style={styles.description}>
                    TRADITIONAL RESTAURANT{'\n'}国内餐厅
                  </Text>
                  <Text style={styles.descriptionText}>
                    Ascinica 传统餐厅{'\n'}
                    传统Cevabdzinica餐厅{'\n'}
                    传统Buregdzinica餐厅
                  </Text>
                  <Text style={styles.description}>IN A HOTEL{'\n'}在酒店</Text>
                  <Text style={styles.descriptionText}>
                    Single Room 单人间 {'\n'}
                    Double room 双人间 {'\n'}
                    Double Bed 双人/大床 {'\n'}
                    Twin Beds 双床{'\n'}
                    Suite 套房 {'\n'}
                    Extra Bed 加床 {'\n'}
                    No smoking room 无烟房间 {'\n'}
                    Accessible room 无障碍客房 （残疾人专用） {'\n'}
                    Wheelchair access 轮椅通行道 {'\n'}
                    Wifi 无线网
                  </Text>
                  <Text style={styles.description}>FACILITIES{'\n'}设施</Text>
                  <Text style={styles.descriptionText}>
                    Restaurant 餐厅 {'\n'}
                    Bar 酒吧 {'\n'}
                    Toilets 厕所/洗手间 {'\n'}
                    Smoking Area 吸烟区 {'\n'}
                    Lounge 大厅休息区 {'\n'}
                    Coffee Shop 咖啡店 {'\n'}
                    Gym /Fitness Facilities 健身房 / 健身设施 {'\n'}
                    Spa/ Sauna 水疗馆 / 桑拿 {'\n'}
                    Health & Beauty 美容中心 {'\n'}
                    Swimming Pool 游泳池 {'\n'}
                    Gift Shop 礼品店 {'\n'}
                    Currency Exchange 外币兑换 {'\n'}
                    Lift/Elevator 电梯
                  </Text>

                  <Text style={styles.description}>
                    IN A RESTAURANT/CAFE/BAR{'\n'}在饭店/咖啡厅/酒吧
                  </Text>
                  <Text style={styles.descriptionText}>
                    I would like to drink...我想喝...{'\n'}
                    Beer 啤酒 {'\n'}
                    Bottled beer 瓶装啤酒 {'\n'}
                    Red Wine 红(葡萄)酒 {'\n'}
                    White Wine 白葡萄酒 {'\n'}
                    Whisky 威士忌 {'\n'}
                    Brandy白兰地 {'\n'}
                    Gin杜松子酒{'\n'}
                    Vodka 伏特加 {'\n'}
                    Fruit Juice 果汁 {'\n'}
                    Tonic Water汤力水 {'\n'}
                    Soda Water 苏打水 {'\n'}
                    Lemonade 苏打柠檬水 {'\n'}
                    Coca Cola 可口可乐 {'\n'}
                    Bottled Water 瓶装矿泉水 {'\n'}
                    Menu 菜单 {'\n'}
                    Dish of the Day 每日推荐 {'\n'}I would like to order food.
                    我想点餐。
                    {'\n'}
                    What do you recommend?. 您能给推荐一下吗？{'\n'}
                    We wish to try traditional .......... food.
                    我们想品尝一下传统的...食物。{'\n'}
                    Albanian 阿尔巴尼亚的/阿尔巴尼亚人{'\n'}
                    Bosnian 波斯尼亚的/波斯尼亚人{'\n'}
                    Macedonian 马其顿的/马其顿人{'\n'}
                    Montenegrin 黑山的/ 黑山人{'\n'}
                    Kosovan 科索沃的/科索沃人
                  </Text>
                  <Text style={styles.description}>
                    ACCOMMODATION AMENITIES{'\n'}住宿设施
                  </Text>
                  <Text style={styles.descriptionText}>
                    Air Conditioning 空调{'\n'}
                    WIFI 无线网络 {'\n'}
                    Laundry 洗衣房 {'\n'}
                    Room Service 房间服务 {'\n'}
                    Restaurant 餐厅 {'\n'}
                    Cocktail Lounge 鸡尾酒廊 {'\n'}
                    Conference Room 会议室 {'\n'}
                    Wheelchair 轮椅{'\n'}
                    Parking 停车 {'\n'}
                    Swimming Pool 游泳池 {'\n'}
                    Fitness 健身房 {'\n'}
                    Sauna 桑拿 {'\n'}
                    Massage 按摩 {'\n'}
                    Spa 矿泉{'\n'}
                    Leisure & Sports 休闲&运动 {'\n'}
                    Horse Riding 骑马 {'\n'}
                    Ski Resort 滑雪圣地{'\n'}
                    Bicycle Rental 自行车租赁{'\n'}
                    Pets Allowed 允许携带宠物{'\n'}
                  </Text>
                </View>
              )}
              {this.state.city === 'Sarajevo' &&
                this.state.type === places.TRANSPORTATION &&
                (strings.getLanguage() === 'en' ? (
                  <View>
                    <View>
                      <Text style={styles.description}>
                        {'PUBLIC TRANSPORTATION IN SARAJEVO'}
                      </Text>
                      <Text style={styles.description}>{'TICKETS'}</Text>
                      <Text style={styles.descriptionText}>
                        Tram tickets are available at tram stop kiosks (single
                        fare 1.60KM) or in a tram (single fare 1.80KM). We
                        kindly remind you to have your ticket punched on the
                        green card reader once you board to avoid penalty fees
                        (25 EUR).{'\n\n'}
                        Bus ticket is available on the bus (bus driver) at a
                        price of 1.60 KM and do not require punching. Trolleybus
                        tickets are available on trolleybus stop kiosks (single
                        fare 1.60KM) or in a trolleybus (single fare 1.80KM).
                        Tickets bought at a kiosk need to be punched as you get
                        on. Daily ticket costs 5.30 KM and can be used in a
                        tram, bus or a trolleybus, except for the bus route 31E
                        Vijecnica (Town Hall) –Dobrinja on the day of the issue
                        only.{'\n\n'}
                        Public transportation runs daily, but schedules are not
                        always strictly followed. Should you have issues and
                        need our assistance finding your way across the city or
                        between Sarajevo and other places in Bosnia and
                        Herzegovina feel free to email us at info@t-mapper.com.
                        We offer transportation services to all major
                        attractions in the country, as well as airport services
                        in the country and among Balkan countries.
                      </Text>

                      <Text style={styles.description}>
                        {'MAJOR DIRECTIONS'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        To Ilidza/Tunnel museum:{'\n'}
                        Tram route 3 -Bascarsija-Ilidza. From there (last stop
                        at Ilidza) you can take a taxi (approximately 5 euro) or
                        a bus route Ilidza – Butmir.{'\n\n'}
                        To the Train/Bus Station:{'\n'}
                        Tram Route 1 from Bascarsija (10 min. ride) or Tram
                        Route 4 from Ilidza (25-30 min. ride) take you directly
                        to the Train/Bus Station. You can also take a Tram Route
                        3 and get off at the National Museum (National
                        Museum/Zemaljski muzej) tram stop.{'\n\n'}
                        To the Lukavica Bus Station:{'\n'}
                        Trolleybus Route 103 - Austrijski trg- Dobrinja (40 min.
                        ride) or a Bus Route 31 E – Vijecnica (Town Hall) –
                        Dobrinja (30 min. ride).{'\n\n'}
                        To the Airport:{'\n'}
                        Bus from Bascarija to the Airport. Timetable available
                        at Centrotrans Transportation Company.
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View>
                      <Text style={styles.description}>
                        {'萨拉热窝公共交通'}
                      </Text>
                      <Text style={styles.description}>{'车票'}</Text>
                      <Text style={styles.descriptionText}>
                        有轨电车票可以在有轨电车车站售票亭（单程票价1.60KM）或有轨电车上（单程票价1.80KM）购买。我们在此温馨提示：您在上车后，请把车票放在绿色读卡器上打孔，以避免罚款（25欧元）。
                        {'\n\n'}
                        公交车票可在公交车上（公交车司机）购买，票价1.60KM，不需要打孔。
                        {'\n\n'}
                        无轨电车票可在无轨电车站售票亭（单程票价1.60KM）或无轨电车（单程票价1.80KM）上购买。在售票亭购买的票上车时需要打孔。
                        {'\n\n'}
                        日票价格为5.30KM，可乘坐有轨电车、公共汽车或无轨电车，但31E
                        Vijecnica(Town Hall市政厅)
                        –Dobrinja公交线路仅能在出票当天使用。{'\n\n'}
                        公共交通每天都有，但发车时间表并不严格。如果您对萨拉热窝或波斯尼亚和黑塞哥维那其他路线有任何问题，请随时给我们发送电子邮件info@t-mapper.com咨询，我们将竭诚为您提供帮助。我们为该国所有主要景点提供交通服务，同时也为该国和Balkan各国提供机场服务。
                        {'\n\n'}
                      </Text>

                      <Text style={styles.description}>{'主要线路'}</Text>
                      <Text style={styles.descriptionText}>
                        Ilidza/隧道博物馆（Tunnel museum）:{'\n'}
                        乘坐轨电车 3号线 -Bascarsija-Ilidza. 从那里
                        (Ilidza的终点站) 您可以打车(大概花费
                        5欧）或者换乘公交Ilidza – Butmir.线。{'\n\n'}
                        到火车站/汽车站:{'\n'}
                        从Bascarsij乘坐有轨电车 1 号线 (10分钟车程)
                        或从Ilidza乘有轨电车4号线(25-30分钟车程)
                        ，您可直达火车站和汽车站。您还可以乘坐有轨电车3号线然后在国家博物馆站下车。
                        {'\n\n'}
                        到Lukavica公交车站（Lukavica Bus Station）:{'\n'}
                        乘坐无轨电车103号线- Austrijski trg- Dobrinja
                        (40分钟车程)或者公交31 E – Vijecnica (市政厅) – Dobrinja
                        (30 分钟车程)。{'\n\n'}
                        到飞机场:{'\n'}
                        乘坐公交车从 Bascarija
                        直达飞机场。发车时刻表可以在Centrotrans Transportation
                        Company获得。
                      </Text>
                    </View>
                  </View>
                ))}

              {this.state.city === 'Pristina' &&
                this.state.type === places.TRANSPORTATION &&
                (strings.getLanguage() === 'en' ? (
                  <View>
                    <View>
                      <Text style={styles.description}>
                        {'PUBLIC TRANSPORTATION IN PRISTINA'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        Pristina as the capital city has a few lines of local
                        buses that are part of the public transportation system.
                      </Text>
                      <Text style={styles.description}>{'TICKETS'}</Text>
                      <Text style={styles.descriptionText}>
                        Tickets can be bought after you enter the bus, usually
                        by a cashier that sits side by side with the bus driver.
                        The tickets cost 0.40 EUR per one ride but you can also
                        get monthly tickets to travel wherever and whenever
                        inside the city. The monthly tickets can be acquired in
                        the appropriate Local Transport Offices in Pristina,
                        with a price of 10-14 EUR per month depending on the
                        type of ticket (integrated or specific – meaning used
                        for one bus line or all bus lines). Public
                        transportation runs daily, but in different schedules on
                        Sundays (as there are some delays due to low demand on
                        weekends). The busses run on 5-10 minutes intervals from
                        every local bus station. Should you have issues and need
                        our assistance finding your way across the city or
                        between Pristina and other places in Pristina, email us
                        at info@t-mapper.com. We offer transportation services
                        to all major attractions in the country, as well as
                        airport services in the country and among Balkan
                        countries.
                      </Text>
                      <Text style={styles.description}>
                        {
                          'MAJOR LOCAL TRANSPORTATION LINES (all lines work vice-versa).'
                        }
                      </Text>
                      <Text style={styles.descriptionText}>
                        BUS LINE 1: FUSHE KOSOVE – UNIVERSITY OF ENGINEERING
                        {'\n'}
                        BUS LINE 3: BARDHOSH – MAT (ROUNDABOUT){'\n'}
                        BUS LINE 3A: CITY CENTER (City Center)– MAT{'\n'}
                        BUS LINE 3C: SINIDOLL – SUNNY HILL{'\n'}
                        BUS LINE 4: GERMIA NATIONAL PARK – MAT MOSQUE{'\n'}
                        BUS LINE 7C: KALABRIA – CITY CENTER (City Center){'\n'}
                        BUS LINE 7: CENTRAL BUS STATION (Central Bus Station) –
                        ARBERIA
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View>
                      <Text style={styles.description}>
                        {'普里什蒂纳公共交通'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        首都普里什蒂纳，有几条当地公共汽车线路。
                      </Text>

                      <Text style={styles.description}>{'车票'}</Text>
                      <Text style={styles.descriptionText}>
                        您可以上车后购票，收银员通常坐在司机旁边。车票通常价格为0.40欧元/次，但您也可以购买月票，
                        不受时间和地区限制。月票可在普里什蒂纳当地运输办公室（Local
                        Transport
                        Offices）购买，票价为10-14欧元/月，根据票的类型（专门线路或综合线路-–
                        适用于一条或所有公交线路）而定。公共交通每天运转，但周日的发车时刻有所不同（因为周末的需求量少，所以会有一些延误）。公共汽车每隔5-10分钟发一班车。如果您在普里什蒂纳市内或该市其他地区有任何问题，请发电子邮件至info@t-mapper.com。
                        我们为该国所有主要景点提供交通服务，以及该国和巴尔干其他国家之间的机场服务。
                      </Text>

                      <Text style={styles.description}>
                        {'主要的本地运输线路（所有线路都反向线路也运行）。'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        公交1号线：FUSHE KOSOVE – UNIVERSITY OF ENGINEERING
                        {'\n'}
                        公交3号线：BARDHOSH – MAT（环岛）{'\n'}
                        3A公交线路：CITY CENTER（市中心） – MAT {'\n'}
                        3C线：SINIDOLL–SUNNY HILL{'\n'}
                        公交4号线：GERMIA NATIONAL PARK – MAT MOSQUE{'\n'}
                        公交7C线：KALABRIA – CITY CENTER（市中心）{'\n'}
                        公交7号线：CENTRAL BUS STATION（中央车站） – ARBERIA
                        {'\n'}
                      </Text>
                    </View>
                  </View>
                ))}

              {this.state.city === 'Tirana' &&
                this.state.type === places.TRANSPORTATION &&
                (strings.getLanguage() === 'en' ? (
                  <View>
                    <View>
                      <Text style={styles.description}>
                        {'PUBLIC TRANSPORTATION IN TIRANA'}
                      </Text>
                      <Text style={styles.description}>{'TICKETS'}</Text>
                      <Text style={styles.descriptionText}>
                        You can use coins to pay the tickets. Note that 1L
                        pennies are not used, and will not be accepted. Once you
                        get your ticket, keep it in reach because a conductor
                        might come around to inspect and see if you have paid.
                        As of January 2020 the price of a ticket in Tirana is 40
                        lek.{'\n\n'}
                        Public transportation runs daily, but schedules are not
                        always strictly followed. Should you have issues and
                        need our assistance finding your way across the city or
                        between Tirana and other places in Albania feel free to
                        email us at info@t-mapper.com. We offer transportation
                        services to all major attractions in the country, as
                        well as airport services in the country and among Balkan
                        countries.{'\n\n'}
                        Tirana does not have a central bus station, so you can
                        hop on and hop off at various locations in the city.
                        Tirana is connected to other cities in Albania by local
                        buses and to the rest of the world by international
                        buses.{'\n'}
                        In anticipation of the construction of the two new
                        Multi-Modal Terminals of Tirana near the Kamza Overpass
                        at the western entrance of Tirana, and at the
                        southeastern entrance of the city near TEG Shopping
                        Center, the Municipality of Tirana has opened several
                        temporary bus terminals mainly along Dritan Hoxha St and
                        Student City to serve the public transportation in
                        Tirana.
                      </Text>
                      <Text style={styles.description}>
                        {'MAJOR DIRECTIONS:'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        There are two malls in Tirana called TEG and QTU. If you
                        are taking the Vore bus to QTU (also referred to as
                        Vodafone), please communicate your destination to a
                        person collecting your money because the bus has two
                        destinations with two different prices. Ticket fare for
                        QTU is 40 L.{'\n\n'}
                        Tirana has an international bus terminal "Stacioni
                        Qendrore i linjave Nderkombetare" (currently there is no
                        indoor waiting area):
                      </Text>
                      <Text style={styles.description}>
                        {
                          'TEMPORARY BUS TERMINAL FOR NORTHERN, SOUTHERN ALBANIA & DURRES'
                        }
                      </Text>
                      <Text style={styles.descriptionText}>
                        Kthesa e Kamzes (At Kamza Overpass on the western
                        entrance of Tirana)
                      </Text>
                      <Text style={styles.description}>
                        {'TEMPORARY BUS TERMINAL FOR SOUTHEASTERN ALBANIA'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        Qyteti Studenti, Rruga Arben Broci (Student City at the
                        Tirana Parking public parking space)
                      </Text>
                      <Text style={styles.description}>
                        {
                          'TEMPORARY BUS TERMINAL FOR KOSOVO AND INTERNATIONA LINES'
                        }
                      </Text>
                      <Text style={styles.descriptionText}>
                        Pallati i Sportit Asllan Rusi, Rruga Dritan Hoxha
                        (Behind the Asllan Rusi Sports Center on Dritan Hoxha St
                        at the Tirana Public Parking space){'\n\n'}
                        Linja 1: Selitë-Kristal-Qendër (Centre)-Train
                        Station-Allias (43 stations){'\n'}
                        Linja 2: Teg-Sauk and Vjetër-Kopshti Zoologjik
                        (Zoo)-Train Station (25 stations){'\n'}
                        Linja 3: Kashar-Yzberisht-Qendër (Centre) (53 stations
                        in one direction 3A, 46 in another){'\n'}
                        Linja 4 Qendër (Centre)-QTU-Megatek-CityPark (47
                        stations){'\n'}
                        Linja 5/A Ish Kombinati i Autotraktorëve-Institut
                        (Factory) (31 stations){'\n'}
                        Linja 5/B Institut-Qendër (Centre){'\n'}
                        Linja 6 Laprakë-Qendër (Centre) (52 stations){'\n'}
                        Linja 7 Tufinë-Qendër (Centre) (31 stations){'\n'}
                        Linja 8 Former Train Station-Qendër (Center)-Sauk and
                        Ri- Sauk i Vjetër-Sanatorium-Teg (79 stations in
                        directions 8A, 8B and 8C{'\n'}
                        Linja 9 Qyteti Studenti (Student Campus)-Jordan Misja
                        (39 stations in one direction (9A) and 25 in another)
                        {'\n'}
                        Linja 10A Marteniteti i Ri-Qendër-Ish Fusha e Aviacionit
                        (Former Aviation Field) (68 stations){'\n'}
                        Linja 10B Qendër-Mihal Grameno{'\n'}
                        Linja 11 Porcelan-Qendër (Centre) (25 stations){'\n'}
                        Linja 12/A Uzina Dinamo e Re-Sharrë (53 stations){'\n'}
                        Linja 12/B 5 Maji-Sharrë (49 stations){'\n'}
                        Linja 13 Tirana e Re (47 stations){'\n'}
                        Linja 14 Unaza (Ring) (37 stations){'\n'}
                        Linja 15 Kombinat-Kinostudio (38 stations){'\n'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View>
                      <Text style={styles.description}>{'地拉那公共交通'}</Text>
                      <Text style={styles.description}>{'车票'}</Text>
                      <Text style={styles.descriptionText}>
                        你可以用硬币买票。请注意1L便士不能使用。一旦您买到车票，请把它放在周围，因为售票员可能随时会过来查票。截至2020年1月，地拉那的票价为40
                        lek{'\n'}。
                        公共交通每天都在运行，但并不总是严格遵守时间表。如果您有任何问题，需要我们的帮助，查询地拉那（Tirana）和阿尔巴尼亚的其他地方的路线，请随时给我们发电子邮件到info@t-mapper.com。我们为该国所有主要景点提供交通服务，以及该国和Balkan的其他国家之间的机场服务。
                        地拉那没有中央汽车站，所以你可以在城市的不同地点上下车。地拉那通过当地公共汽车与阿尔巴尼亚其他城市相连，通过国际公共汽车与世界其他地区相连。
                        {'\n'}
                        预计在地拉那西部入口的Kamza
                        Overpass高架桥附近和TEG购物中心附近的城市东南部入口修建两个新的地拉那综合运输集转中心，地拉那市主要沿DritanHoxha街和学生城开设了几个临时公共汽车站，为地拉那的公共交通服务。
                      </Text>
                      <Text style={styles.description}>{'主要方向'}</Text>
                      <Text style={styles.descriptionText}>
                        地拉那有两个名为TEG和QTU的购物中心。如果您乘坐Vore巴士前往QTU（也称为Vodafone），请将您的目的地告知收款人，因为公交车有两个目的地，价格不同。QTU的票价是40
                        L。{'\n'}
                        地拉那有一个国际巴士总站“Stacioniquendrore i
                        linjaveNderkombetare”（目前没有室内候车区）：
                      </Text>
                      <Text style={styles.description}>
                        {'阿尔巴尼亚北部、南部和都拉斯（DURRES）的临时巴士总站'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        Kthesa e Kamzes（地拉那西部入口的Kamza高架桥）
                      </Text>
                      <Text style={styles.description}>
                        {'阿尔巴尼亚东南部临时巴士总站'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        QytetiStudenti，RrugaArbenBroci（学生城在地拉那停车场公共停车区域）
                      </Text>
                      <Text style={styles.description}>
                        {'科索沃和国际线临时巴士总站'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        Pallati i SportitAsllanRusi,
                        RrugaDritanHoxha（位于AsllanRusi Sports
                        Center体育中心后面地拉那公共停车区域）{'\n'}
                        Linja 1: Selitë-Kristal-Qendër(中心)-Train
                        Station-Allias (43 stations) {'\n'}
                        Linja 2: Teg-Sauk
                        andVjetër-KopshtiZoologjik(动物园)-Train Station (25
                        stations) {'\n'}
                        Linja 3: Kashar-Yzberisht-Qendër(中心) (53 stations in
                        one direction 3A, 46 in another) {'\n'}
                        Linja 4 Qendër(中心)-QTU-Megatek-CityPark (47 stations){' '}
                        {'\n'}
                        Linja 5/A IshKombinati i Autotraktorëve-Institut
                        (Factory) (31 stations) {'\n'}
                        Linja 5/B Institut-Qendër(中心){'\n'}
                        Linja 6 Laprakë-Qendër(中心) (52 stations) {'\n'}
                        Linja 7 Tufinë-Qendër(中心) (31 stations) {'\n'}
                        Linja 8 Former Train Station-Qendër(中心)-Sauk andRi-
                        Sauk i Vjetër-Sanatorium-Teg (79 stations in directions
                        8A, 8B and 8C{'\n'}
                        Linja 9 QytetiStudenti(学生校园)-Jordan Misja (39
                        stations in one direction (9A) and 25 in another) {'\n'}
                        Linja 10A Marteniteti i Ri-Qendër-IshFusha e Aviacionit
                        (Former Aviation Field) (68 stations) {'\n'}
                        Linja 10B Qendër-MihalGrameno{'\n'}
                        Linja 11 Porcelan-Qendër(中心) (25 stations) {'\n'}
                        Linja 12/A UzinaDinamo e Re-Sharrë (53 stations) {'\n'}
                        Linja 12/B 5 Maji-Sharrë (49 stations) {'\n'}
                        Linja 13 Tirana e Re (47 stations){'\n'}
                        Linja 14 Unaza(环行) (37 stations) {'\n'}
                        Linja 15 Kombinat-Kinostudio (38 stations)
                      </Text>
                    </View>
                  </View>
                ))}

              {this.state.city === 'Skopje' &&
                this.state.type === places.TRANSPORTATION &&
                (strings.getLanguage() === 'en' ? (
                  <View>
                    <View>
                      <Text style={styles.description}>
                        {'PUBLIC TRANSPORTATION IN SKOPJE'}
                      </Text>
                      <Text style={styles.description}>{'TICKETS'}</Text>
                      <Text style={styles.descriptionText}>
                        Bus tickets are available at bus stations kiosks
                        (electronic single fare 35 den/by mobile single fare 40
                        den).Daily bus ticket costs 120 MKD for city routes, and
                        150 MKD for all routes. Bus tickets are available for 10
                        rides (valid for 15 days from the first punching) at a
                        price of 250 MKD for city routes, and at 300 MKD for all
                        routes. Daily bus ticket (multiple ride) plus a Cable
                        Car single ride and Millennium Cross round fare can be
                        bought at the price of 200,00 MKD.{'\n\n'}
                        Public transportation runs daily, but schedules are not
                        always strictly followed. Should you have issues and
                        need our assistance finding your way across the city or
                        between Skopje and other places in North Macedonia feel
                        free to email us at info@t-mapper.com. We offer
                        transportation services to all major attractions in the
                        country, as well as airport services in the country and
                        among Balkan countries.
                      </Text>
                      <Text style={styles.description}>
                        {'MAJOR DIRECTIONS:'}
                      </Text>
                      <Text style={styles.description}>
                        {'Skopje Bus Routes: '}
                      </Text>
                      <Text style={styles.descriptionText}>
                        2 Saraj-Avtokomanda{'\n'}
                        2a Saraj - Željezara{'\n'}3 Panorama - SP. Sala MZT
                        {'\n'}
                        3A Panorama - Mihajlo Pupin School{'\n'}
                        3B Panorama – Kvantaški Pazar {'\n'}4 11. oktobar - Hrom
                        {'\n'}
                        4A Usje - Taftalidže{'\n'}5 Novo Lisiče - Deksion{'\n'}
                        5A Deksion-Klinički centar{'\n'}7 Gorno Lisice-Karpoš 3
                        {'\n'}8 Vlae-Ljubotenski pat{'\n'}9 Skoplje
                        sjever-Klinički centar{'\n'}
                        12 Šiševo - Skopski sajam{'\n'}
                        13 Kisela voda- Željezara{'\n'}
                        15 Novo Lisiče-Karpoš 4{'\n'}
                        15A Novo Lisiče-Karpoš 4{'\n'}
                        16 Pržino - Željezara{'\n'}
                        17 Ostrovo –Muzej na sovremenata umetnost (Museum of
                        Contemporary Art){'\n'}
                        19 Šuto Orizari - Karpoš 4{'\n'}
                        20 P (Makeexpress) Transportni centar - Šuto Orizari
                        {'\n'}
                        21 Transportni centar - Bardovci (Konak){'\n'}
                        21A Transportni Centar - Bardovci (Konak){'\n'}
                        21B Transportni Centar - Bolnica Bardovci{'\n'}
                        22 Transportni Centar - (Volkovo) Lepenec{'\n'}
                        22A Klinički centar- (Volkovo) Lepenec{'\n'}
                        23 P (Makeexpress) Dom na pečat – Čento {'\n'}
                        24 Kisela Voda - Taftalidže 2{'\n'}
                        24 Kisela Voda (Pripor) - Taftalidže 2{'\n'}
                        24 Kisela Voda (Igralište) - Taftalidže{'\n'}
                        25 Transportni centar - Srednje Vodno (Cable Car){'\n'}
                        25A Stara željeznička stanica -Srednje Vodno (Cable Car){' '}
                        {'\n'}
                        25B Dom na pečat- Srednje Vodno (Cable Car) {'\n'}
                        26 Željezara - Karpoš 3{'\n'}
                        27 Vardarska – Dom na pečat{'\n'}
                        28 Taftalidže 2 - Makedonsko selo{'\n'}
                        35 Novo Lisiče - Skoplje sjever{'\n'}
                        41 Transportni Centar - Dračevo (IGM tipo){'\n'}
                        41A Klinički centar – S. Dračevo{'\n'}
                        42 S. Dračevo - Željezara{'\n'}
                        43 Dom na pečat - Južno Moravska brigada{'\n'}
                        45 Transportni Centar - Čento {'\n'}
                        50 Hipodrom - Klinički centar {'\n'}
                        57 Kozle - Radišani{'\n'}
                        57A S. Radišani – Dom na pečat{'\n'}
                        59 Karpoš3 - Grobišta Butel-Kučeviška bara{'\n'}
                        59A Novo Lisiče – Grobišta Butel{'\n'}
                        59bB Kisela Voda - Grobišta Butel{'\n'}
                        65V Transportni Centar - Stajkovci {'\n'}
                        65V Transportni Centar – Indžikovo Village{'\n'}
                        100 Nova Lisiče - SC Boris Trajkovski{'\n'}
                        118 Transporten Centar – Vizbegovo (Aqueduct){'\n'}
                        200 Deksion - SC Boris Trajkovski{'\n'}
                        606 City Tour - Porta Makedonija {'\n'}
                      </Text>
                      <Text style={styles.description}>
                        {'To the Train/Bus Station'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        Bus Routes 20P, 21, 21A, 21B, 22, 25, 41, 65V and 118
                        take you directly to the Train/Bus Station.
                      </Text>
                      <Text style={styles.description}>{'To the Airport'}</Text>
                      <Text style={styles.descriptionText}>
                        Bus from the Airport to Skopje. Timetable available at
                        Vardar Express and Manora Logistic and Marketing DOO
                        Skopje.
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View>
                      <Text style={styles.description}>
                        {'斯科普里公共交通'}
                      </Text>
                      <Text style={styles.description}>{'车票'}</Text>
                      <Text style={styles.descriptionText}>
                        公共汽车站售票亭出售公共汽车票（电子单程票35元第纳尔/移动单程票40第纳尔）。市内路线公共汽车日票票价格为120
                        MKD，所有路线日票票价为150 MKD。250
                        MKD市内线路车票提供10次乘车（有效期为首次打卡后15天），所有线路票价为300
                        MKD。公共汽车日票（可多次乘坐）加上缆车单程票和千禧年十字架往返票价为200,00
                        MKD。{'\n\n'}
                        公共交通每天都运行，但发车时间表并不严格。如果您对市内或者斯科普里和北马其顿其他地方的路线有任何问题，请随时给我们发送电子邮件info@t-mapper.com咨询，我们将竭诚为您提供帮助。我们为该国所有主要景点提供交通服务，同时也为该国和Balkan其他各国提供机场服务。
                      </Text>
                      <Text style={styles.description}>{'主要路线'}</Text>
                      <Text style={styles.description}>
                        {'斯科普里公交线路： '}
                      </Text>
                      <Text style={styles.descriptionText}>
                        2 Saraj-Avtokomanda{'\n'}
                        2a Saraj - Željezara{'\n'}3 Panorama - SP. Sala MZT
                        {'\n'}
                        3A Panorama - Mihajlo Pupin School{'\n'}
                        3B Panorama – Kvantaški Pazar {'\n'}4 11. oktobar - Hrom
                        {'\n'}
                        4A Usje - Taftalidže{'\n'}5 Novo Lisiče - Deksion{'\n'}
                        5A Deksion-Klinički centar{'\n'}7 Gorno Lisice-Karpoš 3
                        {'\n'}8 Vlae-Ljubotenski pat{'\n'}9 Skoplje
                        sjever-Klinički centar{'\n'}
                        12 Šiševo - Skopski sajam{'\n'}
                        13 Kisela voda- Željezara{'\n'}
                        15 Novo Lisiče-Karpoš 4{'\n'}
                        15A Novo Lisiče-Karpoš 4{'\n'}
                        16 Pržino - Željezara{'\n'}
                        17 Ostrovo –Muzej na sovremenata umetnost (Museum of
                        Contemporary Art){'\n'}
                        19 Šuto Orizari - Karpoš 4{'\n'}
                        20 P (Makeexpress) Transportni centar - Šuto Orizari
                        {'\n'}
                        21 Transportni centar - Bardovci (Konak){'\n'}
                        21A Transportni Centar - Bardovci (Konak){'\n'}
                        21B Transportni Centar - Bolnica Bardovci{'\n'}
                        22 Transportni Centar - (Volkovo) Lepenec{'\n'}
                        22A Klinički centar- (Volkovo) Lepenec{'\n'}
                        23 P (Makeexpress) Dom na pečat – Čento {'\n'}
                        24 Kisela Voda - Taftalidže 2{'\n'}
                        24 Kisela Voda (Pripor) - Taftalidže 2{'\n'}
                        24 Kisela Voda (Igralište) - Taftalidže{'\n'}
                        25 Transportni centar - Srednje Vodno (Cable Car){'\n'}
                        25A Stara željeznička stanica -Srednje Vodno (Cable Car){' '}
                        {'\n'}
                        25B Dom na pečat- Srednje Vodno (Cable Car) {'\n'}
                        26 Željezara - Karpoš 3{'\n'}
                        27 Vardarska – Dom na pečat{'\n'}
                        28 Taftalidže 2 - Makedonsko selo{'\n'}
                        35 Novo Lisiče - Skoplje sjever{'\n'}
                        41 Transportni Centar - Dračevo (IGM tipo){'\n'}
                        41A Klinički centar – S. Dračevo{'\n'}
                        42 S. Dračevo - Željezara{'\n'}
                        43 Dom na pečat - Južno Moravska brigada{'\n'}
                        45 Transportni Centar - Čento {'\n'}
                        50 Hipodrom - Klinički centar {'\n'}
                        57 Kozle - Radišani{'\n'}
                        57A S. Radišani – Dom na pečat{'\n'}
                        59 Karpoš3 - Grobišta Butel-Kučeviška bara{'\n'}
                        59A Novo Lisiče – Grobišta Butel{'\n'}
                        59bB Kisela Voda - Grobišta Butel{'\n'}
                        65V Transportni Centar - Stajkovci {'\n'}
                        65V Transportni Centar – Indžikovo Village{'\n'}
                        100 Nova Lisiče - SC Boris Trajkovski{'\n'}
                        118 Transporten Centar – Vizbegovo (Aqueduct){'\n'}
                        200 Deksion - SC Boris Trajkovski{'\n'}
                        606 City Tour - Porta Makedonija {'\n'}
                      </Text>
                      <Text style={styles.description}>
                        {'到火车站/汽车站'}
                      </Text>
                      <Text style={styles.descriptionText}>
                        公交20P, 21, 21A, 21B, 22, 25, 41, 65V and
                        118可直达火车/汽车站。{' '}
                      </Text>
                      <Text style={styles.description}>{'到机场'}</Text>
                      <Text style={styles.descriptionText}>
                        到斯科普里有机场大巴。发车时间表可以在Vardar Express和
                        Manora Logistic and Marketing DOO Skopje获得。{' '}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      if (this.state.type === 'tours' || this.state.type === 'explore') {
        let data = [];
        let dataItems = [];

        let city_nice = this.state.city;
        city_nice = city_nice.toLowerCase();

        if (this.state.type === 'tours') {
          if (strings.getLanguage() === 'en') {
            data = staticData['tours'];
            dataItems = staticData['tours']['en'];
          } else {
            data = staticData['tours'];
            dataItems = staticData['tours']['ch'];
          }
        }
        if (this.state.type === 'explore') {
          if (strings.getLanguage() === 'en') {
            data = staticData['explore'][city_nice];
            dataItems = staticData['explore'][city_nice]['en'];
          } else {
            data = staticData['explore'][city_nice];
            dataItems = staticData['explore'][city_nice]['ch'];
          }
        }

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
            {!this.state.displayMap && (
              <FlatList
                keyboardShouldPersistTaps="always"
                style={{marginTop: 12, marginBottom: 20}}
                data={dataItems}
                renderItem={({item, index}) =>
                  this.renderItemCustom(item, index, data)
                }
                keyExtractor={(item, index) => {
                  return 'filtered' + this.state.city + index.toString();
                }}
                extraData={this.state}
                ListHeaderComponent={() =>
                  this.renderCustomItemImage(
                    data && data.mainPicture ? data.mainPicture : null,
                  )
                }
                ListFooterComponent={() => (
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      height: 80,
                    }}
                  />
                )}
              />
            )}
          </SafeAreaView>
        );
      } else {
        const coordinate = [...this.state.coordinate];
        const coordinates = this.state.coordinatesFiltered
          ? [...this.state.coordinatesFiltered]
          : [...this.state.coordinates];

        const centerCoord =
          coordinates && coordinates[0] && coordinates[0][1]
            ? [coordinates[0][0], coordinates[0][1]]
            : [18.0, 44.33333];
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
            <View>
              <View style={styles.about}>
                <Image
                  style={{width: 25, height: 25, marginLeft: 20}}
                  source={require('../assets/images/explore.png')}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Search"
                  placeholderTextColor={COLOR_PRIMARY_BROWN}
                  selectionColor={COLOR_PRIMARY_BROWN}
                  value={this.state.searchValue}
                  onChangeText={this.handleSearch}
                />
              </View>
            </View>
            {!this.state.displayMap && (
              <FlatList
                keyboardShouldPersistTaps="always"
                style={{marginTop: 12, marginBottom: 20}}
                data={
                  this.state.dataFiltered
                    ? this.state.dataFiltered
                    : this.state.data
                }
                renderItem={({item, index}) => this.renderItem(item, index)}
                keyExtractor={(item, index) => {
                  return 'filtered' + this.state.city + index.toString();
                }}
                extraData={this.state}
                ListHeaderComponent={() => this.renderHeader()}
                ListFooterComponent={() => (
                  <View style={{backgroundColor: 'transparent', height: 80}} />
                )}
              />
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
                  centerCoordinate={centerCoord}
                />

                {this.renderAnnotations()}
              </MapView>
            )}

            <View style={styles.button}>
              <OrangeButton
                clicked={this.buttonClicked}
                items={[{title: strings.mapView, subtitle: strings.navigation}]}
              />
            </View>
          </SafeAreaView>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PRIMARY_GREY,
  },
  map: {
    flex: 1,
  },
  containerControls: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
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
  textInput: {
    height: 40,
    width: '100%',
    color: COLOR_PRIMARY_BROWN,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '400',
    fontSize: 16,
    marginLeft: 10,
  },
  emailText: {
    color: COLOR_PRIMARY_DARK_BROWN_TEXT,
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  inquiryText: {
    color: COLOR_PRIMARY_DARK_BROWN_TEXT,
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '700',
  },
});
