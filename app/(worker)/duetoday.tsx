import { FlatList, Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { submissionType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";
import * as SMS from 'expo-sms';
import { useState, useEffect } from "react";
import Palette from "../../Constants/Palette";
import { supabase } from "../../supabase";
import * as SecureStore from 'expo-secure-store';


const DueToday = () => {
    const [smsAvailable, setSMSAvailable] = useState(false);
    const [reminded, setReminded] = useState(false);
    const [notReminded, setNotReminded] = useState(true);
    const [duetoday, setDuetoday] = useState<submissionType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDueToday()
        checkSMS();
    }, []);

    const checkSMS = async () => {
        const isAvailable = await SMS.isAvailableAsync();
        setSMSAvailable(isAvailable);
    };

    const toggleNotReminded = () => {
        setNotReminded(true);
        setReminded(false);
    };

    const toggleReminded = () => {
        setReminded(true);
        setNotReminded(false);
    };

    const getDueToday = async () => {
        setLoading(true);
        const date = new Date().toISOString();
        const userid = await SecureStore.getItem("id")
        try {
            const { data, error, status } = await supabase
                .from('submissions')
                .select()
                .eq("status", "FALSE")
                .eq("deadline", date)
                .eq("workerid", userid)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                data.sort((a, b) => a.number - b.number);
                setDuetoday(data);
            }
            
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const renderList = ({ item }: { item: submissionType }) => (
        <SubmissionCard content={item} type="Due Today" smsAvailable={smsAvailable} updateData={getDueToday} />
    );

    const remindedData = duetoday.filter(item => item.deadline_reminder);
    const notRemindedData = duetoday.filter(item => !item.deadline_reminder);

    return (
        <>
            <View style={styles.switchcontainer}>
                <TouchableOpacity
                    onPress={toggleNotReminded}
                    style={[
                        styles.switch,
                        notReminded ? { borderBottomWidth: 3, borderColor: Palette.buttonOrLines } : {},
                    ]}
                >
                    <Text style={styles.switchtext}>TO REMIND</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={toggleReminded}
                    style={[
                        styles.switch,
                        reminded ? { borderBottomWidth: 3, borderColor: Palette.buttonOrLines } : {},
                    ]}
                >
                    <Text style={styles.switchtext}>REMINDED</Text>
                </TouchableOpacity>
            </View>
            {!loading && (
                <FlatList
                    data={notReminded ? notRemindedData : remindedData}
                    renderItem={renderList}
                    keyExtractor={(item) => item.id}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    switchcontainer: {
        flexDirection: "row",
        margin: 10,
    },
    switch: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    switchtext: {
        fontFamily: "Poppins",
        fontSize: 16,
    },
});

export default DueToday;
