import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import {Rating, ListItem, Icon, Input, Button} from 'react-native-elements'
import {isEmpty, map} from 'lodash'
import {useFocusEffect} from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import ListRevews from '../../components/restaurants/ListRevews'
import MapRestaurant from '../../components/restaurants/MapRestaurant'
import Loading from '../../components/Loading'
import { deleteFavorite, getIsFavorite, addDocumentWithoutId, getDocumentById, getCurrentUser, sendPushNotification, setNotificationMessage, getUsersFavorite } from '../../utils/actions'
import { callNumber, formatPhone, sendEmail, sendWhatsApp } from '../../utils/helpers'
import CarouselImages from '../../components/restaurants/CarouselImages'
import Modal from '../../components/Modal'

const widthScreen = Dimensions.get('window').width

export default function Rest({navigation, route}) {

    const toastRef = useRef()
    const [restaurant, setRestaurant] = useState(null)
    const {id, name} = route.params
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [modalNotification, setmodalNotification] = useState(false)


    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)
    })

    useEffect(() => {
        (async()=> {
            if (userLogged && restaurant) {
                const response = await getIsFavorite(restaurant.id)
                response.statusResponse && setIsFavorite(response.isFavorite) 
            }
        })() 
       }, [userLogged, restaurant])

    navigation.setOptions({title: name})

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getDocumentById('restaurants', id)
    
                if(response.statusResponse){
                    setRestaurant(response.document)
                }else {
                    setRestaurant({})
                    Alert.alert('Ocurrio un problema cargando el restaurante. Intente mas tarde.')
                }
            })()
        }, [])
    )

    const addFavorite = async() => {
        if (!userLogged) {
            toastRef.current.show('Para agregar el restaurante a favoritso debes estar logueado', 3000)
            return
        }
       setLoading(true)
       const response = await addDocumentWithoutId("favorites", {
        idUser: getCurrentUser().uid,
        idRestaurant: restaurant.id
    })
       setLoading(false)
       if (response.statusResponse) {
           setIsFavorite(true)
           toastRef.current.show('Restaurante añadido a favoritos', 3000)
       }else{
           toastRef.current.show('No se pudo adicionar el restaurante a favoritos. Por favor intenta mas tarde', 3000)
       }
    }   

    const removeFavorite = async() => {
        setLoading(true)
        const response = await deleteFavorite(restaurant.id)
        setLoading(false)

        if (response.statusResponse) {
            setIsFavorite(false)
            toastRef.current.show('Restaurante eliminado de favoritos', 3000)
        }else{
            toastRef.current.show('No se pudo eliminar el restaurante a favoritos. Por favor intenta mas tarde', 3000)
        }

    }

    if(!restaurant){
        return <Loading isVisible={true} text='Cargando...'/>
    }

    return (
        <ScrollView style={styles.viewBody}>
            
            <CarouselImages
                images={restaurant.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorite}>
                <Icon
                    type='material-community'
                    name={ isFavorite ? 'heart' : 'heart-outline'}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    color={'#e33b04'}
                    size={35}
                    underlayColor='tranparent'
                />
            </View>
        <TitleRestaurant
            name={restaurant.name}
            description={restaurant.description}
            rating={restaurant.rating}
        />

        <RestaurantInfo
            name={restaurant.name}
            location={restaurant.location}
            address={restaurant.address}
            email={restaurant.email}
            phone={formatPhone(restaurant.callingCode, restaurant.phone)}
            currentUser={currentUser}
            callingCode={restaurant.callingCode}
            phoneNoFormat={restaurant.phone}
            setLoading={setLoading}
            setmodalNotification={setmodalNotification}
        />

        <ListRevews
            navigation={navigation}
            idRestaurant={restaurant.id}
        />

        <SendMessage 
            modalNotification={modalNotification}
            setmodalNotification={setmodalNotification}
            setLoading={setLoading}
            restaurant={restaurant}
        />
        <Toast ref={toastRef} position='center' opacity={0.9}/>
        <Loading isVisible={loading} text='Por favor espere ...'/>
        </ScrollView>
    )
    }

