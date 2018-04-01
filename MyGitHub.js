import React, {Component} from 'react';
import {View, FlatList, Image, Text, StyleSheet, Button, Alert, ScrollView, TouchableOpacity, Linking, AsyncStorage, ActivityIndicator} from 'react-native';
import {TabNavigator} from 'react-navigation';
import MyRepos from './Repos';
import MyFollowers from './Followers';
import MyFollowing from './Following';
const base64 = require('base-64'); //useful in creating a login page

/**
 * The Main Class for MyGitHub app. Provides basic data
 * on GitHub user, and has navigation to repository lists,
 * follower lists, and following lists.
 *
 * @author: Anshuman Dikhit
 */
class MyGitHub extends Component {

	constructor(props) {
		super(props);
		this.state = {
            mainUser: '',
            username: '',
            authToken: '',
			isLoading : true,
			data : ''
		}
	}
    
    
   /**
    * A method to be run before the render() function can be 
    * called. This method makes a GET ReST API call to GitHub with
    * the users handle and password (password is not secure atm), and returns
    * a JSON object with all the information on the user.
    *
    */
	async componentWillMount() {
        let currUser = await AsyncStorage.getItem('currentUser');
        let user = await AsyncStorage.getItem('handle');
        let authToken = await AsyncStorage.getItem('authToken');
        await this.setState({
            mainUser:currUser,
            username:user,
            authToken:authToken
        });

        var url = 'https://api.github.com/users/' + user;
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        });

        let responseJson = await response.json();

        await this.setState({
            isLoading: false,
            data: responseJson
        });
        // store data in asynchronous storage
        await AsyncStorage.setItem('name', this.state.data.name);
        await AsyncStorage.setItem('handle', this.state.data.login);
        if(this.state.data.blog == '')
            await AsyncStorage.setItem('website', this.state.data.html_url);
        else
            await AsyncStorage.setItem('website', this.state.data.blog);
        await AsyncStorage.setItem('Date', this.state.data.created_at);
        await AsyncStorage.setItem('Bio', this.state.data.bio);
	}



    async shouldComponentUpdate(nextProps) {
        if(nextProps.navigation.state.params && nextProps.navigation.state.params.username) {
            // console.log('MyGitHub -> shouldComponentUpdate nextUser: ' + nextProps.navigation.state.params.username);
            // console.log('MyGitHub -> this.state.username: ' + this.state.username);
            if(this.state.username != nextProps.navigation.state.params.username) {
                //console.log('MyGitHub -> shouldComponentUpdate must re-render');
                await AsyncStorage.setItem('handle', nextProps.navigation.state.params.username);
                var url = 'https://api.github.com/users/' + this.state.username;

                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.state.authToken
                    }
                });

                let responseJson = await response.json();

                await this.setState({
                    username: nextProps.navigation.state.params.username,
                    data: responseJson
                });
                return true;
            } else 
                return false;
        } else 
            return false;
        
    }
    
    /**
     * The render function for the main component. Displays title,
     * avatar, name, handle, email, bio, navigation to public repositories,
     * followers, and following
     * 
     */
	render() {
        let pic = {
            uri:this.state.data.avatar_url
        };
        
        // sets website to blog, if not blog then html_url
        var website = this.state.data.blog;
        if(this.state.data.blog == '')
            website = this.state.data.html_url;
            
        
        if(this.state.isLoading == true) {
            return(<ActivityIndicator size = 'large' color = '#0000ff' animating = {this.state.isLoading} />);
        }
        // placement of components for UI of main page
		return(
            <ScrollView style = {styles.mainContainer}>
                <View style = {{alignItems: 'flex-start', flexDirection: 'row'}}>
                    <Button onPress={() => {
                        console.log('MyGitHub render mainUser: ' + this.state.mainUser);
                        this.props.navigation.navigate('Home', {username: this.state.mainUser});}} title = 'Home'/>
                </View>
                <View style = {styles.titleContainer}>
                    <Image source = {pic} style = {styles.avatar}/>
                    <Text style = {styles.title}>{this.state.data.name}</Text>
                </View>
            
                <View style = {styles.userInfoContainer}>
            
                    <View style = {{flexDirection: 'row'}}>
                        <Text style = {styles.infoLabel} >Handle: </Text>
                        <Text style = {styles.infoLabel} >{this.state.data.login}</Text>
                    </View>
            
                    <View style = {{flexDirection: 'row'}}>
                        <Text style = {styles.infoLabel} >Website: </Text>
                        <Text style = {styles.infoLabel} >{website}</Text>
                    </View>

                    <View style = {{flexDirection: 'row'}}>
                        <Text style = {styles.infoLabel} >Date: </Text>
                        <Text style = {styles.infoLabel} >{this.state.data.created_at}</Text>
                    </View>

                    <View style = {{flexDirection: 'row'}}>
                        <Text style = {styles.infoLabel} >Email: </Text>
                        <Text style = {styles.infoLabel} >{this.state.data.email}</Text>
                    </View>

                    <View style = {{flexDirection: 'row'}}>
                        <Text style = {styles.infoLabel} >Bio: </Text>
                        <Text style = {styles.infoLabel} >{this.state.data.bio}</Text>
                    </View>

                </View>
                <View style = {{margin: 50}}/>
            </ScrollView>
        );
    }
}


// stylesheet for all placement and visual aspects of UI
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 50
    }, 
    titleContainer: {
        flex: 3,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    editContainer: {
        alignItems: 'flex-end'  
    },
    userInfoContainer: {
        flex: 2,
        alignItems: 'flex-start'
    },
    avatar: {
        width: 250,
        height: 250,
        borderRadius: 125,
        paddingTop: 100
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        paddingTop: 20
    },
    infoLabel: {
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: 'Avenir',
        color: '#a9a9a9'
    },
    modifyValue: {
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: 'Avenir',
        color: 'steelblue'
    }
});



//StackNavigator that determines navigation of all
//page within the app.
let routeConfigs = {
    Home: {
        screen: MyGitHub,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: ({tintColor}) => <TouchableOpacity
                            onPress = {() => {navigation.navigate('Home', {date: new Date()});}}
                            style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style = {styles.infoLabel}>Profile</Text>
                        </TouchableOpacity>
        })
    },
    Repos: {
        screen: MyRepos,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: ({tintColor}) => <TouchableOpacity
                            onPress = {() => {navigation.navigate('Repos', {date: new Date()});}}
                            style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style = {styles.infoLabel}>Repos</Text>
                        </TouchableOpacity>
        })
    },
    Followers: {
        screen: MyFollowers,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: ({tintColor}) => <TouchableOpacity
                            onPress = {() => {
                                //console.log('MyGitHub navigation followers username: ' + this.state.data);
                                navigation.navigate('Followers', {date: new Date()});
                            }}
                            style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style = {styles.infoLabel}>Followers</Text>
                        </TouchableOpacity>
        })
    },
    Following: {
        screen: MyFollowing,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: ({tintColor}) => <TouchableOpacity
                            onPress = {() => {navigation.navigate('Following', {date: new Date()});}}
                            style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style = {styles.infoLabel}>Following</Text>
                        </TouchableOpacity>
        })
    }
};

let tabNavigatorConfig = {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true
};

const MyGitHubNavigator = TabNavigator(routeConfigs, tabNavigatorConfig);

export default MyGitHubNavigator;
