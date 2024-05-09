import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { agendaType } from "../../Constants/Types";
import Palette from "../../Constants/Palette";
import { supabase } from "../../supabase";
import { Link } from "expo-router";

const WorkerSchedule: React.FC = () => {
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});
    const [confirmedAgenda, setConfirmedAgenda] = useState<agendaType[]>([]);
    const [pendingAgenda, setPendingAgenda] = useState<agendaType[]>([]);
    const [confirmedPressed, setConfirmedPressed] = useState(true);
    const [pendingPressed, setPendingPressed] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        getConfirmedAgenda()
        getPendingAgenda()
    })

    const onDayPress = () => {
    }

    const renderList = ({item} : {item: agendaType}) => {
        return(
            <View>
                <Text>{item.text}</Text>
            </View>
        )
    }

    const togglePending = () => {
        if(pendingPressed===false) {
            setPendingPressed(true)
            setConfirmedPressed(false)
        }
    }

    const toggleConfirmed = () => {
        if(confirmedPressed===false){
            setConfirmedPressed(true)
            setPendingPressed(false)
        }
    }

    //functions that retrieves the agenda that are confirmed from the database
    const getConfirmedAgenda = async () => {
        setLoading(true)
        try{
            const {data, error, status} = await supabase
            .from('agenda')
            .select()
            .eq('status', 'FALSE')
            .eq('confirmed', 'TRUE')

            if(error && status!==406){
                throw error;
            }

            if(data){
                setConfirmedAgenda(data)
            }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }


    //function that retrieves the agenda that are not confirmed from the database
    const getPendingAgenda = async () => {
        setLoading(true)
        try{
            const {data, error, status} = await supabase
            .from('agenda')
            .select()
            .eq('status', 'FALSE')
            .eq('confirmed', 'FALSE')

            if(error && status!==406){
                throw error;
            }

            if(data){
                setPendingAgenda(data)
            }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }


    return(
        <View style={{flex: 1}}>
            {/* calendar */}

            
            <Calendar
                markedDates={markedDates}
                onDayPress={onDayPress}
                style={{margin: 10, borderRadius: 10, borderWidth: 1, borderColor: Palette.buttonOrLines}}
            />

            {/* switch (like tab) that switches between confirmed and not confirmed agenda */}
            <View style={styles.switchcontainer}>
                <TouchableOpacity onPress={toggleConfirmed} style={[styles.switch, confirmedPressed? {borderBottomWidth: 3, borderColor: Palette.buttonOrLines} : {}]}>
                    <Text style={styles.switchtext}>CONFIRMED</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePending} style={[styles.switch, pendingPressed? {borderBottomWidth: 3, borderColor: Palette.buttonOrLines} : {}]}>
                    <Text style={styles.switchtext}>PENDING</Text>
                </TouchableOpacity>
            </View>

            {/* agenda flatlist
            {confirmedPressed? 
                (
                    <FlatList
                        data={confirmedAgenda}
                        renderItem={renderList}
                        keyExtractor={(item)=>item.id}
                        style={{flex: 4}}
                    />
                ):(
                    <FlatList
                        data={pendingAgenda}
                        renderItem={renderList}
                        keyExtractor={(item)=>item.id}
                    />
                )
            } */}

            {/* set new schedule button */}
            <Link href={{pathname: "/setschedule"}} style={styles.addbutton}>
                <TouchableOpacity >
                    <Text style={styles.buttontext}>Set A New Schedule</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}

export default WorkerSchedule;

const styles = StyleSheet.create({
    switchcontainer:{
        flexDirection: 'row',
        margin: 10
    },
    addbutton:{
        backgroundColor: '#219EBC',
        height: 50,
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0,
        left:0,
        right:0,
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    switch:{
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 10,
        
    },
    switchtext:{
        fontFamily: 'Poppins',
        fontSize: 16
    },
    buttontext:{
        fontFamily: 'Poppins',
        color: 'white', 
        fontSize: 16
    }
})