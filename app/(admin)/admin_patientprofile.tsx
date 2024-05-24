import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Palette from "../../Constants/Palette";
import ProfileDetails from "../../components/profiledetails";
import { useLocalSearchParams } from "expo-router";
import { userType } from "../../Constants/Types";
import { supabase } from "../../supabase";
import { submissionType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";
import { Calendar } from "react-native-calendars";

export default function Profile() {
    const params = useLocalSearchParams();
    const { patientid } = params;
    const [patient, setPatient] = useState<userType>();
    const [loading, setLoading] = useState(false);
    const [age, setAge] = useState(0);
    const [birthdayString, setBirthdayString] = useState("");
    const [donePressed, setDonePressed] = useState(true);
    const [missingPressed, setMissingPressed] = useState(false);
    const [missing, setMissing] = useState<submissionType[]>([]);
    const [done, setDone] = useState<submissionType[]>([]);
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { selected?: boolean, marked?: boolean, selectedColor?: string, customStyles?: { container: { backgroundColor: string } } } }>({});
    // const [markedMissing, setMarkedMissing] = useState<{ [date: string]: { marked: boolean, selectedColor?: string, dotColor?: string, activeOpacity?: number } }>({});   
    const [dateString, setDateString] = useState("")

    useEffect(() => {
        getPatientDetails();
        getMissing();
        getDone();
        setdDates()
    }, []);

    const getPatientDetails = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("users")
                .select()
                .eq("id", patientid)
                .single();

            if (error) {
                console.log(error);
            } else {
                setPatient(data);
            
                calculateAge(data.birthday, data.date_started);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getMissing = async () => {
        setLoading(true);
        try {
            const date = new Date().toISOString();
            const { data, error, status } = await supabase
                .from("submissions")
                .select()
                .eq("patientid", patientid)
                .eq("status", "FALSE")
                .lt("deadline", date);

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setMissing(data);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const setdDates = async () => {
        setLoading(true);
        try {
            const date = new Date().toISOString();
            const { data, error, status } = await supabase
                .from("submissions")
                .select()
                .eq("patientid", patientid)
                .lt("deadline", date);

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setMissing(data);
                const modifiedObject: { [date: string]: { marked: boolean, selectedColor?: string, dotColor?: string, activeOpacity?: number, customStyles?: { container: { backgroundColor: string } } } } = {};

                data.forEach(obj => {
                    const dateKey = obj.deadline;
                    const dotColor = obj.verified === "TRUE" ? 'green' : 'red';
                    const customStyle = { container: { backgroundColor: obj.verified === "TRUE" ? 'green' : 'red' } }; // Define customStyles object correctly
                    modifiedObject[dateKey] = { marked: true, dotColor: dotColor, customStyles: customStyle }; // Modify as needed
                  });
                
                setMarkedDates(modifiedObject)
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getDone = async () => {
        setLoading(true);
        try {
            const { data, error, status } = await supabase
                .from("submissions")
                .select()
                .eq("patientid", patientid)
                .eq("status", "TRUE");

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setDone(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (birthday: string, date_started: string) => {
            const newBirthday = new Date(birthday);
            setBirthdayString(newBirthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
          
            // Perform null check on patient.date_started
            const dateStarted =  new Date(date_started)
            setDateString(dateStarted.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
          
            const currentDate = new Date();
            const difference = currentDate.getTime() - newBirthday.getTime();
            const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
            setAge(calculatedAge);
     
        
    };

    const toggleUnverified = () => {
        if (!donePressed) {
            setDonePressed(true);
            setMissingPressed(false);
        }
    };

    const toggleVerified = () => {
        if (!missingPressed) {
            setMissingPressed(true);
            setDonePressed(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading || !patient ? (
                <ActivityIndicator style={styles.loader} />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} />
                        <Text style={styles.name}>{patient?.firstname} {patient?.lastname}</Text>
                        <Text style={styles.info}>{patient?.contact_number}</Text>
                        <Text style={styles.info}>{patient?.email}</Text>
                    </View>
                    <View style={styles.details}>
                        <ProfileDetails title="Age" detail={age.toString()} />
                        <ProfileDetails title="Gender" detail={patient?.gender} />
                        <ProfileDetails title="Height" detail={`${patient?.height} cm`} />
                        <ProfileDetails title="Weight" detail={`${patient?.weight} kg`} />
                        <ProfileDetails title="Date of Birth" detail={birthdayString} />
                        <ProfileDetails title="Address" detail={patient?.address} />
                        <ProfileDetails title="Treatment Regimen" detail={patient?.treatment_regimen} />
                        <ProfileDetails title="Disease Class" detail={patient?.disease_class} />
                        <ProfileDetails title="Registration Group" detail={patient?.registration_group} />
                        <ProfileDetails title="Date Started" detail={dateString} />
                        <Calendar 
                            markedDates={markedDates}
                                
                        />
                         <View style={styles.switchContainer}>
                            <TouchableOpacity
                                onPress={toggleUnverified}
                                style={[
                                    styles.switch,
                                    donePressed ? styles.selected : {},
                                ]}
                            >
                                <Text style={styles.switchText}>DONE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={toggleVerified}
                                style={[
                                    styles.switch,
                                    missingPressed ? styles.selected : {},
                                ]}
                            >
                                <Text style={styles.switchText}>MISSING</Text>
                            </TouchableOpacity>
                        </View>
                        {donePressed ? (
                            done.map((item) => (
                                <SubmissionCard key={item.id.toString()} content={item} type="History" />
                            ))
                        ) : (
                            missing.map((item) => (
                                <SubmissionCard key={item.id.toString()} content={item} type="History" />
                            ))
                        )}
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
