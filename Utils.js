import {AsyncStorage} from "react-native";


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
    return results;
}   

module.exports.search = search;