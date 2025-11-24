import { use } from "react";
import { auth, db } from "../lib/firebase";
import { collection, doc, setDoc,writeBatch,WriteBatch } from "firebase/firestore";



//Define user structure for Firestore data
export type User = {
    uid: string;
    email: string;
    username: string;
    createdAt: Date;
    avatarUrl: string;
}

export function RealUser(){
    const user = auth.currentUser;
    if (!user){
        console.error("No user is signed in");
        return null;
    }
    return user;
}

export async function saveUserPlatforms(userId: string, selectedPlatforms: string[], previousPlatforms: string[]){
    const batch = writeBatch(db);
    const platformsRef = collection(db,"users",userId,"platforms");
//Add Platform
    selectedPlatforms.forEach(platform =>{
        const platformId = platform.toLowerCase().replace(/\s+/g, '-');
        const docRef = doc(platformsRef,platformId);
        batch.set(docRef,{platform});})
//Remove Unselected platforms
    previousPlatforms.forEach(platform =>{
        if(!selectedPlatforms.includes(platform)){
            const platformId = platform.toLowerCase().replace(/\s+/g, '-');
            const docRef = doc(platformsRef,platformId);
            batch.delete(docRef);
        }});
        await batch.commit();

    
}

export async function updateUserName(userId:string, newUserName:string){
    const userRef = doc(db,"users",userId);
    await setDoc(userRef,{username:newUserName},{merge:true});
}

export async function updateUserEmail(userId:string, newEmail:string){
    const userRef = doc(db,"users",userId);
    await setDoc(userRef,{email:newEmail},{merge:true});
}
