import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
   Image ,
} from 'react-native';


export default class AppNameText extends Component<{}> {

handleClick(){
  if (this.props.disabled == false){
    this.props.clicked()
  }
}

	render(){
		return(
            <View>
                    <Text style={[styles.submitText , this.props.textStyle]}>{this.props.title ? this.props.title : "Balkan"}<Text style={[styles.boldText , this.props.textStyle]}>{this.props.subtitle ? this.props.title : "Travel Mapper"}</Text></Text>
            
            </View>
			)
	}
}

const styles = StyleSheet.create({
  
  submitText:{
      color:'white',
      textAlign:'center',
      fontSize: 32,
      fontFamily: "SourceSansPro-Light",
      fontWeight: "400"
  },

  boldText:{
      color:'white',
      textAlign:'center',
      fontSize: 32,
      fontFamily: "SourceSansPro-Bold",
      fontWeight: "800"

  }
});