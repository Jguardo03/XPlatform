import { collection, onSnapshot, orderBy, query,deleteDoc, doc,getDoc, addDoc} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Game } from "../modules/games";
import { RealUser } from "../modules/user";
import Toast from "react-native-toast-message";




export function getWishListGames(onData: (games: Game[]) => void,onError?: (error: Error) => void){


const user = RealUser();
if (!user) {
    console.error("No user is signed in");
    return()=>{};
}
const q = query(collection(db, "users", user.uid,"wishlist"),orderBy("createdAt", "desc"));
const unsubscribe= onSnapshot(q, (querySnapshot) => {
    const data: Game[] = querySnapshot.docs.map((d) => ({
                        id: d.id,
                        ...(d.data() as Omit<Game, "id">),
    }));
    onData(data);
    },
    (error)=>{
        console.error("Error fetching games:", error);
        onError?.(error);
    }
);
return unsubscribe;
}

export function deleteFromWishlist(game: Game){
    const user = RealUser();
    if (!user) {
        console.error("No user is signed in");
        return()=>{};
    }
    try{
        deleteDoc(doc(db, "users", user.uid, "wishlist", game.id));
        console.log(`Game ${game.title} removed from wishlist.`);
        Toast.show({
            type: 'success',
            text1: 'Removed from Wishlist',
            text2: `${game.title} has been removed from your wishlist.`,
        });
    }catch(e){
        console.error("Error removing game from wishlist:", e);
        Toast.show({
            type: 'error',
            text1: 'Error removing from Wishlist',
            text2: `Could not remove ${game.title} from your wishlist.`,
        });
    };
}

export function addToWishList(game: Game){
    const user = RealUser();
    if (!user) {
        console.error("No user is signed in");
        return()=>{};
    }
    try{
        addDoc(collection(db, "users", user.uid, "wishlist"),{
        gameId: game.id,
        title: game.title,
        coverUrl: game.coverUrl,
        genres: game.genres,
        ratingAvg: game.ratingAvg,
        platforms: game.platforms,
        createdAt: new Date(),
        });
        console.log(`${game.title} added to wishlist`);
        Toast.show({
            type: "success",
            text1: `${game.title} added to wishlist`,
        });
    }catch (e) {
        console.error("Error adding to wishlist:", e);
        Toast.show({
            type: "error",
            text1: "Error adding to wishlist",
        });
    }
}
export  function searchOnWishList(gameid: string, callback:(isInWishList: boolean)=>void){

    const user = RealUser();
    if (!user) {
        console.error("No user is signed in");
        callback(false)
        return()=>{};
    }
    const ref = doc(db, "users", user.uid, "wishlist", gameid);
    const unsubscribe = onSnapshot(ref,(snapshot)=>{
        callback(snapshot.exists());
    });
    return unsubscribe;
}


