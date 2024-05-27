import { FlatList, Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { submissionType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";
import * as SMS from 'expo-sms';
import { useState, useEffect } from "react";
import Palette from "../../Constants/Palette";
import { supabase } from "../../supabase";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";


const AdminMissingList = () => {
    const [smsAvailable, setSMSAvailable] = useState(false);
    const [reminded, setReminded] = useState(false);
    const [notReminded, setNotReminded] = useState(true);
    const [missing, setMissing] = useState<submissionType[]>([]);
    const [loading, setLoading] = useState(false);
    const [remindedSubmissions, setRemindedSubmissions] = useState<submissionType[]>([]);
    const [notRemindedSubmissions, setNotRemindedSubmissions] =useState<submissionType[]>([]);

    useEffect(() => {
        getMissing();
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

    const getMissing = async () => {
        setLoading(true);
        const date = new Date().toISOString();
     

        try {
            const { data, error, status } = await supabase
                .from('submissions')
                .select()
                .eq("status", "FALSE")
                .lt("deadline", date)

  

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                data.sort((a, b) => a.number - b.number);
                const remindedSubmissions = data.filter(item => item.missing_reminder);
                const notRemindedSubmissions = data.filter(item => !item.missing_reminder);
     
                setRemindedSubmissions(remindedSubmissions);
                setNotRemindedSubmissions(notRemindedSubmissions);
              
                
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const sendSMS = async() => {
        try {
            const numberArray = await getContactNumbers();
            if (numberArray.length !== 0) {
                const isAvailable = await SMS.isAvailableAsync();
                if (isAvailable) {
                    const { result } = await SMS.sendSMSAsync(numberArray, "MISSING SUBMISSIONS: Kindly remind your patients to submit their missing submissions");
                    if (result === "sent") Alert.alert("Sent successfully");
                    updateMissing()
                } else {
                    Alert.alert("SMS service is not available on this device.");
                }
            } else {
                Alert.alert("No contact numbers found to send SMS.");
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        }
      
    }

    const updateMissing = async () => {
        for (const submission of notRemindedSubmissions) {
            try{
                const {error} = await supabase
                .from('submissions')
                .update({ missing_reminder: "TRUE" })
                .eq("id", submission.id);

                if (error) {
                    console.log(error);
                } else {
                    console.log("Reminded patient");
                   
                }
            }catch(error){
                if(error instanceof Error) Alert.alert(error.message)
            }
        
        }
        getMissing()
        router.replace('/admin_missing')
    }

    const getContactNumbers = async(): Promise<string[]> => {
        let contactNumbers: string[] = [];
        let contactSet = new Set<string>();

        for (const submission of notRemindedSubmissions) {

            if (submission.workerid) {
        
                const { data, error } = await supabase
                    .from('users')
                    .select('contact_number')
                    .eq('id', submission.workerid)
                    .single(); // Assuming each workerid is unique and returns a single user

                if (error) {
                    throw error;
                }

                if (data && data.contact_number) {
                    if (!contactSet.has(data.contact_number)) {
                        contactSet.add(data.contact_number);
                        contactNumbers.push(data.contact_number);
                    }
                }
            }
        }

        // console.log(contactNumbers);
        return contactNumbers; // Return the array of unique contact numbers
    }

    const renderList = ({ item }: { item: submissionType }) => (
        <SubmissionCard content={item} type="Admin Missing" smsAvailable={smsAvailable} updateData={getMissing} />
    );

    // const remindedData = missing.filter(item => item.missing_reminder);
    // const notRemindedData = missing.filter(item => !item.missing_reminder);

    
    
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
                <>
                {notRemindedSubmissions.length > 0 && (
                    <TouchableOpacity style={styles.button} onPress={sendSMS}>
                    <Text style={{fontFamily: 'Poppins', fontSize: 16, color: 'white'}}>Remind Workers</Text>
                    </TouchableOpacity>
                )}
                {reminded? (
                        <FlatList
                        data={remindedSubmissions}
                        renderItem={renderList}
                        keyExtractor={(item) => item.id}
                        />
                ):(
                        <FlatList
                        data={notRemindedSubmissions}
                        renderItem={renderList}
                        keyExtractor={(item) => item.id}
                        />
                )}
               
                </>
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
    button:{
        margin: 10,
        alignItems: 'center',
        backgroundColor: Palette.buttonOrLines,
        padding: 15,
        borderRadius: 20
    }
});

export default AdminMissingList;
