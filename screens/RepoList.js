import React, { Component } from "react";
import { View, Text, FlatList, Linking, AsyncStorage } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { search } from '../utils/Utils'; 

/**
 * This class uses a FlatList component to list out
 * all the public repositories. Some code was taken from
 * a tutorial. The FollowersList and FollowingList use the same tutorial
 * code.
 *
 * source: https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6
 */ 
export default class RepoList extends Component {
    constructor(props, type) {
        super(props);

        this.state = {
            isLoading: false,
            data: [],
            starred: [],
            page: 1,
            error: null,
            refreshing: false,
            username: ''
        };
    }


    /**
     * componentWillMount is called before the initial render.
     * This method gets the JSON information of all the repos for the 
     * mainUser, and after that goes through each JSON object to check 
     * whether the specific repository is starred or not.
     *
     */
    async componentWillMount() {
        const { page, seed } = this.state;
        var url = 'https://api.github.com/users/' + this.props.username + '/repos';
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization':this.props.authToken
            }
        });

        let responseJson = await response.json();

        await this.setState({
            username: this.props.username,
            data: responseJson
        });

        var starredList = {};
        for(i = 0; i < responseJson.length; i++) {
            item = responseJson[i];
            isStarred = false;
            var starredUrl = 'https://api.github.com/user/starred/' + item.owner.login + '/' + item.name;
            let isStarredResponse = await fetch(starredUrl, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':this.props.authToken
                }
            });
            isStarred = (isStarredResponse.status == 204);
            starredList[item.name] = isStarred;
        }


        await this.setState({
            starred: starredList,
            isLoading: false
        });

        //console.log('RepoList -> componentWillMount data: ' + JSON.stringify(this.state.data));

        var key = this.props.username + '_repos';
        console.log('RepoList -> componentWillMount key: ' + key);
        await AsyncStorage.setItem(key, JSON.stringify(this.state.data));
    }



    /**
     * shouldComponentUpdate is called when the components props 
     * have been changed or updated. shouldComponentUpdate has the 
     * same functionality as that of componentWillMount, but should 
     * be running the code on the updated user. Should not be called
     * on initial render.
     *
     * @nextProps: the new props passed into shouldComponentUpdate
     */
    async shouldComponentUpdate(nextProps, nextStates) {
        let nextUser = await AsyncStorage.getItem('handle');
        if(this.state.username) {
            if (this.state.username != nextUser) {
                await this.setState({username : nextUser});
                await this.getRepoData(nextUser);
            } else 
                return false;
        } else
            return false;
    }

    async getRepoData(username) { 
        this.setState({ isLoading: true });
        var url = 'https://api.github.com/users/' + username + '/repos';
        let response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type':'application/json'}
        });

        let responseJson = await response.json();

        await this.setState({
            username: username,
            data: responseJson
        });

        var starredList = {};
        for(i = 0; i < responseJson.length; i++) {
            item = responseJson[i];
            isStarred = false;
            var starredUrl = 'https://api.github.com/user/starred/' + item.owner.login + '/' + item.name;
            let isStarredResponse = await fetch(starredUrl, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':this.props.authToken
                }
            });
            isStarred = (isStarredResponse.status == 204);
            starredList[item.name] = isStarred;
        }


        await this.setState({
            starred: starredList,
            isLoading: false
        })
        var key = username + '_repos';
        await AsyncStorage.setItem(key, JSON.stringify(this.state.data));
    }




    /**
     * A function called when the 'star repo' switch is toggled.
     * Depeneding on the current status of the switch, a PUT or DELETE
     * ReST API call is sent to github.com/user/starred/reponame.
     *
     * @owner: The owner of the repository
     * @name: The name of the repository
     * @currentStatus: whether the repo is currently starred or not (a boolean)
     */
    async starRepo(owner, name, currentStatus) {
        var url = 'https://api.github.com/user/starred/' + owner + '/' + name;
        var apiCall = '';

        if(currentStatus == false)
            apiCall = 'PUT';
        else
            apiCall = 'DELETE';

        console.log('ReposList -> starRepo apiCall: ' + apiCall + ' ' + name);

        let response = await fetch(url, {
            method: apiCall,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.authToken
            }
        });

        var newStatus = (response.status == 204);
        return newStatus;
        
    }

    /**
     * A method that will filter JSON objects from AsyncStorage
     * of repositories of a user based upon search text criteria
     *
     * @text: the search text
     */
    async searchRepoText(text) {
        var key = this.state.username + '_repos';
        let results = await search(key, 'name', text);
        this.setState({
            data : results
        }); 
    } 

	launchRepoDetails(repo) {
		if (repo.owner.login.includes("anshuman096")) {
			this.props.navigation.navigate('CoolRepoDetails', {repo: repo});
		} else {
			this.props.navigation.navigate('RepoDetails', {repo: repo});
		}
	}
    
    
    /**
     * The final render function that is called after either 
     * componentWillMount or shouldComponentUpdate. Will take 
     * JSON information for each users repositories and will render it
     * as well as it's switch to show whether repository is starred or not
     *
     */
    render() {
        if(this.state.isLoading == true)
            return null;

        return (
            <List>
                <SearchBar
                    platform='ios'
                    cancelButtonTitle = 'Cancel'
                    placeholder = 'Search'
                    autoCapitalize = 'none'
                    onChangeText = {(text) => {this.searchRepoText(text)}}/>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => {
                        //console.log('RepoList -> render: ' + item.name + ' isStarred is: ' + this.state.starred[item.name]); 
                        return (<ListItem
                            roundAvatar
                            title = {`${item.name} ${item.owner.login}`}
                            switchButton
                            switched = {this.state.starred[item.name]}
                            onSwitch = {() => {
                                this.switchFollowers(item.owner.login, item.name, this.state.starred[item.login])
                            }}
                            avatar={{ uri: item.owner.avatar_url }}
                            subtitle={item.description}
							onPress={() => {
								this.launchRepoDetails(item);
							}}
						/>);
                    }}
                keyExtractor={item => item.id} 
            />
        </List>
    );
	//onPress={() => { Linking.openURL(item.html_url) }}
    }
}


