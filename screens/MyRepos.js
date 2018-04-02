import React, { Component } from 'react';
import {View, FlatList, Text, StyleSheet, Button, Alert, Linking, AsyncStorage} from 'react-native';
import RepoList from './RepoList';


/**
 * The Repos Class for MyGitHub app. Lists all the public
 * repositories for the user.
 *
 * @author: Anshuman Dikhit
 */
export default class MyRepos extends Component {

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
		console.log("MyRepos....");
        var user = await AsyncStorage.getItem('handle');
        var authToken = await AsyncStorage.getItem('authToken');
        await this.setState({
            isLoading: false,
            username: user,
            authToken: authToken
        });
    }
    
    /**
     * render invokes a component called RepoList, implemented in a 
     * separate file.
     */
    render() {
		console.log("MyRepos....    2");
        if(this.state.isLoading == true)
            return null;
        
		console.log("MyRepos....    3");
        return(
            <View style = {styles.mainbackground}>
                <Text style = {styles.title}>Public Repositories</Text>
                <RepoList style = {styles.background} 
                    username = {this.state.username} 
                    authToken = {this.state.authToken}
                    navigation = {this.props.navigation}
				/>
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
