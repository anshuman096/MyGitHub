import {AsyncStorage} from "react-native";


/**
 * A utilities function for getting a JSON object of the
 * respective api url passed in
 *
 */
async function getData(url, authToken) {

    console.log("Utils --> URL " + url);
    console.log("Utils --> authToken " + authToken);
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization': authToken
        }
    });
    let responseJson = await response.json();
    return responseJson;
} 

/**
 * A comparator function for sorting repositories
 *
 */
function sortRepos(a, b) {
	if(a.stargazers_count < b.stargazers_count)
		return -1;
	if(a.stargazers_count > b.stargazers_count)
		return 1;
	return 0;
}


/**
 * A comparator function for sorting followers
 *
 */
async function sortFollowers(a, b, authToken) {
	var a_followers = 0;
	var b_followers = 0;


	let responseJsonA = await getData(a.html_url, authToken);
	let responseJsonB = await getData(b.html_url, authToken);

	a_followers = responseJsonA.followers;
	b_followers = responseJsonB.followers;

	if(a_followers < b_followers)
		return -1;
	if(a_followers > b_followers)
		return 1;
	return 0;
}



async function search(key, field, text, authToken) {
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
module.exports.getData = getData;
