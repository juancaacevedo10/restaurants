import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Navigation from './navigations/Navigation'
import {LogBox} from 'react-native'
import { startNotifications } from './utils/actions';

LogBox.ignoreAllLogs()
export default function App() {

  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    startNotifications(notificationListener, responseListener)
  }, [])

  return (
    <Navigation/>
  );
}


