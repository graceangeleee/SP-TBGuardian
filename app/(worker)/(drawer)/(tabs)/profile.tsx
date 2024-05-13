import { View, Text, ScrollView, Alert, Image, StyleSheet, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import Palette from "../../../../Constants/Palette";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../../../supabase";
import ProfileDetails from "../../../../components/profiledetails";
import { useWorkerData } from "../../_layout";
import { BackgroundImage } from "react-native-elements/dist/config";
import { Link } from "expo-router";

export default function Profile({ session }: { session: Session }) {
    const {user} = useWorkerData()
    const [age, setAge] = useState(0);
    const [loading, setLoading] = useState(false);
    const [birthdaystring, setBirthdayString] = useState("")

    useEffect(() => {
        if (user) {
            calculateAge();
        }
    }, [user]);
  
    const calculateAge = async() => {
        setLoading(true)
        if(user){
            const newBirthday = new Date(user.birthday)
            setBirthdayString(newBirthday.toDateString())
            const currentDate = new Date();
            const difference = currentDate.getTime() - newBirthday.getTime();
            const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
            await setAge(calculatedAge);
        }
        setLoading(false)
        
    }



    return (
        <View style={{ flex: 1, backgroundColor: Palette.accent}    }>
            {loading ? (
                <></>
            ) : (
                <View>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}}/>
                        <Text style={styles.name}>{user?.firstname} {user?.lastname}</Text>
                        <Text style={styles.number}>{user?.contact_number}</Text>
                        <Text style={styles.number}>{user?.email}</Text>
                        <Link href = {{pathname: "/editworkerpass"}}>
                            <Text style={{textDecorationLine: 'underline', fontFamily: 'Poppins', fontSize: 16}}>Change password?</Text>
                        </Link>
                    </View>
                    <ScrollView style={styles.details}>
                        {/* <View style={styles.statusheader}>
                            <ProfileStatus title="Submitted" detail={10}/>
                            <ProfileStatus title="Pending" detail={50}/>
                            <ProfileStatus title="Missing" detail={0}/>
                        </View> */}
                        <ProfileDetails title="Program" detail={"Placeholder program"}/>
                        <ProfileDetails title="Assigned DOTS Center" detail={"Placeholder center"}/>
                        <ProfileDetails title="Age" detail={age.toString()}/>
                        <ProfileDetails title="Gender" detail={user?.gender}/>
                        <ProfileDetails title="Blood Type" detail={"AB-"}/>
                        <ProfileDetails title="Height" detail={`${user?.height} cm`}/>
                        <ProfileDetails title="Weight" detail={`${user?.weight} kg`}/>
                        <ProfileDetails title="Date of Birth" detail={birthdaystring}/>
                        <ProfileDetails title="Address" detail={user?.address}/>
                    </ScrollView>
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
        marginTop: 10
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