function SendMessage ({modalNotification, setmodalNotification, setLoading, restaurant}){
    const [title, setTitle] = useState(null)
    const [errorTitle, setErrorTitle] = useState(null)
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)


    const sendNotification = async() => {

        if(!validForm()){
            return
        }

        setLoading(true)
        
        const userName = getCurrentUser().displayName ? getCurrentUser().displayName : 'Anonimo'
        const theMessage = `${message}, del restaurante ${restaurant.name}`

        const userFavorite = await getUsersFavorite(restaurant.id)
        if(!userFavorite.statusResponse){
            setLoading(false)
            Alert.alert('Error al obtener los usuarios que aman el restaurante')
            return
        }

        await Promise.all(
            map(userFavorite.users, async(user) =>{
                const messageNotification = setNotificationMessage(
                    user.token,
                    `${userName}, dijo: ${title}`,
                    theMessage,
                    {
                        data: theMessage
                    }
                )
                 await sendPushNotification(messageNotification)        
            })
        )

        
        setLoading(false)
        setTitle(null)
        setMessage(null)
        setmodalNotification(false)
    }

    const validForm = () => {
        let isValid = true

        if(isEmpty(title)){
            setErrorTitle('Debes ingresar un titulo a tu mensaje.')
            isValid=false
        }
        if(isEmpty(message)){
            setErrorMessage('Debes ingresar un mensaje')
            isValid=false
        }

        return isValid
    }

    return(
        <Modal
            isVisible={modalNotification}
            setVisible={setmodalNotification}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.textModal}>
                    Enviale un mensaje a los amantes de {restaurant.name}
                </Text>
                <Input
                    placeholder='Titulo del mensaje...'
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    errorMessage={errorTitle}
                />
                <Input
                    placeholder='Mensaje...'
                    multiline
                    inputStyle={styles.textArea}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    errorMessage={errorMessage}
                />
                <Button
                    title='Enviar mensaje'
                    buttonStyle={styles.btnSend}
                    containerStyle={styles.btnSendContainer}
                    onPress={sendNotification}
                />
            </View>

        </Modal>
    )
}

function TitleRestaurant({name, description, rating}){
        return(
            <View style={styles.viewRestaurantTitle}>
                <View style={styles.viewRestaurantContainer}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
                </View>
                <Text style={styles.descriptionRestaurant}>{description}</Text>
            </View>
    
        )
}

function RestaurantInfo({name, location, address, email, phone, currentUser, callingCode, phoneNoFormat, setLoading, setmodalNotification}){
    const listInfo = [
        {
            type:'addres',
            text: address,
            iconLeft: 'map-marker',
            iconRight: 'message-text-outline'

        },
        {
            type:'phone',
            text: phone,
            iconLeft: 'phone',
            iconRight: 'whatsapp'
            
        },
        {
            type:'email',
            text: email,
            iconLeft: 'at',
            actionLeft: 'sendEmail', 

        }
    ]

    const actionLeft = (type) => {
        if(type == 'phone'){
            callNumber(phone)
        }else if(type=='email'){
            if(currentUser){
                sendEmail(email, 'Interesado', `soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            }else{
                sendEmail(email, 'Interesado', `Estoy interesado en sus servicios`)
            }
        }
    }

    const actionRight = (type) => {
        if(type == 'phone'){
            if(currentUser){
                sendWhatsApp(`${callingCode}${phoneNoFormat}`, `soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            }else{
                sendWhatsApp(`${callingCode}${phoneNoFormat}`, `Estoy interesado en sus servicios`)
            }
        }else if(type == 'addres'){
            setmodalNotification(true)
        }
    }


    return(
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles. restaurantInfoTitle}>
                Informacion sobre el restaurante
            </Text>
            <MapRestaurant
                location={location}
                name={name}
                height={150}
            />
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon
                            type='material-community'
                            name={item.iconLeft}
                            color='#e33b04'
                            onPress={() => actionLeft(item.type)}
                        />
                        <ListItem.Content>
                            <ListItem.Title>
                                {item.text}
                            </ListItem.Title>
                        </ListItem.Content>
                        {
                            item.iconRight && (
                                <Icon
                                    type='material-community'
                                    name={item.iconRight}
                                    color='#e33b04'
                                    onPress={() => actionRight(item.type)}
                                />
                            )
                        }
                        
                    </ListItem>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:'#fff'
    },
    viewRestaurantTitle: {
        padding:15
    },
    viewRestaurantContainer:{
        flexDirection:'row'
    },
    descriptionRestaurant:{
        marginTop: 8,
        color:'gray',
        textAlign:'justify'
    },
    rating:{
        position:'absolute',
        right:0
    },
    nameRestaurant:{
        fontWeight:'bold'
    },
    viewRestaurantInfo:{
        margin:15,
        marginTop:25
    },
    restaurantInfoTitle:{
        fontSize: 20,
        fontWeight:'bold',
        marginBottom:15
    },
    containerListItem: {
        borderBottomColor:'#e33b04',
        borderBottomWidth:1
    },
    viewFavorite:{
        position:'absolute',
        top:0,
        right:0,
        backgroundColor:'#fff',
        borderBottomLeftRadius:100,
        padding:5,
        paddingLeft:15
    },
    textArea:{
        height:50,
        paddingHorizontal:10
    },
    btnSend:{
        backgroundColor: '#e33b04'
    },
    btnSendContainer:{
        width:'95%'
    },
    textModal:{
        color:'#000',
        fontSize:10,
        fontWeight:'bold'
    },
    modalContainer:{
        justifyContent:'center',
        alignItems:'center'
    }
})

