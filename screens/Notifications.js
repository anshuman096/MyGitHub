import React, { Component } from 'react';
import {View, FlatList, Text, StyleSheet, Button, Alert, Linking, AsyncStorage } from 'react-native';
import NotificationsList from './NotificationsList';


/**
 * The Notifications Class for MyGitHub app. Lists all the public
 * notifications for the user.
 *
 * @author: Anshuman Dikhit
 */
 export default class MyNotifications extends Component {

 	constructor(props) {
 		super(props);
 		this.state = {
 			isLoading: true,
 			data: '',
 			username: '',
 			authToken: ''
 		}
 	}

 	async componentWillMount() {
 		var user = await AsyncStorage.getItem('currentUser');
 		var authToken = await AsyncStorage.getItem('authToken');
 		await this.setState({
 			isLoading: false,
 			username: user,
 			authToken: authToken
 		});
 	}

 	render() {
 		if(this.state.isLoading == true)
 			return null;
 		else {
 			return (
 				<View style = {styles.mainbackground}>
 				<Text style = {styles.title}>Notifications</Text>
 				<NotificationsList style = {styles.background}
 					username = {this.state.username}
 					authToken = {this.state.authToken}
 					navigation = {this.props.navigation}/>
 				</View>
 			);
 		}
 	}
 }


 const styles = StyleSheet.create({
    mainbackground: {
        backgroundColor: 'steelblue'
    },
    background: {
        backgroundColor: 'powderblue'
    },
    title: {
        fontSize: 25,
        paddingTop: 20,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        alignSelf: 'center',
    }
});