import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { auth, db } from "../../lib/firebase";

import{Game} from "../../modules/games";
import { User } from "../../modules/user";
import{ Boxes} from "../../components/boxes"
import { Typography } from "../../components/Typography";


const GAP = 16;
const PAGE_PAD = 16;

export default function Account(){

    return(
        <ScrollView style={styles.screen}>
            <View style={styles.topBar}>
                <Text style={styles.heading}>Account</Text>
            </View>
            <View style={Boxes.formBox2}>
                <View style={styles.titleBar}>
                    <Text style={Typography.h4}>Profile</Text>
                    <Pressable>
                        <Text style={Typography.link2}>Edit</Text>
                    </Pressable>
                </View>
                <View style={styles.iconText}>
                    <Ionicons name="person-outline" size={18} color="white" />
                    <Text style={Typography.subtitle}>Username</Text>
                </View>
                <Text style={[Typography.body, Boxes.textImputBox]}>Username</Text>
                <View style={styles.iconText}>
                    <Ionicons name="mail-outline" size={18} color="white" />
                    <Text style={Typography.subtitle}>Email</Text>
                </View>
                <Text style={[Typography.body, Boxes.textImputBox]}>example@email.com</Text>
                <View style={styles.iconText}>
                    <Ionicons name="game-controller-outline" size={18} color="white" />
                    <Text style={Typography.subtitle}>Owned Consoles</Text>
                    
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#0b1220",
        paddingTop: 40,
    },
        topBar: {
        paddingHorizontal: PAGE_PAD,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    heading: { color: "#F3F4F6", fontSize: 22, fontWeight: "800" },
    signOut: { color: "#60A5FA", fontSize: 14, fontWeight: "600" },
    iconText: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    }, 
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    }


});