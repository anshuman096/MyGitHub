/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { getData } from '../utils/Utils'; 
import Timeline from 'react-native-timeline-listview'

/**
 * This class uses the react-native-timeline-listview component
 * to create a timeline of commit history for just the main
 * users repositories.
 *
 * @author: Anshuman Dikhit
 */
export default class CoolRepoDetails extends Component {
  constructor(props) {
	super(props);
    this.state = {
        isLoading:true,
        data:[],
		event:[],
        contributors: '',
        forks: ''
	}
  }

  /**
   * componentWillMount will be called before render
   */
  async componentWillMount() {
	console.log("CoolRepoDetails  -->   componentWillMount ");
	var repo = this.props.navigation.state.params.repo;
	var authToken = this.props.navigation.state.params.authToken;

	url = "https://api.github.com/repos/" + repo.full_name + "/commits";
	let commitJsonData = await getData(url, authToken);
    let commitJson = await commitJsonData.json();

    contributorsUrl = "https://api.github.com/repos/" + repo.full_name + "/stats/contributors";
    let contributorsData = await getData(contributorsUrl, authToken);
    let contributorsJSON = await contributorsData.json();


	results = [];
	for (i = 0; i < commitJson.length; i++) {
		var item = commitJson[i];
		//console.log(JSON.stringify(item));
		commitInstance = { time: item.commit.author.date, title: item.commit.author.name, description: item.commit.message };
		results.push(commitInstance);
	}

	//console.log(JSON.stringify(results));
    var contributorsString = 'Contributors: ' + contributorsJSON.length;
    var forkString = 'Forks: ' + this.props.navigation.state.params.repo.forks_count;

	this.setState({
		data: results,
		repo: repo,
        contributors: contributorsString,
        forks: forkString,
		isLoading: false
	});

  } 


  render() {
	console.log("CoolRepoDetails  -->   render ");
	if(this.state.isLoading == true)
        return null;
	//console.log(JSON.stringify(this.state.data));
    return (
      <View style={styles.container}>
		<Text style={styles.title}>{this.state.repo.full_name}</Text>
		<Text style={styles.field}>{this.state.repo.description}</Text>
        <View style={styles.repoInfo}>
            <Text style={styles.field}>{this.state.contributors}</Text>
            <Text style={styles.field}>{this.state.forks}</Text>
        </View>
        <Timeline 
          style={styles.list}
          data={this.state.data}
          circleSize={20}
          circleColor='rgb(45,156,219)'
          lineColor='rgb(45,156,219)'
          timeContainerStyle={{minWidth:52, marginTop: -5}}
          timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
          descriptionStyle={{color:'gray'}}
          options={{
            style:{paddingTop:5},
			removeClippedSubviews: false
          }}
          innerCircle={'dot'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor:'white'
    },
    list: {
        flex: 1,
        marginTop:20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        paddingTop: 5,
        paddingBottom: 8
    },
    field: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        fontFamily: 'Avenir',
        color: '#a9a9a9'
    },
    repoInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
