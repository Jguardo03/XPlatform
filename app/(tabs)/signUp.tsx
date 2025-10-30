import { useEffect, useState } from "react";
import { Text, View, StyleSheet,TextInput } from "react-native";
import app, { auth, db } from "../../lib/firebase";
import LoginHeater from "../../components/loginHeater";
import { Typography } from '../../components/Typography';
import {Boxes} from '../../components/boxes';

export default function Index() {
    return(
        <View>
            <LoginHeater/>
        </View>
    );
}