import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Palette from "../../Constants/Palette";
import ProfileDetails from "../../components/profiledetails";
import { useLocalSearchParams } from "expo-router";
import { userType } from "../../Constants/Types";
import { supabase } from "../../supabase";
import { submissionType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";

export default function Profile() {
    const params = useLocalSearchParams();
    const { workerid } = params;
    const [worker, setWorker] = useState<userType>();
    const [loading, setLoading] = useState(false);
    const [age, setAge] = useState(0);
    const [birthdayString, setBirthdayString] = useState("");

    useEffect(() => {
        getWorkerDetails();
        
    }, []);

    const getWorkerDetails = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("users")
                .select()
                .eq("id", workerid)
                .single();

            if (error) {
                console.log(error);
            } else {
                setWorker(data);
                calculateAge(data.birthday);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

   

    const calculateAge = (birthday: string) => {
        const newBirthday = new Date(birthday);
        setBirthdayString(newBirthday.toDateString());
        const currentDate = new Date();
        const difference = currentDate.getTime() - newBirthday.getTime();
        const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
        setAge(calculatedAge);
    };

   

    return (
        <View style={styles.container}>
            {loading || !worker ? (
                <ActivityIndicator style={styles.loader} />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} />
                        <Text style={styles.name}>{worker?.firstname} {worker?.lastname}</Text>
                        <Text style={styles.info}>{worker?.contact_number}</Text>
                        <Text style={styles.info}>{worker?.email}</Text>
                    </View>
                    <View style={styles.details}>
                        <ProfileDetails title="Age" detail={age.toString()} />
                        <ProfileDetails title="Gender" detail={worker?.gender} />
                        <ProfileDetails title="Height" detail={`${worker?.height} cm`} />
                        <ProfileDetails title="Weight" detail={`${worker?.weight} kg`} />
                        <ProfileDetails title="Date of Birth" detail={birthdayString} />
                        <ProfileDetails title="Address" detail={worker?.address} />
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.accent,
    },
    loader: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    name: {
        fontFamily: 'Heading',
        fontSize: 25,
        color: 'white',
        marginTop: 10,
    },
    info: {
        color: 'white',
        fontFamily: 'Poppins',
        fontSize: 16,
        marginBottom: 5,
    },
    details: {
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        backgroundColor: Palette.buttonOrLines,
        padding: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    switch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    switchText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white',
    },
    selected: {
        backgroundColor: Palette.accent,
    },
});
