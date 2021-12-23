import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
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

export default class TermsandConditionsBalkanTravelMapperKIN extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  backClicked = () => {
    const {goBack} = this.props.navigation;
    goBack();
    return true;
  };

  componentDidMount() {}
  handleClick(type) {
    //  console.log(type);

    this.props.route.params(item, {});
  }

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
          <Text style={styles.description}>{'条件和条款'}</Text>
          <Text style={styles.descriptionText}>
            以下是使用Balkan Travel Mapper 自助游手机应用的相关条件和条款。
          </Text>
          <Text style={styles.description}>
            {'1.	请在使用该手机应用时遵守以下条款'}
          </Text>
          <Text style={styles.descriptionText}>
            使用Balkan Travel
            Mapper自助游手机应用（简称手机应用）须遵守以下所有条件和条款。
            如果您不同意这些条款，请立即停止使用该手机应用。
            您可以打印或者复印这些条款。这些条款是我们之间合法的协议，只有经过我方的同意才能做改动。我方始终保留改动该应用相关条款的权利。
            该手机应用提供的商品和服务，例如酒店预订，是由我们的合作伙伴提供。用户与合作伙伴达成合约，而不是与我方。虽然Balkan
            Travel
            Mapper尽力确保其供应商都有良好的声誉，但我方不承担由于我方合作供应商提供货物和服务所导致的责任。所有的消费都基于该手机应用合作商家和用户之间的协议和条款。
          </Text>
          <Text style={styles.description}>{'2.	信息准确性'}</Text>
          <Text style={styles.descriptionText}>
            Balkan Travel Mapper（我们）尽力确保该手机应用所有信息的准确性。
            如果您发现该应用上有任何不准确的信息，请告知我们。我们将会核实后尽快更正。
            请您在选择任何信息前都自行核实。我们对信息的准确性、时效性或完整性不做任何声明和保证，任何由不准确信息引起的损失或伤害我们不负责任。该应用提供大量数据，因此可能会存在不可避免的错误，尤其是当活动时间和日期出现变动或取消的时候。我方建议您在做任何安排之前都直接与活动组织者核实信息。
          </Text>
          <Text style={styles.description}>{'3.	我们的责任'}</Text>
          <Text style={styles.descriptionText}>
            该应用所提供的信息都是根据我们现有的最全面的知识和实践，但是我们对所提供的信息没有相关责任。
            任何情况下对于您使用该应用或信息引起的相关损失，包括利润损失，收入损失或者货物损失，我们不负相关责任。
            我们是经第三方和用户同意的出版商和经销商。任何第三方的观点、建议、声明、服务、供应或作者其他信息及内容，包括信息提供者，或者用户，来源于作者或者经销商而不是我们。我们对该手机应用的任何观点、建议或声明的准确性和可靠性都不赞同或者负责。
          </Text>
          <Text style={styles.description}>{'4.	法律权限和争议解决'}</Text>
          <Text style={styles.descriptionText}>
            这些条款适用于波斯尼亚和黑塞哥维那的法律，因为Balkan Travel
            Mapper的总部在波斯尼亚和黑塞
            哥维那。您将同意可能由所有相关条款产生的争端都只能由波斯尼亚和黑塞哥维那法庭裁决。执行
            地点应为波斯尼亚和黑塞哥维那。
          </Text>
          <Text style={styles.description}>{'5. 隐私权政策'}</Text>
          <Text style={styles.descriptionText}>
            Balkan Travel
            Mapper运营网站，社交媒体和手机应用。我们使用您的数据来提供和改善我们的服务。使用此服务您将赞同与此政策相关的信息收集和使用。我们收集信息来为我们的用户提供更好的服务。我们不会将您的私人数据交给任何组织或国家除非对您的数据和其他个人信息安全有严格的控制。
            {'\n'}
            使用我们的服务表明您对我们提供信息的信任。我们将尽力保护您的信息，但是不是所有的互联网或者电子储存方式百分百安全。我们竭力使用合理的商业手段保护您的个人信息，但不能保证其绝对安全。
            {'\n'}
            我们可能委托第三方公司或个人作为服务提供者来代表我们提供服务，执行与服务相关的服务或者帮助我们分析我们服务的使用情况。这些第三方有权限获取您的数据，但仅限于代表我方提供服务，来提供相关服务或者帮助我们分析服务情况，他们有义务对信息进行保密和不用于其他用途。我们也会提供有偿货物或者服务，在这种情况下，我们使用第三方服务来处理支付。我们将不会储存或者收集您的银行卡支付信息。支付信息是直接提供给我们第三方支付处理器的，他们在使用您的个人信息时也受隐私权政策的管控。
            {'\n'}
            我们对于任何第三方网站或者服务所含内容，隐私权政策或者操作都无权控制，也无责任。我们强烈建议您仔细阅读您所访问的每个链接和网站。
            {'\n'}
            除非在隐私权政策中明确指出，否则第三方隐私权政策中所使用的条件条款和上述条件条款有相同的含义。
          </Text>
          <Text style={styles.description}>{'6.其他'}</Text>
          <Text style={styles.descriptionText}>
            任何正式的法律通知都应通过本条款末尾的电子邮件地址发送给我方确认。
            {'\n'}
            我方未能强制执行某项权利并不意味着放弃该项权。{'\n'}
            您不得分配或转让此协议下的权利。{'\n'}
          </Text>
          <Text style={styles.description}>{'联系我们'}</Text>
          <Text style={styles.descriptionText}>
            Balkan Travel Mapper 公司地址：Business Excellence, Himze Polovine
            51, 71000 Sarajevo, Bosnia and Herzegovina
            电子邮箱：info@t-mapper.com
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
    fontWeight: '700',
    paddingBottom: 10,
  },
});
