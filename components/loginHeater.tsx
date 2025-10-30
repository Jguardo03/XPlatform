import React from 'react';
import {View,Text,StyleSheet,Image  } from "react-native";
import { Typography } from '../components/Typography';



const LoginHeater = () => {
    const styles = StyleSheet.create({
        container:{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            gap:20,
            paddingTop:40,
            paddingBottom:20,
            paddingHorizontal:20,
            backgroundColor:'#111827',
        },
        logo:{
            width:100,
            height:80,
        },
        
    });
    return (
        <View style={styles.container} >
            <Image style={styles.logo}
            source={require('../assets/images/Logo.png')} />
            <Text style={Typography.h1}>GAMESEERR</Text>
        </View>
    );
}

export default LoginHeater;