import { StyleSheet } from 'react-native';

// Define all box styles
export const Boxes = StyleSheet.create({
    formBox:{
        display:'flex',
        flexDirection:'column',
        margin:20,
        paddingVertical:20,
        paddingHorizontal:40,
        gap:20,
        backgroundColor:'#111827',
        borderRadius:10,
    },

    textImputBox:{
        backgroundColor:'#000000',
        padding:15,
        borderRadius:5,
    },
    button:{
        display:'flex',
        backgroundColor:'#497ff5ff',
        padding:15,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
    },
    
});