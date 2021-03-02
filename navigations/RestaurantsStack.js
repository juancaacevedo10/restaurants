import React from 'react'
import { View, Text } from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import Restaurant from '../screens/Restaurant'

const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='restaurants'
                component={Restaurant}
                options={{title: 'Restaurantes'}}
            />
        </Stack.Navigator>
    )
}
