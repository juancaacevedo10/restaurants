import React, {useState, useEffect} from 'react'
import { StyleSheet } from 'react-native'
import { isUserLogged} from '../../utils/actions'
import Loading from '../../components/Loading'

import UserGuest from './UserGuest'
import UserLogged from './UserLogged'


export default function Account() {

  const [login, setLogin] = useState(null)

    useEffect(() => {
        setLogin(isUserLogged())
    }, [])

  if (login == null){
      return <Loading isVisible={true} text='cargando...'/>
  }

    return login ? <UserLogged/> : <UserGuest/>
}

const styles = StyleSheet.create({})