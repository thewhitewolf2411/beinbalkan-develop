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

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class ChineseDictionary extends Component {
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
          <Text style={styles.description}>
            {'COMMON USEFUL TERMS 日常用语'}
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
            How are you? 你好！{'\n'}I am fine, thank you. 很好！谢谢！{'\n'}
            Goodbye 再见{'\n'}
            What is this? 这是什么?{'\n'}
            Do you have...? 有没有 …?{'\n'}
            How much? 多少钱? {'\n'}
            It is too expensive. 太贵了.{'\n'}
            Excuse me...! 请问！{'\n'}
            Excuse me 抱歉！{'\n'}
            What is this? 这是什么？{'\n'}
            Where is the train station? 火车站在哪里?{'\n'}I want to go to the
            airport. 我想去机场.{'\n'}
            Where is the bathroom? 厕所在哪里?{'\n'}
            Free of Charge 免费{'\n'}
            Do you accept Union Pay? 我们支持银联支付?{'\n'}
          </Text>

          <Text style={styles.description}>{'IN A HOTEL'}</Text>
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
          <Text style={styles.description}>{'FACILITIES 设施 '}</Text>
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
            {'IN A RESTAURANT/CAFE/BAR 在饭店/咖啡厅/酒吧'}
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
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
});
