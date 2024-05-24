import { View, Text, ScrollView, Alert, Image, StyleSheet, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import Palette from "../../../../Constants/Palette";
import { Session } from "@supabase/supabase-js";
import ProfileDetails from "../../../../components/profiledetails";
import { useUserData } from "../../_layout";
import { Link } from "expo-router";

export default function Profile({ session }: { session: Session }) {
    const {user} = useUserData();
    const [loading, setLoading] = useState(false);
    const [age, setAge] = useState(0);
    const [birthdaystring, setBirthdayString] = useState("")
     const [dateString, setDateString] = useState("")
    
    useEffect(() => {
        if (user) {
            calculateAge();
        }
    }, [user]);

    const calculateAge = async() => {
        setLoading(true)
        if(user){
            const newBirthday = new Date(user.birthday)
            setBirthdayString(newBirthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
            const dateStarted = new Date(user.date_started)
            setDateString( dateStarted.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
            const currentDate = new Date();
            const difference = currentDate.getTime() - newBirthday.getTime();
            const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
            await setAge(calculatedAge);
        }
        setLoading(false)
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Palette.accent }}>
            {!loading && user && (
                <View>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} />
                        <Text style={styles.name}>{user?.firstname} {user?.lastname}</Text>
                        <Text style={styles.number}>{user?.contact_number}</Text>
                        <Text style={styles.number}>{user?.email}</Text>
                        <Link href = {{pathname: "/changepassword"}}>
                            <Text style={{textDecorationLine: 'underline', fontFamily: 'Poppins', fontSize: 16}}>Change password?</Text>
                        </Link>
                    </View>
                    <ScrollView style={styles.details}>

                        <ProfileDetails title="Age" detail={age.toString()} />
                        <ProfileDetails title="Gender" detail={user?.gender} />
             
                        <ProfileDetails title="Height" detail={`${user?.height} cm`} />
                        <ProfileDetails title="Weight" detail={`${user?.weight} kg`} />
                        
                        <ProfileDetails title="Date of Birth" detail={birthdaystring} />
               
                        <ProfileDetails title="Address" detail={user?.address} />
                        <ProfileDetails title="Treatment Regimen" detail={user?.treatment_regimen} />
                        <ProfileDetails title="Disease Class" detail={user?.disease_class} />
                        <ProfileDetails title="Registration Group" detail={user?.registration_group} />
                        <ProfileDetails title="Date Started" detail={dateString} />
                    </ScrollView>
                </View>
            )}
        </ScrollView>
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