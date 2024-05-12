import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert} from "react-native";
import Palette from "../../Constants/Palette";
import CommentCard from "../../components/comment";
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { supabase } from "../../supabase";
import { Session } from "@supabase/supabase-js";
import { commentType } from "../../Constants/Types";
import { Link } from "expo-router";
import { useUserData } from "./_layout";

interface NewComment {
    content: string,
    userid: string,
    submissionid: string | string[] | undefined
}

const SubmissionBin = ({ session }: { session: Session }) => {
    const params = useLocalSearchParams();
    const {status, id } = params;
    const [submissionstatus, setSubmissionStatus] = useState("");
    const description = "Placeholder description";
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<commentType[]>([]);
    const { pending } = useUserData();


    useEffect(() => {
        getComments()
    }, [comment]);

    useEffect(() => {
        if (status === "false") {
            setSubmissionStatus("Ongoing");
        } else {
            setSubmissionStatus("Done");
        }
    }, []);

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
                    <Text style={styles.title}>SUBMISSION DETAILS</Text>
                    {pending && pending.length > 0 && (
                    <View style={styles.card}>
                        <View style={styles.cardheading}>
                            <Text style={styles.cardtitle}>Submission #{pending[0].number} </Text>
                        </View>
                        <Text style={styles.cardtitle}>Status: {pending[0]?.verified && pending[0].status? "Verified by Worker" : pending[0]?.status ? "Submitted"  : "Pending"}</Text>
                        <View style={styles.cardheading}>
                            <Text style={styles.cardsubtitle}>{pending[0].deadline}</Text>
                        </View>
                        <Text style={styles.description}>Placeholder description</Text>
                        
                            {pending[0].status? (
                                <TouchableOpacity disabled style={[{backgroundColor: Palette.lightGray}, styles.button]}>
                                    <Text style={styles.buttontext}>Already submitted Video</Text>
                                </TouchableOpacity>
                            ): (
                                <Link href={{ pathname: "/recordvideo", params:{submissionid: pending[0].id}}} style={[styles.button, {backgroundColor: Palette.shadowAccent}]}>
                                    <TouchableOpacity>
                                        <Text style={styles.buttontext}>Submit a Video</Text>
                                    </TouchableOpacity>
                                </Link>
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
                        <FontAwesome6 style={{ flex: 1 }} name="paperclip" size={24} color="black" />
                        <FontAwesome6 style={[styles.margin, { flex: 1 }]} name="image" size={24} color="black" />
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
        backgroundColor: Palette.focused,
        borderRadius: 20,
        padding: 15,
        margin: 15
    },
    cardheading:{
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    cardtitle:{
        fontFamily: 'Heading',
        fontSize: 20,
    },
    cardsubtitle:{
        fontFamily: 'Heading',
        fontSize: 16,
    },
    description:{
        marginTop: 15,
        fontFamily: 'Poppins',
        fontSize: 16
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
        fontFamily: 'Heading',
        fontSize: 20
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