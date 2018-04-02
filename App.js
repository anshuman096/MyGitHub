import React, { Component } from 'react';
import { ScrollView, 
	Text, 
	TextInput, 
	View, 
	TouchableOpacity, 
	Image, 
	ImageBackground, 
	ActivityIndicator, 
	AsyncStorage, 
	StyleSheet, 
	Alert} from 'react-native';
const base64 = require('base-64'); 
import MyGitHubNavigator from './routes/MyRoutes';

export default class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            isLoggedIn: false,
            password: '',
            isLoading: false,
            authToken: ''
        }
    }

    async saveData(key, value) {
    	await AsyncStorage.setItem(key, value);
    }
    
    _userLogin = () => {
        this.setState({isLoading: true});
        this.state.authToken = 'Basic ' +  base64.encode(this.state.username + ':' + this.state.password);
        this.saveData('authToken', this.state.authToken);
        this.saveData('currentUser', this.state.username);
        this.saveData('handle', this.state.username); //for first login
        fetch('https://api.github.com/user', {
			method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization':this.state.authToken
            }
		}).then((response) => {
                this.setState({isLoading: false});
                if(response.status == 200)
                    this.setState({isLoggedIn: true});    
                else 
                    Alert.alert('Invalid login');
			}).catch((error) => {
			     console.error(error);
		});
    }
    
    
    render() {
        //isLoggedIn is true
        if(this.state.isLoggedIn) {
            return (<MyGitHubNavigator
                //onLogoutPress={() => this.setState({isLoggedIn: false})}
            />);
            //
        } else {
            return (
            <ImageBackground source={require('./images/background.jpg')} style = {styles.backgroundImage} resizeMode={Image.resizeMode.stretch}>
                <ScrollView style={styles.mainContainer}>
                    <View style = {styles.titleContainer}>
                        <Text style={styles.titleLabel}> Git My Hub </Text>
                        <Image source={require('./images/github-512.png')} style = {styles.avatar}/>
                    </View>
                    <View style = {styles.loginContainer}>
                        <TextInput style = {styles.loginLabel} 
                            selectTextOnFocus
                            placeholder='Username' 
                            autoCapitalize = 'none'
                            onChangeText = {(text) => this.setState({username: text})}
                            blurOnSubmit = {true}
                        />
                        <TextInput style = {styles.loginLabel} 
                            placeholder='Password' 
                            selectTextOnFocus 
                            autoCapitalize = 'none'
                            onChangeText = {(text) => this.setState({password: text})}
                            secureTextEntry = {true}
                            onEnter = {this._userLogin}
                        />
                        <View style={{margin:7}} />
                        <TouchableOpacity 
                            style = {styles.viewButton} 
                            disabled = {this.state.isLoggedIn||!this.state.username||!this.state.password} 
                            onPress = {this._userLogin}>
                                <Text style = {styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        <View style={{margin:7}} />
                        <ActivityIndicator size = 'large' color = '#0000ff' animating = {this.state.isLoading} hidesWhenStopped = {true}/>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20
    },
    titleContainer: {
        flex: 20,
        alignItems: 'center'
    },
    loginContainer: {
        flex: 2
    },
    backgroundImage: {
        flex: 1
    },
    avatar: {
        height: 200,
        width: 200,
        paddingBottom: 50
    },
    titleLabel: {
        fontSize: 27,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        paddingBottom: 25
    },
    loginLabel: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontSize: 18,
        paddingTop: 20,
        borderRadius: 8
    },
    viewButton: {
        backgroundColor: '#f5f5f5',
        padding:10,
        borderRadius: 4
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20
    }
});

