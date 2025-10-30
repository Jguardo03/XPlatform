import { useEffect, useState } from "react";
import { Text, View, Pressable,TextInput, ScrollView, StyleSheet } from "react-native";
import app, { auth, db } from "../../lib/firebase";
import LoginHeater from "../../components/loginHeater";
import { Typography } from '../../components/Typography';
import {Boxes} from '../../components/boxes';
import { useRouter } from "expo-router";

export default function Index() {

    const router = useRouter();

    const style = StyleSheet.create({
        option:{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            gap:10,
        }
    });
    return(
        <ScrollView>
            <LoginHeater/>
            <View style={Boxes.formBox}>
                <View>
                    <Text style={Typography.h2}>Create Account</Text>
                    <Text style={Typography.subtitle}>Sign up to get started!</Text>
                </View>
                <View>
                    <Text style={Typography.h4}>Email</Text>
                    <TextInput placeholder="your@example.com" keyboardType="email-address" style={[Boxes.textImputBox, Typography.placeholder]}/>
                </View>
                <View>
                    <Text style={Typography.h4}>Password</Text>
                    <TextInput placeholder="**********" secureTextEntry={true} style={[Boxes.textImputBox, Typography.placeholder]} />
                </View>
                <View>
                    <Text style={Typography.h4}>Confirm Password</Text>
                    <TextInput placeholder="**********" secureTextEntry={true} style={[Boxes.textImputBox, Typography.placeholder]} />
                </View>
                <View style={{display:'flex',gap:8}}>
                    <Text style={Typography.h4}>Owned Consoles</Text>
                    <View style={style.option}>
                        <Pressable style={Boxes.checkBox}></Pressable>
                        <Text style={Typography.body}>PlayStation 5</Text>
                    </View>
                    <View style={style.option}>
                        <Pressable style={Boxes.checkBox}></Pressable>
                        <Text style={Typography.body}>PlayStation 4</Text>
                    </View>
                    <View style={style.option}>
                        <Pressable style={Boxes.checkBox}></Pressable>
                        <Text style={Typography.body}>Xbox Series X/S</Text>
                    </View>
                    <View style={style.option}>
                        <Pressable style={Boxes.checkBox}></Pressable>
                        <Text style={Typography.body}>Nintendo Switch</Text>
                    </View>
                    <View style={style.option}>
                        <Pressable style={Boxes.checkBox}></Pressable>
                        <Text style={Typography.body}>Mobile</Text>
                    </View>
                    <View style={style.option}>
                        <Pressable style={Boxes.checkBox}></Pressable>
                        <Text style={Typography.body}>PC</Text>
                    </View>
                </View>
                <Text style={[Boxes.button, Typography.h4, {color:'#FFFFFF'}]} onPress={()=>{}}>Sign Up</Text>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:5}}>
                    <Text style={Typography.subtitle}>Already have an account?</Text>
                    {/* fix navigation usage, router not working properly */}
                    <Text style={Typography.link} onPress={() => {router.back()}}>Log In</Text>
                </View>
            </View>
        </ScrollView>
    );
}