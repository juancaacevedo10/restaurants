import { useFocusEffect } from '@react-navigation/core'
import React, { useCallback, useRef, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import Toast from 'react-native-easy-toast'
import { Button, Icon, Image } from 'react-native-elements'
import { deleteFavorite, getFavorites } from '../utils/actions'
import firebase from 'firebase/app'
import Loading from '../components/Loading'



export default function Favorites({ navigation }) {
    
    const toastRef = useRef()

    const [restaurants, setRestaurants] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)
    
    firebase.auth().onAuthStateChanged((user)=>{
        user ? setUserLogged(true) : setUserLogged(false)
    })
    
    useFocusEffect(
        useCallback(() => {
            if (userLogged) {
                async function getData() {
                    setLoading(true)
                    const response = await getFavorites()
                    setRestaurants(response.favorites)
                    setLoading(false)
                }
                getData()
            }
            setReloadData(false)
        }, [userLogged, reloadData])
    )

    if (!userLogged) {
        return <UserNoLogged navigation={navigation}/>
    }


    if (!restaurants) {
        return <Loading isVisible={true} text="Cargando restaurantes..."/>
    } else if(restaurants?.length === 0){
        return <NotFoundRestaurants/>
    }

    return (
        <View style={styles.viewBody}>
            {
                restaurants ? (
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(restaurant) => (
                            <Restaurant 
                                restaurant={restaurant}
                                setLoading={setLoading}
                                toastRef={toastRef}
                                navigation={navigation}
                                setReloadData={setReloadData}
                            />
                        )}
                    />
                ):(
                    <View style={styles.loaderRestaurant}>
                        <ActivityIndicator size='large' />
                        <Text style={{textAlign:'center'}}>
                            Cargando restaurantes...
                        </Text>

                    </View>
                )
            }
            <Toast ref={toastRef} position='center'/>
            <Loading isVisible={loading} text='por favor espere ...'/>
        </View>
    )
}

function Restaurant({restaurant, setLoading, toastRef, navigation, setReloadData}){
    const { id, name, images} = restaurant.item

    const confirmRemoveFavorite = () => {
        Alert.alert(
            'Eliminar restaurante de favorito',
            'Esta seguro que desea eliminar de favoritos',
            [
                {
                    text:'no',
                    style:'cancel'
                },
                {
                    text:'Si',
                    onPress: removeFavorite
                }
            ],
            {
                cancelable:false
            }
        )
    }

    const removeFavorite = async() => {
        setLoading(true)
        const response = await deleteFavorite(id)
        setLoading(false)
        if(response.statusResponse){
            setReloadData(true)
            toastRef.current.show('Restaurante eliminado de favoritos', 3000)
        }else{
            toastRef.current.show('No se pudo eliminar el restaurante de favoritos', 3000)
        }

    }

    return (
        <View style={styles.restaurant}>
            <TouchableOpacity 
                onPress={() => navigation.navigate('restaurants', {
                    screen: 'restaurant',
                    params: {id, name},
                })}
            >
                <Image
                    resizeMode='cover'
                    style={styles.image}
                    placeholderContent={<ActivityIndicator color='#fff'/>}
                    source={{uri:images[0]}}
                />
            </TouchableOpacity>
            <View style={styles.info}>
                <Text style={styles.name}>
                    {name}
                </Text>
                <Icon
                    type='material-community'
                    name='heart'
                    color='#f00'
                    containerStyle={styles.favorite}
                    underlayColor='transparent'
                    onPress={confirmRemoveFavorite}
                />
            </View>

        </View>
    )

}

function NotFoundRestaurants() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Aún no tienes restaurantes favoritos.
            </Text>
        </View>
    )
}

function UserNoLogged({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Necesitas estar logueado para ver los favoritos.
            </Text>
            <Button
                title="Ir al Login"
                containerStyle={{ marginTop: 20, width: "80%" }}
                buttonStyle={{ backgroundColor: "#442484" }}
                onPress={() => navigation.navigate("account", { screen: "login" })}
            />
        </View>
    )
}



const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:'#f2f2f2'
    },
    loaderRestaurant:{
        marginVertical:10
    },
    restaurant: {
        margin:10
    },
    image:{
        width:'100%',
        height:100
    },
    info: {
        flex:1,
        alignItems: 'center',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingHorizontal:20,
        paddingVertical:10,
        marginTop:-30,
        backgroundColor:'#fff'
    },
    name: {
        fontWeight:'bold',
        fontSize:20
    },
    favorite: {
        marginTop:-35,
        backgroundColor:'#fff',
        padding:15,
        borderRadius:100
    }

})
