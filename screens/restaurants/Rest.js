import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import Loading from '../../components/Loading'
import { getDocumentById } from '../../utils/actions'
import CarouselImages from '../../components/restaurants/CarouselImages'

const widthScreen = Dimensions.get('window').width

export default function Rest({navigation, route}) {

    const [restaurant, setRestaurant] = useState(null)
    const {id, name} = route.params
    const [activeSlide, setActiveSlide] = useState(0)

    navigation.setOptions({title: name})

    useEffect(() => {
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
            <Text>{restaurant.description}</Text>
        </ScrollView>
    )
    }

const styles = StyleSheet.create({
    viewBody:{
        flex:1
    }
})
