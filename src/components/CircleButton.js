import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
   Image ,
   TouchableHighlight,
   TouchableOpacity
} from 'react-native';

import {
  COLOR_PRIMARY_WHITE,
  COLOR_PRIMARY_BLACK,
  COLOR_PRIMARY_GREY,
  COLOR_PRIMARY_BROWN,
  COLOR_PRIMARY_ORANGE
} from '../assets/colors/colors';


export default class CircleButton extends Component<{}> {

handleClick(){
  
    this.props.clicked()
  
}

	render(){
		return(
      <View style = {{flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%"}}>
			<TouchableOpacity style={styles.submit}   onPress = { () => this.handleClick() }   underlayColor='#fff'>
                    <Image style = {{width: this.props.iconWidth, height: this.props.iconHeight}} source = {this.props.icon}></Image>
            </TouchableOpacity>

            <Text style={[styles.submitText , this.props.textStyle]}>{this.props.title}</Text>
            </View>
			)
	}
}

const styles = StyleSheet.create({
  submit:{
    height: 60,
    width: 60,
    backgroundColor:'white',
    borderRadius:35,
    justifyContent: 'center', 
    alignItems: 'center' 
    
  },
  submitText:{
      color:COLOR_PRIMARY_BROWN,
      textAlign:'center',
      fontSize: 12,
      marginTop: 8,
      fontFamily: "SourceSansPro-Regular",
      fontWeight: "600",
  }
});