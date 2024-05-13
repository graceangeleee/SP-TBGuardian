import { View, Text, ScrollView, Alert, Image, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import Palette from "../../Constants/Palette";
import ProfileDetails from "../../components/profiledetails";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { userType } from "../../Constants/Types";
import { supabase } from "../../supabase";

export default function Profile() {
    const params = useLocalSearchParams()
    const { patientid } = params 
    const [patient, setPatient] = useState<userType>();
    const [loading, setLoading] = useState(false)
    const [age, setAge] = useState(0);
    const [birthdaystring, setBirthdayString] = useState("")
    
    useEffect(() => {
        getPatientDetails()
        if (patient) {
            calculateAge();
        }
    }, [patient]);

    const getPatientDetails = async () => {
        setLoading(true)
        try{
            const {data, error} = await supabase
            .from('users')
            .select()
            .eq('id', patientid)
            .single()

            if(error){
                console.log(error)
            }else{
                setPatient(data)
            }
        }catch(error){
            if(error instanceof Error) Alert.alert(error.message)
        }finally{
            setLoading(false)
        }
    }

    const calculateAge = async() => {
        setLoading(true)
        if(patient){
            const newBirthday = new Date(patient.birthday)
            setBirthdayString(newBirthday.toDateString())
            const currentDate = new Date();
            const difference = currentDate.getTime() - newBirthday.getTime();
            const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
            await setAge(calculatedAge);
        }
        setLoading(false)
    }

    return (
        <View style={{ flex: 1, backgroundColor: Palette.accent }}>
            {!loading && patient ? (
                <View>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} />
                        <Text style={styles.name}>{patient?.firstname} {patient?.lastname}</Text>
                        <Text style={styles.number}>{patient?.contact_number}</Text>
                        <Text style={styles.number}>{patient?.email}</Text>
            
                    </View>
                    <ScrollView style={styles.details}>
                        <ProfileDetails title="Program" detail={"Placeholder program"} />
                        <ProfileDetails title="Assigned DOTS Center" detail={"Placeholder center"} />
                        <ProfileDetails title="Age" detail={age.toString()} />
                        <ProfileDetails title="Gender" detail={patient?.gender} />
                        <ProfileDetails title="Blood Type" detail={"AB-"} />
                        <ProfileDetails title="Height" detail={`${patient?.height} cm`} />
                        <ProfileDetails title="Weight" detail={`${patient?.weight} kg`} />
                        
                        <ProfileDetails title="Date of Birth" detail={birthdaystring} />
               
                        <ProfileDetails title="Address" detail={patient?.address} />
                    </ScrollView>
                </View>
            ):(
                <ActivityIndicator/>
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