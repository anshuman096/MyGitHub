import React, { Component } from 'react';
import {View, FlatList, Text, StyleSheet, Button, Alert, Linking, AsyncStorage} from 'react-native';
import {FollowingList} from './FollowingList';


/**
 * The Following Class for MyGitHub app. Lists all the users
 * the current user is following.
 *
 * @author: Anshuman Dikhit
 */
export default class MyFollowing extends Component {
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
        var user = await AsyncStorage.getItem('handle');
        var storedToken = await AsyncStorage.getItem('authToken');
        console.log('Followers -> componentWillMount user: ' + user);
        this.setState({
            isLoading: false,
            username: user,
            authToken: storedToken
        });
    }
    

    
    render() {
        if(this.state.isLoading == true) {
            return null;
        }
        return(
            <View style = {styles.mainbackground}>
                <Text style = {styles.title}>Following</Text>
                <FollowingList style = {styles.background} 
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
