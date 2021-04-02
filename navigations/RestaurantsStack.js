import React from 'react'
import { View, Text } from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import Restaurant from '../screens/restaurants/Restaurant'
import AddRestaurant from '../screens/restaurants/AddRestaurant'
import Rest from '../screens/restaurants/Rest'

const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='restaurants'
                component={Restaurant}
                options={{title: 'Restaurantes'}}
            />
             <Stack.Screen
                name='add-restaurant'
                component={AddRestaurant}
                options={{title: 'Crear Restaurante'}}
            />
             <Stack.Screen
                name='restaurant'
                component={Rest}
            />
        </Stack.Navigator>
    )
}
