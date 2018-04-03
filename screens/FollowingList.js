import React, { Component } from "react";
import { View, Text, FlatList, Linking, AsyncStorage } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { search } from '../utils/Utils';
const base64 = require('base-64'); 

/**
 * This class uses a FlatList component to list out
 * all users the current user follows. Some code was taken from
 * a tutorial. The FollowersList and RepoList use the same tutorial
 * code.
 *
 * source: https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6
 */ 
export class FollowingList extends Component {
    constructor(props, type) {
        super(props);

        this.state = {
            isLoading: true,
            data: [],
            following: [],
            page: 1,
            error: null,
            refreshing: false,
            username: ''
        };
    }
    

    /**
     * This method is called right before the initial render. This method
     * gets information on all the users the current user is following, with a GET
     * api call. It goes through each JSON object, checks whether the user is 
     * followed or not, and sets their followed status accordingly
     *
     */
    async componentWillMount() {
        const { page, seed } = this.state;
        var url = 'https://api.github.com/users/' + this.props.username + '/following';
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization':this.props.authToken
            }
        });

        let responseJson = await response.json();

        await this.setState({
            data: responseJson
        });

        var followingList = {};
        for(i = 0; i < responseJson.length; i++) {
            item = responseJson[i];
            isFollowing = false;
            var followers_url = 'https://api.github.com/user/following/' + item.login;
            let isFollowingResponse = await fetch(followers_url, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': this.props.authToken
                }
            });
            isFollowing = (isFollowingResponse.status == 204);
            //console.log('FollowerList -> componentWillMount 1: ' + item.login + ' isFollowing is: ' + isFollowing); 
            followingList[item.login] = isFollowing;
        }

        this.setState({
            following: followingList,
            isLoading: false,
            username: this.props.username
        })

        var key = this.props.username + '_following';
		console.log("Setting into FOLLOWING KEY " + key);
        await AsyncStorage.setItem(key, JSON.stringify(this.state.data));
    };



    /**
     * A method that is called only when FollowingList receives or has its 
     * props updated. Its functionality is similar to that of componentWillMount
     *
     * @nextProps: a set of the props being passed in
     */
    async shouldComponentUpdate(nextProps) {
        let nextUser = await AsyncStorage.getItem('handle');
        if(this.state.username) {
            if(this.state.username != nextUser) {
                await this.setState({
                    username: nextUser
                });
                var url = 'https://api.github.com/users/' + nextUser + '/following';

                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':this.props.authToken
                    }
                });

                let responseJson = await response.json()||[];
                await this.setState({data:responseJson});

                var followingList = {};
                for(i = 0; i < responseJson.length; i++) {
                    item = responseJson[i];
                    isFollowing = false;
                    var followers_url = 'https://api.github.com/use/following/' + item.login;
                    let isFollowingResponse = await fetch(followers_url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.props.authToken
                        }
                    });
                    isFollowing = (isFollowingResponse.status == 204);
                    followingList[item.login] = isFollowing;

                }

                this.setState({
                    following: followingList,
                    isLoading: false
                });

                var key = this.state.username + '_following';
				console.log("Setting into FOLLOWING KEY " + key);
                await AsyncStorage.setItem(key, JSON.stringify(this.state.data));
            } else {
                return false;
            }
        }
    }


    /**
     * A method that allows the user to toggle between following and unfollowing
     * a user. If the main User already follows the toggled user, then the api call
     * is DELETE, else it is PUT.
     *
     * @login: handle of the user on the switch
     * @curentStatus: status of whether login is currently followed or not
     */
    async switchFollowers(login, currentStatus) {
        var url = 'https://api.github.com/user/following/' + login;
        console.log('FollowingList -> switchFollowers url: ' + url);
        var apiCall = '';
        if(currentStatus == false)
            apiCall = 'PUT';
        else
            apiCall = 'DELETE';

        console.log('FollowersList -> switchFollowers apiCall: ' + apiCall);

        let response = await fetch(url, {
            method: apiCall,
            headers: {
                'Content-Type':'application/json',
                'Authorization':this.props.authToken
            }
        });

        var newStatus = (response.status == 204);
        return newStatus;
    }    



    /**
    * A method that will filter JSON objects from AsyncStorage
    * of users the user is following based upon search text criteria
    *
    * @text: the search text
    */
    async searchFollowingText(text) {
        console.log('FollowersList -> searchFollowingText username: ' + this.state.username);
        var key = this.state.username + '_following';
        let results = await search(key, 'login', text);
        this.setState({
            data: results
        });
    }
    
    /**
     * Having stored all the data in state.data, render uses
     * FlatList and ListItems to render each item in the JSON
     * data structure and displays them as a list
     */
    render() {
        if(this.state.isLoading == true) 
            return null;

        console.log('FollowingList -> render: ' + JSON.stringify(this.state.following));
        return (
            <List>
                <SearchBar
                    platform = 'ios'
                    cancelButtonTitle = 'Cancel'
                    placeholder = 'Search'
                    autoCapitalize = 'none'
                    onChangeText = {(text) => {this.searchFollowingText(text)}}/>
                <FlatList
                    data={this.state.data}
                    renderItem={({item}) => {
                        return (<ListItem
                                    roundAvatar
                                    title = {item.login}
                                    switchButton
                                    switched = {this.state.following[item.login]}
                                    onSwitch = {() => {
                                        this.switchFollowers(item.login, this.state.following[item.login])
                                    }}
                                    avatar={{ uri: item.avatar_url }}
                                    onPress={() => {
                                        this.props.navigation.navigate('Home', {username: item.login})
                                    }}
                                />
                        );
                    }}
                    keyExtractor={item => item.id}
                />
           </List>
         );
    }
}

