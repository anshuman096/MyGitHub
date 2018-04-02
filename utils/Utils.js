import {AsyncStorage} from "react-native";


function sortRepos(a, b) {
	if(a.stargazers_count < b.stargazers_count)
		return -1;
	if(a.stargazers_count > b.stargazers_count)
		return 1;
	return 0;
}

function sortFollowers(a, b) {
	var a_followers = 0;
	var b_followers = 0;

	fetch(a.html_url, {
		method: 'GET',
		headers: {
			'Content-Type':'applications/json'
		}
	}).then((response) => {
		response.json()
	}).then((responseJson) => {
		a_followers = responseJson.followers;
	});

	fetch(b.html_url, {
		method: 'GET',
		heades: {
			'Content-Type':'applications/json'
		}
	}).then((response) => {
		response.json()
	}).then((responseJson) => {
		b_followers = responseJson.followers;
	});

	if(a_followers < b_followers)
		return -1;
	if(a_followers > b_followers)
		return 1;
	return 0;
}



async function search(key, field, text) {
    let data = await AsyncStorage.getItem(key);
    var searchData = JSON.parse(data);
    var results = [];
    for(i = 0; i < searchData.length; i++) {
        item = searchData[i];
		currText = item[field];
        if (currText.includes(text))
		    results.push(item);
    }
	if(results.length > 1) {
		if(field == 'name')
			results.sort(sortRepos);
		else
			results.sort(sortFollowers);
	} 
    return results.reverse();
}   

module.exports.search = search;
