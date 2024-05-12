import { View, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Button} from "react-native";
import { supabase } from "../../supabase";
import { useUserData } from "./_layout";
import React, {useState, useEffect} from "react";
import Palette from "../../Constants/Palette";

const EditPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const {user} = useUserData()
    const [loading, setLoading] = useState(false)

    const handleEditPassword = async() => {
        setLoading(true)
        try{
            if(user!==null){
                const {error} = await supabase.auth.resetPasswordForEmail(
                    user.email,
                )

                if(error){
                    console.log(error)
                }else{
                    const {error} = await supabase.auth.updateUser({password: newPassword})

                    if(error){
                        Alert.alert(error.message)
                    }else{
                        Alert.alert("Successfully changed password")
                    }
                }
            }  
        }catch(error){
            if(error instanceof Error)Alert.alert(error.message)
        }finally{
            setLoading(false)
        }
    }
    
    return(
        <View>
            <Text style={styles.label}>Enter new Password</Text>
            <TextInput
                style={styles.inputfield}
                placeholder="New Password"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={handleEditPassword} style={styles.button}>
                {!loading? ( 
                    <Text style={styles.buttontext}>Edit Password</Text>

                ): (
                    <ActivityIndicator/>
                )}
                
            </TouchableOpacity>
          
        </View>
    )
    
}

const styles = StyleSheet.create({
    label: {
        marginHorizontal: 30,
        marginTop: 10,
        marginBottom: 5,
        fontFamily: 'Poppins',
        fontSize: 16
    },
    inputfield:{
        fontFamily: 'Poppins',
        color: 'black',
        fontSize: 16,
        borderWidth: 1,
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 60,
        alignContent: 'center',
        alignItems: 'center',
    },
    button:{
        backgroundColor: Palette.buttonOrLines,
        margin: 20,
        padding: 15,
        alignItems: 'center',
        borderRadius: 20
    }, 
    buttontext:{
        fontFamily: 'Poppins',
        color: 'white',
        fontSize: 16
    }
})

export default EditPassword;
