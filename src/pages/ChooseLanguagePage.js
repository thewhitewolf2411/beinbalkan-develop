import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_ORANGE,
  COLOR_PRIMARY_ORANGE_TEXT
} from '../assets/colors/colors';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import {strings} from '../strings/strings'
import AppNameText from '../components/AppNameText';


export default class ChooseLanguagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  componentDidMount() {
    
  }

  englishClick(){
   // console.log(strings)
      strings.setLanguage('en');
      this.props.navigation.navigate('ChooseCityPage', {})
  }

  chinaClick(){
      strings.setLanguage('zh');
      this.props.navigation.navigate('ChooseCityPage', {})
  }


  render() {
    
    return (
        <View>
        <View style = {styles.backgroundContainer}>
                <Image resizeMode = "cover" source = {require('../assets/images/language-background.png')} style = {{width: width, height: height, backgroundColor: "blue"}}></Image>
        </View>
        <View style = {styles.overlay}>
                <Image style = {{width: width, height: height, backgroundColor: COLOR_PRIMARY_ORANGE}}></Image>
        </View>

        

      <SafeAreaView style={styles.container}>
        
        <View style = {styles.titleText}>
            <AppNameText></AppNameText>
        </View>
        <Text style = {styles.subtitleText}>We Know the Balkans, Follow us</Text>
        <Text style = {styles.subtitleText}>我們了解巴爾幹，關注我們</Text>

        <View style = {styles.middleTexts}>
                <Text style = {styles.nextText}>Choose your language of preference to get started and explore the best options of your new adventure in the Western Balkans!</Text>
                <Text style = {styles.nextText}>选择您的首选语言，开始探索西巴尔干新冒险的最佳选择!</Text>
            </View>

        <View style = {styles.buttons}>

            <TouchableOpacity style = {styles.button} onPress = { () => this.englishClick() }>
                <Image source = {require('../assets/images/uk.png')} style = {{width: 60, height: 38}}></Image>
                <Text style={styles.countryText}>ENGLISH</Text>

            </TouchableOpacity>
            <TouchableOpacity style = {styles.button} onPress = { () => this.chinaClick() }>
                <Image source = {require('../assets/images/china.png')} style = {{width: 58, height: 40}}></Image>
                <Text style={styles.countryText}>中文</Text>
            </TouchableOpacity>
        </View>

     
        
      </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  overlay: {
    opacity: 0.8,
    backgroundColor: '#000000'
  },
backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  titleText:{
      marginTop:30,
  },

  subtitleText:{
      color:COLOR_PRIMARY_WHITE,
      textAlign:'center',
      fontFamily: "SourceSansPro-Regular",
      fontWeight: "400"
  },

  nextText:{
      color:COLOR_PRIMARY_WHITE,
      textAlign:'center',
      fontFamily: "SourceSansPro-Bold",
      fontWeight: "700",
  },

  middleTexts:{
      position: 'absolute',
      top:'50%',
      justifyContent: 'center',
      alignItems: "center",
      width: "100%"
  },

  buttons:{
      height: 40,
      width: "100%",
      position: 'absolute',
      justifyContent: 'center',
      flexDirection: "row",
      bottom: 150,
      shadowColor: COLOR_PRIMARY_BLACK,
    shadowOffset: {
	    width: 0,
	    height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 23.00,
    elevation: 4,
  },

  button:{
      height: "100%",
      width: 150,
      marginLeft: 10,
      borderRadius: 25,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLOR_PRIMARY_ORANGE,
  },

  countryText: {
      color:COLOR_PRIMARY_WHITE,
      fontFamily: "SourceSansPro-Bold",
      fontWeight: "700",
      fontSize: 14,
      textAlign: "center",
      flex: 1,
      marginRight: 2,

  }
  
});