import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { agendaType } from "../../Constants/Types";
import Palette from "../../Constants/Palette";
import { supabase } from "../../supabase";
import { Link } from "expo-router";
import AgendaCard from "../../components/agendacard";

const WorkerSchedule: React.FC = () => {
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});
    const [agenda, setAgenda] = useState<agendaType[]>([]);

    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        getAgenda()

    }, [])
    


    const onDayPress = () => {

    }

    const renderList = ({item} : {item: agendaType}) => <AgendaCard id = {item.id} patientid={item.patientid} workerid={item.workerid} content={item.text} date={item.date} time={item.time} confirmed={item.confirmed} type="Worker" />



    //function that retrieves the agenda that are not confirmed from the database
    const getAgenda = async () => {
        setLoading(true)
        try{
            const {data, error, status} = await supabase
            .from('agenda')
            .select()


            if(error && status!==406){
                throw error;
            }

            if(data){
                data.sort((a, b) => a.date - b.date);
                setAgenda(data)
            }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            {/* calendar */}
            <Calendar
                markedDates={markedDates}
                onDayPress={onDayPress}
                style={{margin: 10, borderRadius: 10, borderWidth: 1, borderColor: Palette.buttonOrLines}}
            />

           

            {/* agenda flatlist */}
            <View style={styles.flatListContainer}>
                <FlatList
                    data={agenda}
                    renderItem={renderList}
                    keyExtractor={(item)=>item.id}
                />
            </View>

            {/* set new schedule button */}
            <Link href={{pathname: "/setschedule"}} style={styles.addbutton}>
                <TouchableOpacity style={styles.touchable}>
                    <Text style={styles.buttontext}>Set A New Schedule</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}

export default WorkerSchedule;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    switchcontainer: {
        flexDirection: 'row',
        margin: 10,
    },
    switch: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 10, 
    },
    switchtext: {
        fontFamily: 'Poppins',
        fontSize: 16
    },
    flatListContainer: {
        flex: 1,
    },
    addbutton: {
        height: 50,
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttontext: {
        fontFamily: 'Poppins',
        color: 'white', 
        fontSize: 16,
        textTransform: 'uppercase', // Convert text to uppercase
        fontWeight: 'bold', // Add bold font weight
    },
    touchable:{
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 20, // Add borderRadius to match the button
        margin: 10, // Add margin for spacing
    },
    

})
