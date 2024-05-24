import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import { useState, useEffect } from "react";
import Palette from '../../../Constants/Palette';
import { Link } from "expo-router";
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';
import { userType } from '../../../Constants/Types';

export default function AdminDashboard({session}: {session: Session}) {
    const[loading, setLoading] = useState(false);
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});
    const [patients, setPatients] = useState<userType[]>([])
    const [workers, setWorkers] = useState<userType[]>([])

    useEffect(() => {
        getPatients()
        getWorkers()
    }, [])


    const getPatients = async()=> {
      
        setLoading(true)
        try{
            const { data, error, status } = await supabase
            .from('users')
            .select()
            .eq("usertype", "Patient")

            if(error && status !== 406){
                throw error;
            }
    
            if(data){
                setPatients(data);
            }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }

    const getWorkers = async()=> {
      
        setLoading(true)
        try{
            const { data, error, status } = await supabase
            .from('users')
            .select()
            .eq("usertype", "Worker")

            if(error && status !== 406){
                throw error;
            }
    
            if(data){
                setWorkers(data);
            }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }

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
                        <Link href="/admin_addpatient" asChild style={{flex: 1, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.buttonText}>Add Patient</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                    <View style={{padding: 15, flexDirection: 'row'}}>
                        <Text style={{flex: 4, fontFamily: 'Heading', fontSize: 20, alignSelf: 'center'}}>
                            Register a new worker?
                        </Text>
                        <Link href="/admin_addworker" asChild style={{flex: 1, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.buttonText}>Add Worker</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                    

                    <Link href={{pathname: "/admin_patients"}} asChild style={[styles.cardContainer, {backgroundColor: Palette.focused}]}>
                        <TouchableOpacity>
                            <View style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.count}>{patients !== null ? patients.length : 0}</Text>
                                </View> 
                                <Text style={styles.dashboardText}>MONITORED PATIENTS</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>

                    <Link href={{pathname: "/admin_workers"}} asChild style={[styles.cardContainer, {backgroundColor: Palette.focused}]}>
                        <TouchableOpacity>
                            <View style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.count}>{workers !== null ? workers.length : 0}</Text>
                                </View> 
                                <Text style={styles.dashboardText}>REGISTERED WORKERS</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                    


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
