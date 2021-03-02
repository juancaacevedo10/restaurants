import React from 'react'
import { View, Text } from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import RestaurantsStack from './RestaurantsStack'
import FavoriteStack from './FavoritesStack'
import AccountStack from './AccountStack'
import TopRestaurantsStack from './TopRestaurantsStack'
import SearchStack from './SearchStack'
import { Icon } from 'react-native-elements'

const Tab = createBottomTabNavigator()

export default function Navigation() {
    
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case 'restaurant':
                iconName = 'compass-outline'
                break;

            case 'favorites':
                iconName = 'heart-outline'
                break;
            
            case 'top-restaurants':
                iconName = 'star-outline'
                break;

            case 'search':
                iconName = 'magnify'
                break;
                
            case 'account':
                iconName = 'home-outline'
                break;
        
            default:
                break;
        }

        return (
            <Icon
                type='material-community'
                name={iconName}
                size={22}
                color={color}
            />
        )

        return 
    }

    return (
       <NavigationContainer>
            <Tab.Navigator
                initialRouteName='restaurant'
                tabBarOptions={{
                    inactiveTintColor:'#ac647c',
                    activeTintColor:'#e33b04'
                }}
                screenOptions={({route}) => ({
                    tabBarIcon: ({color}) => screenOptions(route, color)
                })}
            >
                <Tab.Screen
                    name='restaurant'
                    component={RestaurantsStack}
                    options ={{title:'Restaurantes'}}
                />
                <Tab.Screen
                    name='favorites'
                    component={FavoriteStack}
                    options ={{title:'Favoritos'}}
                />
                <Tab.Screen
                    name='top-restaurants'
                    component={TopRestaurantsStack}
                    options ={{title:'Top 5'}}
                />
                <Tab.Screen
                    name='search'
                    component={SearchStack}
                    options ={{title:'Buscar'}}
                />
                <Tab.Screen
                    name='account'
                    component={AccountStack}
                    options ={{title:'Cuenta'}}
                />
            </Tab.Navigator>   
        </NavigationContainer>
    )
}
