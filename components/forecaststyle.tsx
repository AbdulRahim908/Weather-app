import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { WeatherForecast } from '../App';
import { useFonts } from 'expo-font';
import dayjs from 'dayjs';
import React from 'react';
const ForecastItem=({forecast}:{forecast:WeatherForecast})=>{
    return(
        <BlurView intensity={20}  style={styles.container}>
        <Text style={styles.temp}>{Math.round(forecast.main.temp)}°</Text>
        <Text style={styles.date}>{dayjs(forecast.dt*1000).format('ddd h a')}</Text>
      </BlurView >

    );
    

}
const styles =StyleSheet.create({
    container:{
    // backgroundColor:'ghostwhite'
    padding:10,
    aspectRatio:3/4,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
    overflow: 'hidden',
    borderColor:'gainsboro',
    borderWidth:1
    },
    temp:{
        fontSize:30,
        fontFamily:'Inter-Black',
        letterSpacing:5,
        color:'snow'
    },
    date:{
        fontWeight:'bold',
        fontSize:16,
        color:'snow'

    }
});
export default ForecastItem