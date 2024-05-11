import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { userType } from "../Constants/Types";
import Palette from "../Constants/Palette";
import { supabase } from "../supabase";
import * as SecureStore from 'expo-secure-store';

interface AgendaCardProps {
    id: string;
    patientid: string;
    workerid: string;
    content: string;
    date: string;
    time: string;
    confirmed: boolean;
    type: string;
    confirmButton?: (id: string, patientid: string) => void;
}

const AgendaCard: React.FC<AgendaCardProps> = ({ id, patientid, workerid, content, date, time, confirmed, type, confirmButton }) => {
    const [patient, setPatient] = useState<userType>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getPatientDetails();
    }, []);

    const getPatientDetails = async () => {
        setLoading(true);
        try {
            const { data, error, status } = await supabase
                .from('users')
                .select()
                .eq("id", patientid)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setPatient(data);
            }
        } catch (error) {
            if(error instanceof Error) Alert.alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmAgenda = async () => {
        const patientid = await SecureStore.getItem("id");
        if (patientid !== null && patientid !== undefined && confirmButton) {
            confirmButton(id, patientid);
        }
    };

    return (
        <>
            {loading ? (
                <></>
            ) : (
                <View style={styles.container}>
                    <View>
                        <Text style={styles.name}>{patient?.firstname} {patient?.lastname}</Text>
                        <Text style={styles.details}>{content}</Text>
                        <Text style={styles.details}>{date}   |   {time}</Text>
                        {/* <Text style={styles.details}>Remaining Submissions: {content.to_submit}</Text> */}
                    </View>
                    {(type === "Patient" && !confirmed) ? (
                        <TouchableOpacity style={[styles.button, { backgroundColor: Palette.buttonOrLines }]} onPress={confirmAgenda}>
                            <Text style={styles.buttontext}>Confirm Schedule</Text>
                        </TouchableOpacity>
                    ) : type === "Patient" && confirmed ? (
                        <View style={[styles.button, { backgroundColor: Palette.darkGray }]}>
                            <Text style={styles.buttontext}>Schedule Confirmed</Text>
                        </View>
                    ) : null}
                </View>
            )}
        </>
    );
}

export default AgendaCard;

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        margin: 10,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: Palette.buttonOrLines
    },
    name: {
        fontFamily: 'Heading',
        fontSize: 16
    },
    details: {
        fontFamily: 'Poppins'
    },
    button: {
        alignSelf: 'center',
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttontext: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white'
    }
});
