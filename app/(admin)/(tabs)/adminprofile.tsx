import { View, Text, ScrollView, Alert, Image, StyleSheet, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import Palette from "../../../Constants/Palette";
import { Session } from "@supabase/supabase-js";
import { userType } from "../../../Constants/Types";
import * as SecureStore from 'expo-secure-store';
import { supabase } from "../../../supabase";

// import { supabase } from "../../../../supabase";
// import ProfileDetails from "../../../../components/profiledetails";
import { Link } from "expo-router";

export default function Profile() {
    console.log("Here")
    // const [age, setAge] = useState(0);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<userType>()

    useEffect(() => {
        getDetails()
    }, []);
  
    // const calculateAge = async() => {
    //     setLoading(true)
    //     if(user){
    //         const newBirthday = new Date(user.birthday)
    //         setBirthdayString(newBirthday.toDateString())
    //         const currentDate = new Date();
    //         const difference = currentDate.getTime() - newBirthday.getTime();
    //         const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
    //         await setAge(calculatedAge);
    //     }
    //     setLoading(false)
        
    // }
    const getDetails = async () => {
        setLoading(true)
        const userid = await SecureStore.getItemAsync("id")

        try{
            const { data, error, status } = await supabase
            .from('users')
            .select()
            .eq("id", userid)
            .single()

            if(error && status !== 406){
                throw error;
            }
    
            if(data){
              setUser(data)
            }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }



    return (
        <View style={{ flex: 1, backgroundColor: Palette.accent, justifyContent: 'center'}    }>
            {loading ? (
                <></>
            ) : (
                <View>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}}/>
                        <Text style={styles.name}>{user?.firstname} {user?.lastname}</Text>
                        <Text style={styles.number}>{user?.contact_number}</Text>
                        <Text style={styles.number}>{user?.email}</Text>
                        <Text style={styles.number}>{user?.address}</Text>
                        <Link href = {{pathname: "/editworkerpass"}}>
                            <Text style={{textDecorationLine: 'underline', fontFamily: 'Poppins', fontSize: 16}}>Change password?</Text>
                        </Link>
                    </View>
                </View> 
            )} 
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 150,
        width: 150,
        borderRadius: 100,
        alignSelf: 'center'
    },
    header:{
        backgroundColor: 'transparent',
        alignItems: 'center',
        margin: 20
    },
    name: {
        fontFamily: 'Heading',
        fontSize: 25,
        color: 'white',
        marginTop: 10,
        textAlign: 'center'
    },
    number:{
        color: 'white',
        fontFamily: 'Poppins',
        fontSize: 16,
    },
    details:{
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        backgroundColor: Palette.buttonOrLines
    },
    statusheader:{
        flexDirection: 'row',
        margin: 20,
        backgroundColor: 'transparent'
    }
});