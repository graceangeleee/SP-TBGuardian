import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect} from "react";
import { submissionType, userType } from "../Constants/Types";
import Palette from "../Constants/Palette";
import { supabase } from "../supabase";

interface SubmissionCardProps{
    content: submissionType
    type: string
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({content, type}) => {
    const [user, setUser] = useState<userType>();
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        getUserDetails();
    }, [content])

    async function getUserDetails(){
        setLoading(true)
        try{
            const {data, error, status} = await supabase
            .from('users')
            .select()
            .eq("id", content.patientid)
            .single()

            if(error && status !== 406){
                throw error;
            }

            if(data){
                setUser(data)
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
    <>
        {!loading && type==="Missing" ? (
            <View style={styles.container}>
                {user !== undefined ? (
                    <>
                    <Text style={styles.name}>{user.firstname} {user.lastname}</Text>
                    <Text style={styles.details}>{user.address}</Text>
                    <Text style={styles.details}>{user.contact_number}   |   {user.email}</Text>
                    <Text style={styles.details}>Deadline: {content.deadline.toString()}</Text>
                    </>
                ):(
                    <></>
                )}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttontext}>Send SMS</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.container}>
                {user !== undefined ? (
                    <>
                    <Text style={styles.name}>{user.firstname} {user.lastname}</Text>
                    <Text style={styles.details}>{user.address}</Text>
                    <Text style={styles.details}>{user.contact_number}   |   {user.email}</Text>
                    <Text style={styles.details}>Deadline: {content.deadline.toString()}</Text>
                    </>
                ):(
                    <></>
                )}
                {/* <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttontext}>Send SMS</Text>
                </TouchableOpacity> */}
            </View>
        )}
    </>
    );
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 20,
        padding: 20,
        margin: 10,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: Palette.buttonOrLines
    },
    name:{
        fontFamily: 'Heading',
        fontSize: 16
    },
    details:{
        fontFamily: 'Poppins'
    },
    button:{
        margin: 10,
        marginBottom: 0,
        padding: 15,
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 20
    },
    buttontext:{
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white'
    }
})

export default SubmissionCard;