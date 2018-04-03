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
import ChartView from 'react-native-highcharts';
import { getData } from '../utils/Utils'; 

export default class RepoDetails extends Component {
  constructor(props) {
	super(props);
    this.state = {
        isLoading:true,
        data:[],
		contributors: '',
	}
  }

  async componentWillMount() {
	console.log("CoolRepoDetails  -->   componentWillMount ");
	var repo = this.props.navigation.state.params.repo;
	var authToken = this.props.navigation.state.params.authToken;

	url = "https://api.github.com/repos/" + repo.full_name + "/stats/contributors";
	let contributorsData = await getData(url, authToken);
    let contributors = await contributorsData.json();
	
	var results = [];
	var rDict = {};
	for (i = 0; i < contributors.length; i++) {
		var contrib = contributors[i];

		for (k = 0; ((k < 26) && (k < contrib.weeks.length)); k++) {
			// check if timestamp exists in a hashmap if it does add to the count
			var timestamp = 1000 * contrib.weeks[k].w;	
			var commitCount = contrib.weeks[k].c;
			if(rDict[timestamp])
                rDict[timestamp] = rDict[timestamp] + commitCount;
            else
                rDict[timestamp] = commitCount;
		}
	}

    sorted = []
    for(var key in rDict)
        sorted[sorted.length] = key;
    sorted.sort();

    for(k = 0; k < sorted.length; k++) 
        results.push({x: parseInt(sorted[k]), y: rDict[sorted[k]]});

	var contributorString = 'Contributors ' + contributors.length;
	var forkString = 'Fork ' + this.props.navigation.state.params.repo.forks_count;

	this.setState({
		data: results,
		repo: repo,
		contributors: contributorString,
		forks: forkString,
		isLoading: false
	});

  } 

  render() {
	console.log("RepoDetails  -->   render ");
	if(this.state.isLoading == true)
        return null;
	var Highcharts='Highcharts';
    var conf={
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: 'Commits Per Week'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
					text: 'Commits Per Week',
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
				name: 'Commits Weekly Statistics',
                data: this.state.data
            }]
        };
 
    const options = {
        global: {
            useUTC: false
        },
        lang: {
            decimalPoint: ',',
            thousandsSep: '.'
        }
    };
 

    return (
		<View style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>{this.state.repo.full_name}</Text>
				<Text style={styles.field}>{this.state.repo.description}</Text>
			</View>
			<View style={styles.highlights}>
				<Text style={styles.field}>{this.state.contributors}</Text>
				<Text style={styles.field}>{this.state.forks}</Text>
			</View>
			<View style={styles.charts}>
				<ChartView style={{height:300}} config={conf} options={options}></ChartView>
			</View>

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
    heading: {
	   padding: 10,
    },
    highlights: {
        flex: 4,
	   flexDirection: 'row',
	   justifyContent: 'space-between'
    },
    charts: {
        flex: 10,
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
});
