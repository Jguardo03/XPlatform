import { useEffect, useState } from "react";
import { searchOnWishList } from "../modules/wishlist";

export function useWishListStatus(gameid: string){
    const [isInWishList, setIsInWishList] = useState(false);

    useEffect(() => {
        const unsubscribe = searchOnWishList(gameid, setIsInWishList);
        return () => unsubscribe();
    }, [gameid]);

    return isInWishList;

}