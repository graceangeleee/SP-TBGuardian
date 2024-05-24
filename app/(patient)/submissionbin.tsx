import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert} from "react-native";
import Palette from "../../Constants/Palette";
import CommentCard from "../../components/comment";
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { supabase } from "../../supabase";
import { Session } from "@supabase/supabase-js";
import { commentType, submissionType } from "../../Constants/Types";
import { Link } from "expo-router";


interface NewComment {
    content: string,
    userid: string,
    submissionid: string | string[] | undefined
}

const SubmissionBin = () => {
    const params = useLocalSearchParams();
    const {status, id, type, submissionid} = params;
    const [submissionstatus, setSubmissionStatus] = useState("");
    const [description, setDescription] = useState("")
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<commentType[]>([]);
    const [pending, setPending] = useState<submissionType>()
    const [missing, setMissing] = useState<submissionType>()
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if(type==="Ongoing"){
            getSubmissionDetails()
        }else{
            getMissingDetails()
        }

        getComments()
        
        changeDescription()
    }, []);

    useEffect(() => {
        if (status === "false") {
            setSubmissionStatus("Ongoing");
        } else {
            setSubmissionStatus("Done");
        }
    }, []);

    const changeDescription =  () => {
        if(type==="Ongoing"){
            setDescription("Please take a clear video of yourself taking in the medication for TB")
        }else{
            setDescription("Please take a clear video of yourself taking in the medication of the drugs. Additionally, please make it visible in the video the current date and time that you are taking the drugs")
        }
    }

    const getSubmissionDetails = async() => {
        setLoading(true);
        const date = new Date().toISOString();
        const id = await SecureStore.getItemAsync("id");
        try {
          if (!id) {
            throw new Error('No user logged in');
          } else {
            const { data, error, status } = await supabase
              .from('submissions')
              .select()
              .eq('patientid', id)
              .gt('deadline', date);
    
            if (error && status !== 406) {
              throw error;
            }
    
            if (data) {
              data.sort((a, b) => a.number - b.number);
              setPending(data[0]);
          
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message);
          }
        } finally {
          setLoading(false);
        }
    }

    const getMissingDetails = async() => {

        setLoading(true);
        const date = new Date().toISOString()
        
        try {
         
          
            const { data, error, status } = await supabase
              .from('submissions')
              .select()
              .eq("id", submissionid)
              .single()
              
    
            if (error && status !== 406) {
              throw error;
            }
    
            if (data) {
              setPending(data)
          
            }
          
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message);
          }
        } finally {
          setLoading(false);
        }
    }

    async function getComments() {
        try {
            if (id !== null || id !== "") {
                const { data, error, status } = await supabase
                    .from('comments')
                    .select()
                    .eq("submissionid", id);

                if (error && status !== 406) {
                    throw error;
                }
                if (data) {
                    setComments(data);
                }
            } else {
                Alert.alert("This submission bin does not exist");
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            return;
        }
    }

    async function addComment() {
        const user_id = await SecureStore.getItemAsync("id");

        if (user_id !== null) {
            const newcomment: NewComment = {
                content: comment,
                userid: user_id,
                submissionid: id
            };

            insertComment(newcomment);
            getComments();

        } else {
            Alert.alert("No user logged in");
        }
    };

    async function deleteComment(id: string) {
        try {
            const { data, error } = await supabase
                .from('comments')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }
            getComments();
            Alert.alert("Successfully deleted comment");
        } catch (error) {
            Alert.alert("Cannot delete this comment");
        }
    }

    async function insertComment(newcomment: NewComment) {
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert(newcomment);

            if (error) {
                console.log("Error inserting comment");
                return;
            }
            getComments();
            Alert.alert("Comment added successfully");

        } catch (error) {
            console.log("Error inserting comment");
        }
    }

    async function editComment(id: string, edited: string) {
        try {
            const { data, error } = await supabase
                .from('comments')
                .update({ content: edited })
                .eq('id', id);

            if (error) {
                throw error;
            }
            getComments();
            Alert.alert("Successfully edited comment");
        } catch (error) {
            Alert.alert("Cannot edit this comment");
        }
    }

    return (
        <ScrollView>
            {pending !== null && (
                <View>
                    {pending && (
                    <View style={styles.card}>
                        <View style={styles.cardheading}>
                            <Text style={styles.cardtitle}>Submission #{pending.number} </Text>
                            <Text style={styles.cardtitle}>Status: {pending?.verified && pending.status? "Verified by Worker" : pending?.status ? "Submitted"  : "Pending"}</Text>

                        </View>
                        <View style={styles.cardheading}>
                            <Text style={styles.cardsubtitle}>Deadline: {pending.deadline}</Text>
                            {/* {pending.status && (
                                 <Text style={styles.cardsubtitle}>Video Taken: {pending?.video_taken?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                            )} */}
                        </View>
                        <Text style={styles.description}>{description}</Text>
                        
                            {pending.status? (
                                <TouchableOpacity disabled style={[{backgroundColor: Palette.lightGray}, styles.button]}>
                                    <Text style={styles.buttontext}>Already submitted Video</Text>
                                </TouchableOpacity>
                            ): (
                                <TouchableOpacity style={{ backgroundColor: Palette.accent, width: '95%', borderRadius: 20, marginTop: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                    {type==="Patient Missing"? (
                                        <Link href={{ pathname: "/choosevideo", params:{submissionid: submissionid}}} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <Text style={styles.buttontext}>Submit a Video</Text>
                                        </Link>
                                    ):(
                                        <Link href={{ pathname: "/recordvideo", params:{submissionid: pending.id}}} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <Text style={styles.buttontext}>Submit a Video</Text>
                                        </Link>
                                    )}
                                    
                                </TouchableOpacity>

                            )}
                            
                        
                    </View>
                )}
                    <View style={styles.divider}></View>
                    <Text style={styles.title}>COMMENTS</Text>
                    <View>
                        {comments.map((comment, index) => (
                            <CommentCard
                                key={index.toString()} // Use a unique identifier here
                                comment={comment}
                                deleteFunction={deleteComment}
                                editFunction={editComment}
                            />
                        ))}
                    </View>
                    <View style={styles.input}>
                        <TextInput onChangeText={setComment} style={[styles.margin, { fontFamily: 'Poppins', flex: 6 }]} multiline={true} placeholder="Insert comment here" />
                        <FontAwesome onPress={addComment} style={{ flex: 1 }} name="send" size={24} color="black" />
                    </View>
                </View>
            )}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    title:{
        fontFamily: 'Heading',
        fontSize: 20,
        marginTop: 15,
        marginLeft: 20
    },
    card:{
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 20,
        padding: 15,
        margin: 15,
        
    },
    cardheading:{
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        overflow: 'visible'
    },
    cardtitle:{
        fontFamily: 'Subheading',
        fontSize: 20,
        color: 'white',

    },
    cardsubtitle:{
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white'
    },
    description:{
        marginTop: 15,
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 10
    },
    button:{
        marginTop: 15,
        padding: 10,
        borderRadius: 60,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttontext:{
        fontFamily: 'Poppins',
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center'
    },
    input:{
        flexDirection: 'row',
        margin: 15,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center'
    },
    margin:{
        marginLeft: 5
    },
    divider:{
        height: 2,
        backgroundColor: Palette.buttonOrLines,
        marginLeft: 20, 
        marginRight: 20
    }
})

export default SubmissionBin;