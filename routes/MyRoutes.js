import React, {Component} from 'react';
import {View, 
	Text, 
	StyleSheet, 
	TouchableOpacity, 
	ActivityIndicator} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';

import MyRepos from '../screens/Repos';
import MyRepoDetails from '../screens/RepoDetails';
import CoolRepoDetails from '../screens/CoolRepoDetails';
import MyGitHub from '../screens/MyGitHub';
import MyFollowers from '../screens/Followers';
import MyFollowing from '../screens/Following';
import MyNotifications from '../screens/Notifications';


export const MyRepoNavigator = StackNavigator({
  Repos : {
    screen: MyRepos,
  },
  RepoDetails : {
    screen: MyRepoDetails,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.repo.name}`,
    }),
  },
  CoolRepoDetails : {
    screen: CoolRepoDetails,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.repo.name}`,
    }),
  },
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
        screen: MyRepoNavigator,
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
                            onPress = {() => {navigation.navigate('Followers', {date: new Date()});}}
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
    },
    Notifications: {
        screen: MyNotifications,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: ({tintColor}) => <TouchableOpacity
                            onPress = {() => {navigation.navigate('Notifications', {date: new Date()});}}
                            style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style = {styles.infoLabel}>Notifications</Text>
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

const styles = StyleSheet.create({
    infoLabel: {
        fontSize: 10,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: 'Avenir',
        color: '#a9a9a9'
    },
});

