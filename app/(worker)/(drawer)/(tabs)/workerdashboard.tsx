import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import { useState, useEffect } from "react";
import Palette from '../../../../Constants/Palette';
import { Link } from "expo-router";
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../../supabase';
import { useWorkerData } from '../../_layout';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Calendar } from "react-native-calendars";
import { agendaType } from '../../../../Constants/Types';

export default function WorkerDashboard({session}: {session: Session}) {
    const[loading, setLoading] = useState(false);
    const {monitoring, done} = useWorkerData()
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});
    const [agenda, setAgenda] = useState<agendaType[]>([]);

    const onDayPress = () => {

    }

    return (
        <View>
            {loading ? 
                (<></>)
            :
                (
                <ScrollView>
                    <View style={{padding: 15, flexDirection: 'row'}}>
                        <Text style={{flex: 4, fontFamily: 'Heading', fontSize: 20, alignSelf: 'center'}}>
                            Register a new patient?
                        </Text>
                        <Link href="/addpatient" asChild style={{flex: 1, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.buttonText}>Add Patient</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between'}}>
                        <TouchableOpacity style={styles.buttonContainer}>
                            <Link href={{pathname: '/dailysubmissions'}} >
                                <Text style={styles.buttonText}>PATIENT SUBMISSIONS</Text>
                            </Link>
                        </TouchableOpacity>
                        <View style={{flex: 1}}>
                            <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: Palette.accent}]}>
                                <Link href={{pathname: '/duetoday'}}>
                                    <Text style={styles.buttonText}>DUE TODAY</Text>
                                </Link>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: Palette.darkGray}]}>
                                <Link href={{pathname: '/missinglist'}}>
                                    <Text style={styles.buttonText}>MISSING</Text>
                                </Link>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Link href={{pathname: "/patientcardlist",  params: {type: "Monitoring"}}} asChild style={[styles.cardContainer, {backgroundColor: Palette.focused}]}>
                        <TouchableOpacity>
                            <View style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.count}>{monitoring !== null ? monitoring.length : 0}</Text>
                                </View> 
                                <Text style={styles.dashboardText}>MONITORED PATIENTS</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                    
                    <View style={styles.calendarContainer}>
                        <Link href={{pathname: "/workerschedule"}} asChild>
                            <TouchableOpacity style={styles.buttonContainer}>
                                <Text style={styles.dashboardText}>APPOINTMENTS</Text> 
                            </TouchableOpacity>
                        </Link>
                    </View>

                </ScrollView>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    addButton: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 20,
        alignSelf: 'flex-end',
        height: 90,
        width: 90,
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: 'Heading',
        fontSize: 16,
        color: 'white',
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: Palette.buttonOrLines,
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        backgroundColor: Palette.focused,
        alignItems: 'center',
        margin: 10,
        borderRadius: 15,
    },
    cardContent: {
        flexDirection: 'row',
        backgroundColor: Palette.focused,
        alignItems: 'center',
        borderRadius: 20,
        padding: 20
    },
    iconContainer: {
        backgroundColor: Palette.focused,
        borderColor: 'white',
        borderRadius: 90,
        borderWidth: 5,
        width: 90,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    count: {
        fontSize: 30,
        color: 'white',
    },
    dashboardText: {
        flex: 2,
        fontSize: 30,
        color: 'white',
    },
    calendarContainer: {
        padding: 10,
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Palette.buttonOrLines,
        marginHorizontal: 5,
        alignItems: 'center',
        margin: 10,

    },
});
