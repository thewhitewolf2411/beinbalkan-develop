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

export default class TermsandConditionsBalkanTravelMapper extends Component {
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
          <Text style={styles.description}>{'TERMS & CONDITIONS'}</Text>
          <Text style={styles.descriptionText}>
            These are the terms and conditions for use of Balkan Travel Mapper
            Mobile Application.{'\n\n'}
            <Text style={styles.description}>
              {'1. Use of Mobile Application on These Conditions'}
            </Text>
            {'\n'}
            All use of the Balkan Travel Mapper Mobile Application (“the Mobile
            Application”) is on the terms and conditions below. If you do not
            agree to these conditions cease use of the Mobile Application
            immediately. You may print and keep a copy of these terms. They are
            a legal agreement between us and can only be modified with our
            consent. We reserve the right to change the terms at our discretion
            by changing them on the Mobile Application. Goods or services
            available for purchase on the Mobile Application, such as hotel
            bookings are provided by our partners and comprise a contract
            between the user and our partner, not Balkan Travel Mapper. Although
            Balkan Travel Mapper uses its reasonable endeavors to ensure
            reputable suppliers are used on the Mobile Application it accepts no
            liability arising from supplies by such partners. All such sales are
            on the terms and conditions of the partner and the user which may be
            accessed from the Mobile Application.{'\n\n'}
            <Text style={styles.description}>
              {'2. Accuracy of Information'}
            </Text>
            {'\n'}
            Balkan Travel Mapper (“we”) do our best to ensure all information on
            the Mobile Application is accurate. If you find any inaccurate
            information on the Mobile Application let us know and we will
            correct it, where we agree, as soon as practicable. You should
            independently verify any information before relying upon it. We make
            no representations that information is accurate and up to date or
            complete and accept no liability for any loss or damage caused by
            inaccurate information. This Mobile Application gives a large amount
            of data and there will inevitably be errors in it, particularly
            because dates and times of events change and cancellations occur.
            You are advised to check directly with the organizers of the
            event/service concerned before making any arrangements.{'\n\n'}
            <Text style={styles.description}>{'3. Our Liability'}</Text>
            {'\n'}
            We provide information on this Mobile Application in line with our
            best knowledge and practice, and on the basis of no liability for
            the information given. In no event shall we be liable to you for any
            direct or indirect or consequential loss, loss of profit, revenue or
            good will arising from your use of the Mobile Application or
            information on the Mobile Application. We are publishers and also
            distributors of content supplied by third parties and users of the
            Mobile Application. Any opinions, advice, statements, services,
            offers, or other information or content expressed or made available
            by third parties, including information providers, or users, are
            those of the authors or distributors and not of us. We do not
            necessarily endorse nor are we responsible for the accuracy or
            reliability of any opinion, advice or statement made on the Mobile
            Application.{'\n\n'}
            <Text style={styles.description}>
              {'4. Legal Jurisdiction and Dispute Resolution'}
            </Text>
            {'\n'}
            Bosnian law shall apply to these terms, notwithstanding the
            jurisdiction where you are based as Balkan Travel Mapper’s Head
            Office is in Bosnia and Herzegovina. You irrevocably agree that the
            courts of Bosnia and Herzegovina shall have exclusive jurisdiction
            to settle any dispute which may arise out of, under, or in
            connection with these Terms and for those purposes irrevocably
            submit all disputes to the jurisdiction of the Bosnian courts. The
            place of performance shall be Bosnia and Herzegovina.{'\n\n'}
            <Text style={styles.description}>{'5. Privacy Policy'}</Text>
            {'\n'}
            Balkan Travel Mappers operates the website, social media and mobile
            applications. We use your data to provide and improve the Service.
            By using the Service, you agree to the collection and use of
            information in accordance with this policy. We collect information
            to provide better services to all our users and no transfer of your
            Personal Data will take place to an organization or a country unless
            there are adequate controls in place including the security of your
            data and other personal information. When you use our services, you
            trust us with your information. We work hard to protect your
            information, but remember that no method of transmission over the
            Internet, or method of electronic storage is 100% secure. While we
            strive to use commercially acceptable means to protect your Personal
            Data, we cannot guarantee its absolute security. We may employ third
            party companies and individuals as Service Providers to provide the
            Service on our behalf, to perform Service-related services or to
            assist us in analyzing how our Service is used. These third parties
            have access to your Personal Data only to perform these tasks on our
            behalf and are obligated not to disclose or use it for any other
            purpose. We may also provide paid products and/or services within
            the Service. In that case, we use third-party services for payment
            processing. We will not store or collect your payment card details.
            That information is provided directly to our third-party payment
            processors whose use of your personal information is governed by
            their Privacy Policy. We have no control over and assume no
            responsibility for the content, privacy policies or practices of any
            third party sites or services. We strongly advise you to review the
            Privacy Policy of every link and site you visit. Unless otherwise
            defined in this Privacy Policy, terms used in this Privacy Policy
            have the same meanings as in our Terms and Conditions.{'\n\n'}
            <Text style={styles.description}>{'6. General'}</Text>
            {'\n'}
            Any formal legal notices should be sent to us at the address at the
            end of these Terms by email confirmed by post. Failure by us to
            enforce a right does not result in waiver of such right. You may not
            assign or transfer your rights under this agreement.{'\n\n'}
            <Text style={styles.description}>{'CONTACT'}</Text>
            {'\n\n'}
            Balkan Travel Mapper{'\n'}
            Office Address: Business Excellence, Himze Polovine 51, 71000
            Sarajevo, Bosnia and Herzegovina Email: info@t-mapper.com
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
