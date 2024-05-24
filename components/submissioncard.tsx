import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { submissionType, userType } from "../Constants/Types";
import Palette from "../Constants/Palette";
import { supabase } from "../supabase";
import * as SMS from 'expo-sms';
import { Link } from "expo-router";
import { router } from "expo-router";

interface SubmissionCardProps {
    content: submissionType;
    type: string;
    smsAvailable?: boolean;
    updateData?: () => void;

}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ content, type, smsAvailable, updateData}) => {
    const [user, setUser] = useState<userType>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUserDetails();
    }, [content]);

    const getUserDetails = async () => {
        setLoading(true);
        try {
            const { data, error, status } = await supabase
                .from('users')
                .select()
                .eq("id", content.patientid)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUser(data);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const sendSMS = async (cnumber: string, deadline: string, id: string) => {
        const deadline_string = deadline.toString();
        let message = ""
        if(type === "Missing"){
            message = "MISSING: You have missed a dose in your TB DOTS program last " + deadline_string + ". Kindly check your TBGuardian app for notifications. This is also a reminder to refrain from skipping your daily dose."
        }else{
            message = "DUE TODAY: This is message is a reminder that you have to submit a video of you taking you TB DOTS medication today."
        }
        if (smsAvailable) {
            const { result } = await SMS.sendSMSAsync(cnumber, message);
            if (result === "sent") Alert.alert("Sent successfully");
            try {
                if(type==="Missing"){
                    const { error } = await supabase
                    .from('submissions')
                    .update({ missing_reminder: "TRUE" })
                    .eq("id", id);
                    
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Reminded patient");
                        if (updateData) updateData();
                    }
                }else{
                    const { error } = await supabase
                    .from('submissions')
                    .update({ deadline_reminder: "TRUE" })
                    .eq("id", id);
                    
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Reminded patient");
                        if (updateData) updateData();
                        if(type==="Missing"){
                            router.replace('/workerdashboard')
                            router.replace('/missinglist')
                        }else{
                            router.replace('/workerdashboard')
                            router.replace('/duetoday')
                        }
                        
                    }
                }
                

                
            } catch (error) {
                if (error instanceof Error) console.log(error.message);
            }
        } else {
            Alert.alert("Messaging not available in this device");
        }
    };

    const renderUserDetails = () => (
        <>
            <Text style={type === "History"? [{color: 'white'}, styles.name]: styles.name}>{user?.firstname} {user?.lastname}</Text>
            <Text style={type === "History"? [{color: 'white'}, styles.details]: styles.details}>{user?.address}</Text>
            <Text style={type === "History"? [{color: 'white'}, styles.details]: styles.details}>{user?.contact_number} | {user?.email}</Text>
            <Text style={type === "History"? [{color: 'white'}, styles.details]: styles.details}>Deadline: {content.deadline.toString()}</Text>
            
            {type==="History" && (
                <>
                <Text style={type === "History"? [{color: 'white'}, styles.details]: styles.details}>Date Submitted: {content.date_submitted?.toString()}</Text>
                <Text style={type === "History"? [{color: 'white'}, styles.details]: styles.details}>Video Taken: {content.video_taken?.toString()}</Text>
                </>
            )}
            
        </>
    );

    return (
        <>
            {!loading && (
                <View style={styles.container}>
                    {user && renderUserDetails()}
                    {type === "Missing" && user?.contact_number && (
                        <TouchableOpacity onPress={() => sendSMS(user.contact_number, content.deadline, content.id)} style={styles.button}>
                            <Text style={styles.buttontext}>Send SMS</Text>
                        </TouchableOpacity>
                    )}
                    {(type === "Unverified" || type === "Verified") && (
                        <TouchableOpacity style={styles.button}>
                            <Link href={{ pathname: "/submissionpreview", params: { id: content.id, type: type } }} style={{ width: '100%' }}>
                                <Text style={styles.buttontext}>View Submission Bin</Text>
                            </Link>
                        </TouchableOpacity>
                    )}
                    {type === "Due Today" && user?.contact_number && (
                        <TouchableOpacity onPress={() => sendSMS(user.contact_number, content.deadline, content.id)} style={styles.button}>
                            <Text style={styles.buttontext}>Send SMS</Text>
                        </TouchableOpacity>
                    )}
                    {type === "Patient Missing" && (
                        <TouchableOpacity style={styles.button}>
                        <Link href={{ pathname: "/submissionbin", params: { submissionid: content.id, type: type } }} style={{ width: '100%' }}>
                            <Text style={styles.buttontext}>View Submission Bin</Text>
                        </Link>
                    </TouchableOpacity>
                    )}
                </View>
            )}
        </>
    );
};

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
        margin: 10,
        marginBottom: 0,
        padding: 15,
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 20
    },
    buttontext: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
    }
});

export default SubmissionCard;
