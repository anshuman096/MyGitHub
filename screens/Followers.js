import React, { Component } from 'react';
import {View, FlatList, Text, StyleSheet, Button, Alert, Linking, ActivityIndicator, AsyncStorage} from 'react-native';
import {FollowersList} from './FollowersList';


/**
 * The Followers Class for MyGitHub app. Lists all the 
 * followers for the user.
 *
 * @author: Anshuman Dikhit
 */
export default class MyFollowers extends Component {
    constructor(props) {
		super(props);
		this.state = {
			isLoading : true,
			data : '',
            username: '',
            authToken: ''
		}
	}

    async componentWillMount() {
        let user = await AsyncStorage.getItem('handle');
        let storedToken = await AsyncStorage.getItem('authToken');
        console.log('Followers -> componentWillMount user: ' + user);
        await this.setState({
            isLoading: false,
            username: user,
            authToken: storedToken
        });
    }
    
    /**
     * render invokes a component called FollowersList, implemented in a 
     * separate file.
     */
    render() {
        if(this.state.isLoading == true) 
            return null;
        
        return(
            <View style = {styles.mainbackground}>
                <Text style = {styles.title}>Followers</Text>
                <FollowersList style = {styles.background} 
                    username = {this.state.username} 
                    authToken = {this.state.authToken} 
                    navigation = {this.props.navigation}/>
            </View>
        );
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
