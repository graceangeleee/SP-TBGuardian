import { FlatList, Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { submissionType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";
import * as SMS from 'expo-sms';
import { useState, useEffect } from "react";
import Palette from "../../Constants/Palette";
import { supabase } from "../../supabase";
import * as SecureStore from 'expo-secure-store';

const MissingList = () => {
    // const [smsAvailable, setSMSAvailable] = useState(false);
    // const [reminded, setReminded] = useState(false);
    // const [notReminded, setNotReminded] = useState(true);
    const [submitted, setSubmitted] = useState<submissionType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSubmissions();

    }, []);

    // const checkSMS = async () => {
    //     const isAvailable = await SMS.isAvailableAsync();
    //     setSMSAvailable(isAvailable);
    // };

    // const toggleNotReminded = () => {
    //     setNotReminded(true);
    //     setReminded(false);
    // };

    // const toggleReminded = () => {
    //     setReminded(true);
    //     setNotReminded(false);
    // };

    const getSubmissions = async () => {
        setLoading(true);
        const date = new Date().toISOString();
        const id = await SecureStore.getItemAsync("id");
        try {
            const { data, error, status } = await supabase
                .from('submissions')
                .select()
                .eq("status", "TRUE")
                .eq("patientid", id)
  

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                data.sort((a, b) => a.number - b.number);
                setSubmitted(data);
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
        <SubmissionCard content={item} type="Patient Missing" updateData={getSubmissions} />
    );

    // const remindedData = missing.filter(item => item.missing_reminder);
    // const notRemindedData = missing.filter(item => !item.missing_reminder);

    return (
        <>
            {/* <View style={styles.switchcontainer}>
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
            </View> */}
            {!loading && (
                <FlatList
                    data={submitted}
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

export default MissingList;
