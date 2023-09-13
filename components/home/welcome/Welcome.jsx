import React from 'react'
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import { useRouter } from 'expo-router'

import styles from './welcome.style'
import { icons, SIZES, COLORS, FONTS } from '../../../constants'

const Welcome = () => {
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Hello Adrian </Text>
        <Text style={styles.welcomeMessage}>Find your perfect job </Text>
      </View>
    </View>
  )
}

export default Welcome