import React from 'react'
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Divider } from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'


import LoginForm from '../../components/account/LoginForm'

export default function Login() {

    return (
        <KeyboardAwareScrollView>
            <Image
                source={require('../../assets/restaurantLogo.png')}
                resizeMode='contain'
                style={styles.image}
            />
            <View style={styles.container}>
                    <LoginForm/>
                    <CreateAccount/>
                    <RecoverPassword/>
            </View>
            <Divider style={styles.divider}></Divider>
        </KeyboardAwareScrollView>
        
    )
}

function RecoverPassword(){
    const navigation = useNavigation()
    return(
        <Text style={styles.register}
            onPress={() => navigation.navigate('recover-Password')}
        >
            ¿Olvidaste tu contraseña?{' '}
            <Text style={styles.btnRegister}>
                Recuperala
            </Text>
        </Text>
    )
}

function CreateAccount(props){
    const navigation = useNavigation()

    return(
        <Text style={styles.register}
            onPress={()=>navigation.navigate('register')}
        >
            ¿Aun no tienes una cuenta?{' '}
            <Text style={styles.btnRegister}>
                Registrate 
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image:{
        height:150,
        width: '100%',
        marginBottom:20
    },
    container:{
        marginHorizontal:40
    },
    divider:{
        backgroundColor:'#e33b04',
        margin:40
    },
    register:{
        marginTop:15,
        marginHorizontal:10,
        alignSelf: 'center'
    },
    btnRegister:{
        color:'#e33b04',
        fontWeight:'bold'
    }
})
