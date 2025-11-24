import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
} from "firebase/firestore";
import React, { use, useEffect, useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { auth, db } from "../../lib/firebase";


import { User,updateUserName,updateUserEmail, saveUserPlatforms } from "../../modules/user";
import{ Boxes} from "../../components/boxes"
import { Typography } from "../../components/Typography";
import { updateCurrentUser, updateEmail } from "firebase/auth";


const GAP = 16;
const PAGE_PAD = 16;


type Platform = {
        id: string;
        platform: string;
}






export default function Account(){

    const router = useRouter();
    const [busy,setBusy]=useState(false);
    const [userName, setUserName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [ownedPlatforms, setOwnedPlatforms]=useState<Platform[]>([]);
    const [display,setDisplay]=useState(true);
    const [edit,setEdit]=useState(false);

    const platforms = [
    "Playstation 5",
    "Playstation 4",
    "Xbox Series X/S",
    "Nintendo Switch",
    "Mobile",
    "PC"
    ]
    const [tempOwnedPlatforms, setTempOwnedPlatforms]=useState<string[]>([]);


    const onSelectedPlatform = (platform: string) => {
        setTempOwnedPlatforms(prev => 
            prev.includes(platform)
            ?prev.filter(p => p !== platform)
            :[...prev, platform])
        console.log(tempOwnedPlatforms);
    }
    

    const getUserData = async () => {
        const user = auth.currentUser;
            if (!user) {
                console.error("No user is signed in");
                return;
            }

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as User;
                setUserName(data.username);
                
                setEmail(data.email);
            } else {
            console.log("No such document!");
            }
            const q = query(collection(db, "users", user.uid, "platforms"));
            const snap = await getDocs(q);
            const data: Platform[] = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Platform, "id">),
                
            }));
        setOwnedPlatforms(data);
        // console.info(ownedPlatforms)
    };
    getUserData();


    
    const onEditPressed = () => {
        setDisplay(false);
        setEdit(true);
        
    }

    const onCancelPressed = () => {
        setDisplay(true);
        setEdit(false);
    }

    useEffect(() => {
        if(edit){
            setTempOwnedPlatforms(ownedPlatforms.map(p => p.platform));
        }}, [edit]);


    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace("/"); // navigate back to login
        } catch (e) {
            console.error("Error signing out:", e);
        }
    };
    
    const onSavePressed = async () => {
        setBusy(true);
        const user = auth.currentUser;
        if (!user) {
            console.error("No user is signed in");
            setBusy(false);
            return;
        } 
        updateCurrentUser(auth, user);
        
        updateUserName(user.uid, userName);
        updateUserEmail(user.uid, email);
        updateEmail(user, email).catch((error) => {
            console.error("Error updating email in auth:", error);
        });
        saveUserPlatforms(user.uid, tempOwnedPlatforms, ownedPlatforms.map(p => p.platform));
        setDisplay(true);
        setEdit(false);
        setBusy(false);


    }

    return(
        <ScrollView style={styles.screen}>
            <View style={styles.topBar}>
                <Text style={styles.heading}>Account</Text>
            </View>
            <View style={Boxes.formBox2}>
                <View style={styles.titleBar}>
                    <Text style={Typography.h4}>Profile</Text>
                    <Pressable onPress={onEditPressed}>
                        <Text style={Typography.link2}>Edit</Text>
                    </Pressable>
                </View>
                <View style={styles.iconText}>
                    <Ionicons name="person-outline" size={18} color="white" />
                    <Text style={Typography.subtitle}>Username</Text>
                </View>
                {display &&(
                    <Text style={[Typography.body, Boxes.textImputBox]}>{userName}</Text>
                )}
                {edit &&(
                    <TextInput
                    placeholder={userName}
                    onChangeText={setUserName}
                    style={[Typography.body, Boxes.textImputBox]}/>
                )}
                <View style={styles.iconText}>
                    <Ionicons name="mail-outline" size={18} color="white" />
                    <Text style={Typography.subtitle}>Email</Text>
                </View>
                {display &&(
                    <Text style={[Typography.body, Boxes.textImputBox]}>{email}</Text>
                )}
                {edit && (
                    <TextInput
                    placeholder={email}
                    onChangeText={setEmail}
                    style={[Typography.body, Boxes.textImputBox]}/>
                )}
                <View style={styles.iconText}>
                    <Ionicons name="game-controller-outline" size={18} color="white" />
                    <Text style={Typography.subtitle}>Owned Consoles</Text>
                </View>
                {display &&(
                    <View style={[styles.iconText]}>
                {ownedPlatforms.map((ownedPlatform) => (
                    <View style={styles.option} key={ownedPlatform.platform}>
                        <Text style={[styles.metaSmall,styles.chip]}>{ownedPlatform.platform}</Text>
                    </View>
                ))}
                </View>
                )}
                {edit &&(
                    <>
                        <View style={[{ gap: 8}]}>
                            {platforms.map((platform)=>(
                                <View style={styles.option} key={platform}>
                                <Pressable style={[Boxes.checkBox, {backgroundColor: tempOwnedPlatforms.includes( platform) ? "#3997fbff" : "#000000"}]} onPress={() => onSelectedPlatform(platform)}/>
                                <Text style={Typography.body}>{platform}</Text>
                                </View>
                            ))}
                        </View>
                        <Pressable
                            onPress={onSavePressed}
                            
                            disabled={busy}
                            accessibilityRole="button"
                            style={[Boxes.button, {opacity: busy ? 0.6 : 1}]}>
                            <Text style={[Typography.h4, { color: "#FFFFFF"}]}>{busy ? "Please wait…" : "Save Changes"}</Text>
                        </Pressable>
                        <Pressable
                            onPress={onCancelPressed}
                            disabled={busy}
                            accessibilityRole="button"
                            style={[Boxes.button2]}>
                            <Text style={[Typography.h4, { color: "#FFFFFF"}]}>{busy ? "Please wait…" : "Cancel"}</Text>
                        </Pressable>
                    </>
                )}
                
            </View>
            <View style={Boxes.formBox}>
                <View style={styles.iconButton}>
                    <Ionicons name="exit-outline" size={26} color="red" />
                    <Pressable onPress={handleSignOut}>
                        <Text style={[Typography.subtitle, {color: "red"}]}>Logout</Text>
                    </Pressable>
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
    },
    option: { flexDirection: "row", alignItems: "center", gap: 10 },
    optionColumn: { flexDirection: "column", alignItems: "center", gap: 10 },
    metaSmall: {
    fontSize: 16,
    color: "#60A5fA",
    
    },

    chip: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 6,          // full rounded pill shape
    paddingHorizontal: 10,
    paddingVertical: 4,
    },
    iconButton:{
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
});