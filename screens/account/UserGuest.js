import React from 'react'
import { Image } from 'react-native'
import { Button } from 'react-native-elements'
import { ScrollView } from 'react-native'
import { StyleSheet, Text, View} from 'react-native'
import Loading from '../../components/Loading'
import {useNavigation} from '@react-navigation/native'

export default function UserGuest() {
    const navigation = useNavigation()
    return (
        <ScrollView
            centerContent
            style={styles.viewBody}
        >
            <Image
                source={require('../../assets/restaurantLogo.png')}
                resizeMode='contain'
                style={styles.image}
           />
           <Text style={styles.title}>
               Consulta Tu perfil en Restaurants
           </Text>
           <Text style={styles.description}>
              ¿Como describirias tu mejor restaurante? busca y visualiza los mejores restaurantes de una forma sencilla, vota cual te ha gustado mas y comenta como ha sido tu experiencia 
           </Text>
           <Button
                buttonStyle={styles.button}
                title='Ver tu perfil'
                onPress={()=> navigation.navigate('login')}
           />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginHorizontal: 30
    },
    image: {
        height:300,
        width: '100%',
        marginVertical:10
    },
    title: {
        fontWeight:'bold',
        fontSize:19,
        marginBottom:10,
        textAlign:'center'
    },
    description: {
        textAlign:'justify',
        marginBottom: 20,
        color:'#e33b04'
    },
    button:{
        backgroundColor:'#e33b04'
    }
})
