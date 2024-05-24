import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import { agendaType } from "../../Constants/Types";
import Palette from "../../Constants/Palette";
import { supabase } from "../../supabase";
import { Link } from "expo-router";
import AgendaCard from "../../components/agendacard";
import * as SecureStore from 'expo-secure-store';


const WorkerSchedule: React.FC = () => {
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});
    const [agenda, setAgenda] = useState<agendaType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAgenda();
    }, []);

    const onDayPress = () => {
        // Add logic for handling day press
    };

    const renderList = ({ item }: { item: agendaType }) => (
        <AgendaCard 
            id={item.id} 
            patientid={item.patientid} 
            workerid={item.workerid} 
            content={item.text} 
            date={item.date} 
            time={item.time} 
            confirmed={item.confirmed} 
            type="Worker" 
        />
    );

    const getAgenda = async () => {
        const date = new Date().toISOString().split('T')[0];
        const userid = await SecureStore.getItem("id")

        setLoading(true);
        try {
            const { data, error, status } = await supabase
                .from('agenda')
                .select()
                .eq("status", "FALSE")
                .eq("workerid", userid)
                .gt("date", date)
                

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setAgenda(data);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    {/* Calendar */}
                    <Calendar
                        markedDates={markedDates}
                        onDayPress={onDayPress}
                        style={{ margin: 10, borderRadius: 10, borderWidth: 1, borderColor: Palette.buttonOrLines }}
                    />
                    {/* Agenda FlatList */}
                    <View style={styles.flatListContainer}>
                        <FlatList
                            data={agenda}
                            renderItem={renderList}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                    {/* Set New Schedule Button */}
                    <View  style={styles.buttonContainer}>
                    <Link href={{pathname: '/setschedule'}} style={{height: 50, backgroundColor: Palette.buttonOrLines, width: '100%', borderRadius: 20, padding: 10, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity>
                            <Text style={styles.buttontext}>Set A New Schedule</Text>
                        </TouchableOpacity>
                    </Link>
                    </View>


                    
                </>
            )}
        </View>
    );
};

export default WorkerSchedule;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

        buttonContainer: {
        width: '100%',
          height: 50,
    
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 10, // Add borderRadius for rounded corners
          paddingHorizontal: 20, // Add paddingHorizontal for internal spacing
        },
        buttontext: {
          fontFamily: 'Poppins', // Use your desired font family
          fontSize: 16,
          color: 'white', // Set the text color to white
          textAlign: 'center',
          alignSelf: 'center'
        },
      
    touchable: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 20,
        margin: 10,
        width: '100%'
    },
});
