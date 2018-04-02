import React, { Component } from "react";
import { View, Text, FlatList, Linking, AsyncStorage } from "react-native";
import { List, ListItem } from "react-native-elements";


/**
 * This class uses a FlatList component to list out
 * all the public notifications. Some code was taken from
 * a tutorial. The FollowersList, FollowingList, and RepoList use the same tutorial
 * code.
 *
 * source: https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6
 */ 

 export default class NotificationsList extends Component {

 	constructor(props, type) {
 		super(props);

 		this.state = {
 			isLoading: false,
 			data: [],
 			page: 1,
 			error: null,
 			refreshing: false,
 			username: ''
 		}
 	}


 	/**
     * componentWillMount is called before the initial render.
     * This method gets the JSON information of all the notifications for the 
     * mainUser
     *
     */
     async componentWillMount() {
     	const{ page, seed} = this.state;
     	await this.setState({isLoading: true});
     	var url = 'https://api.github.com/notifications';
     	let response = await fetch(url, {
     		method: 'GET',
     		headers: {
     			'Content-Type':'applications/json',
     			'Authorization':this.props.authToken
     		}
     	});

     	let responseJson = await response.json();

     	await this.setState({
     		data: responseJson,
     		isLoading: false
     	});
     }


     /**
      *shouldComponentUpdate for notificationsList
      *
      */
     async shouldComponentUpdate(nextProps) {
     	//do nothing for now
     }


     render() {
     	if(this.state.isLoading == true)
     		return null;
     	
     	return(
     		<List>
     			<FlatList
     				data = {this.state.data}
     				renderItem = {({item}) => {
     					return(<ListItem
     						roundAvatar
     						title = {item.subject.title}
     						avatar = {{uri: item.repository.owner.avatar_url}}
     						subtitle = {item.reason}
     					/>);
     				}}
     				keyExtractor = {item => item.id}
     			/>
     		</List>
     	);
     }

 }