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

const SubmissionPreview = () => {
    const params = useLocalSearchParams();
    const {status, id, type } = params;
    const description = "Placeholder description";
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<commentType[]>([]);
    const [submission, setSubmission] = useState<submissionType>();
    const [videotaken, setVideoTaken] = useState("")


    useEffect(() => {
        getComments()
        getSubmissionDetails()

    }, []);

    
    const getSubmissionDetails = async() => {
        try {
            if (id !== null || id !== "") {
                const { data, error, status } = await supabase
                    .from('submissions')
                    .select()
                    .eq("id", id)
                    .single()

                if (error && status !== 406) {
                    throw error;
                }
                if (data) {
                    setSubmission(data);
                    const taken = new Date(data.video_taken)
                    setVideoTaken(taken.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
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

    const getComments = async () => {
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
            {submission !== null && (
                <View>
                    <View style={styles.card}>
                        <View style={styles.cardheading}>
                            <Text style={styles.cardtitle}>Submission #{submission?.number} </Text>
                            <Text style={styles.cardtitle}>Status: {submission?.status && !submission.verified ? "Submitted" : submission?.verified && submission.status? "Confirmed" : "Pending"}</Text>
                        </View>
                        
                        <View style={styles.cardheading}>
                            <Text style={styles.cardsubtitle}>Deadline: {submission?.deadline}</Text>
                            <Text style={styles.cardsubtitle}>Video Taken: {videotaken}</Text>
                        </View>
                        {/* <Text style={styles.description}>Placeholder description</Text> */}
                        {!submission?.verified ?(
                            
                            <TouchableOpacity style={{ backgroundColor: Palette.accent, width: '95%', borderRadius: 20, marginTop: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                <Link href={{ pathname: "/videoviewer", params:{videoId: submission?.videopath, submissionid: submission?.id, patientid: submission?.patientid}}} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <Text style={styles.buttontext}>Verify Submission</Text>
                                </Link>
                            </TouchableOpacity>
                           
                        ): (
                            <TouchableOpacity>
                                <Text style={styles.buttontext}>Already Verified</Text>
                            </TouchableOpacity>
                        )}  
                      
                    </View>
                
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
        margin: 15
    },
    cardheading:{
        backgroundColor: 'transparent',

        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    cardtitle:{
        fontFamily: 'Subheading',
        fontSize: 20,
        color: 'white'
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
        backgroundColor: Palette.shadowAccent,
        padding: 10,
        borderRadius: 60,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttontext:{
        fontFamily: 'Poppins',
        fontSize: 16,
        textAlign: 'center',
        alignSelf: 'center'
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

export default SubmissionPreview;