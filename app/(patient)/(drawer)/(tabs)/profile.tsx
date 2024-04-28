import { View, Text, ScrollView, Alert, Image, StyleSheet, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import Palette from "../../../../Constants/Palette";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../../../supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileStatus from "../../../../components/profilestatus";
import ProfileDetails from "../../../../components/profiledetails";


export default function Profile({ session }: { session: Session }) {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [address, setAddress] = useState("");
    const [birthday, setBirthday] = useState(new Date());
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        retrieveData();
    }, [session]);

    useEffect(()=>{
        calculateAge()
    }, [birthday])

    async function retrieveData(){
        setLoading(true);
        try {
            const id = await AsyncStorage.getItem("id");
            if (id !== null) {
                getProfile(id);
            } else {
                console.log("No id");
            }
        } catch (error) {
            console.log("Error retrieving data");
        }
    }

    async function getProfile(userid: string){
        try {
            setLoading(true);
            if (userid === null || userid === "") {
                throw new Error('No user logged in');
            } else {
                const { data, error, status } = await supabase
                    .from('users')
                    .select()
                    .eq('id', userid)
                    .single();
                
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    console.log(data);
                    setFirstname(data.firstname);
                    setLastname(data.lastname);
                    setAddress(data.address);
                    setEmail(data.email);
                    setContact(data.contact_number);
                    setGender(data.gender);
                    setHeight(data.height);
                    setWeight(data.weight);
                    setBirthday(new Date(data.birthday));
    
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const calculateAge = () => {
        const currentDate = new Date();
        const difference = currentDate.getTime() - birthday.getTime();
        const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
        setAge(calculatedAge);
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Palette.accent }}>
            {loading ? (
                <></>
            ) : (
                <View>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}}/>
                        <Text style={styles.name}>{firstname} {lastname}</Text>
                        <Text style={styles.number}>{contact}</Text>
                        <Text style={styles.number}>{email}</Text>
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
                        <ProfileDetails title="Gender" detail={gender}/>
                        {/* <ProfileDetails title="Blood Type" detail={"AB-"}/> */}
                        <ProfileDetails title="Height" detail={`${height} cm`}/>
                        <ProfileDetails title="Weight" detail={`${weight} kg`}/>
                        <ProfileDetails title="Date of Birth" detail={birthday.toISOString().split('T')[0]}/>
                        <ProfileDetails title="Address" detail={address}/>
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
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