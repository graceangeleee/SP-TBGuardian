import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Redirect } from 'expo-router';
import { useState, useEffect } from "react";
import Palette from '../../../../Constants/Palette';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from "expo-router";
import { Session } from "@supabase/supabase-js";
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../../../../supabase';
import { submissionType } from '../../../../Constants/Types';
import { useUserData } from '../../_layout';

export default function PatientDashboard({ session }: { session: Session }) {
    const [percentage, setPercentage] = useState(0);
    const [tosubmit, setToSubmit] = useState(0);
    const [rewards, setRewards] = useState(23);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [missing, setMissing] = useState<submissionType[]>([])
    const [pendingstatus, setPendingStatus] = useState("")
    const [deadlinestring, setDeadlineString] = useState("")
    const { setUser, pending, setPending } = useUserData();


    useEffect(() => {
        getDetails();
    }, [session])

    useEffect(() => {
        calcualtePercentage()
    }, [tosubmit])

    useEffect(() => {
        changeStatus()
    }, [percentage])


    const changeStatus = () => {
        if (percentage === 0) {
            setStatus("Get started")
        } else if (percentage > 0 && percentage < 50) {
            setStatus("Keep going!")
        } else if (percentage === 50) {
            setStatus("You're halfway there!")
        } else if (percentage === 100) {
            setStatus("Done!")
        } else {
            setStatus("You're almost there!")
        }
    }

    async function getDetails() {
        setLoading(true);
        try {
            const id = await SecureStore.getItemAsync("id");
            if (id != null) {
                getPendingDetails(id)
                getUserData(id)
                getMissing(id)

            } else {
                console.log("No session")
            }
        } catch (error) {
            console.log("Error retrieving data")
        } finally {
            setLoading(false)
        }
    }

    async function getMissing(userid: string) {
        const date = new Date().toISOString();

        try {
            if (userid === null || userid === "") {
                throw new Error('No user logged in');
            } else {
                const { data, error, status } = await supabase
                    .from('submissions')
                    .select()
                    .eq("patientid", userid)
                    .eq("status", "FALSE")
                    .lt("deadline", date)


                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    setMissing(data)
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            return
        }
    }

    async function getPendingDetails(userid: string) {
        const date = new Date().toISOString();
        try {
            if (userid === null || userid === "") {
                throw new Error('No user logged in');
            } else {
                const { data, error, status } = await supabase
                    .from('submissions')
                    .select()
                    .eq("patientid", userid)
                    .eq("status", "FALSE")
                    .gt("deadline", date)


                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    data.sort((a, b) => a.number - b.number)
                    setPending(data)
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            return
        }
    }

    async function getUserData(userid: string) {
        try {
            if (userid === null || userid === "") {
                throw new Error('No user logged in');
            } else {
                const { data, error, status } = await supabase
                    .from('users')
                    .select()
                    .eq('id', userid)
                    .single();

                if (data) {
                    setUser(data)
                    setToSubmit(data.to_submit)
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            return
        }
    }

    const calcualtePercentage = () => {
        const percent = ((60 - tosubmit) / 60) * 100
        setPercentage(percent)
        changeStatus();
    }

    return (
        <>
            <StatusBar style="auto" />
            {pending === undefined ? (
                <></>
            ) : (
                <ScrollView>
                    <View style={styles.statuscontainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.statustext, { flex: 2.5 }]}>{status}</Text>
                            <View style={{ flex: 1 }}>
                                <View style={[styles.percentage, styles.elevation]}>
                                    <Text style={styles.status}>{percentage}%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.statuscontainer, { flexDirection: 'row', backgroundColor: Palette.focused, padding: 15 }]}>
                        <FontAwesome name="exclamation-triangle" size={35} color="red" />
                        <Text style={{ fontFamily: 'Heading', fontSize: 20, color: Palette.buttonOrLines, marginLeft: 5 }}>You have {missing.length} missing submission/s!</Text>
                    </View>

                    <View style={styles.horizontalcontainer}>
                        {pending.length > 0 ? (
                            <View key={pending[0].id} style={[styles.colcontainer, { backgroundColor: Palette.shadowAccent }, styles.shadowprop, styles.elevation]}>
                                <View style={{ backgroundColor: Palette.shadowAccent, flex: 2 }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: Palette.shadowAccent, alignItems: 'center' }}>
                                        <FontAwesome style={{ marginRight: 10 }} name="tasks" size={24} color={'white'} />
                                        <Text style={styles.detailheader}>Next</Text>
                                    </View>
                                    <Text style={styles.detailheader}>submission</Text>
                                    <Text style={styles.details}>{pending[0].deadline.toString()}</Text>
                                </View>
                                <Link href={{ pathname: "/submissionbin" }} asChild style={styles.button}>
                                    <TouchableOpacity>
                                        <Text style={styles.buttontext}>Submit</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        ) : (
                            <View style={[styles.colcontainer, { backgroundColor: Palette.shadowAccent }, styles.shadowprop, styles.elevation]}>
                                <Text>No pending submissions</Text>
                            </View>
                        )}
                        <View style={[styles.colcontainer, { backgroundColor: Palette.buttonOrLines }, styles.shadowprop, styles.elevation]}>
                            <View style={{ flexDirection: 'row', backgroundColor: Palette.buttonOrLines, alignItems: 'center' }}>
                                <FontAwesome style={{ marginRight: 10 }} name="exclamation-triangle" size={24} color={'white'} />
                                <Text style={styles.detailheader}>Reminders</Text>
                            </View>

                            <Text style={styles.details}>Placeholder Date</Text>
                            <Link href={{ pathname: "/schedule" }} asChild style={styles.button}>
                                <TouchableOpacity>
                                    <Text style={styles.buttontext}>See Schedule</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                    </View>
                    <View style={[styles.rewardscontainer, styles.elevation]}>
                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="star" size={30} color={Palette.accent} />
                                <Text style={styles.rewardsearned}>{rewards}/100</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.reward}>{100 - rewards}</Text>
                                <FontAwesome style={{ marginLeft: 5, marginRight: 5 }} name="star" size={20} color={Palette.accent} />
                                <Text style={styles.reward}>to a reward</Text>
                            </View>
                        </View>


                        <Text style={[styles.rewardins, { alignSelf: 'center' }]}>Earn reward points by complying to your medication and submitting videos on time</Text>
                        <Link href='/(drawer)/(tabs)/rewards' asChild style={[styles.button, { marginTop: 10, }]}>
                            <TouchableOpacity>
                                <Text style={styles.buttontext}>Show rewards</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    horizontalcontainer:{
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'rgba(52, 52, 52, alpha)'
    },
    colcontainer:{
        flex: 1,
        margin: 5,
        padding: 15,
        height: 250,
        borderRadius: 15,
    },
    rowcontainer:{
        height: 150,
        alignContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderRadius: 15
    },
    rewardscontainer:{
        borderColor: Palette.buttonOrLines,
        borderWidth: 2,
        margin: 10,
        padding: 20,
        borderRadius: 15
    },
    percentage:{
        borderRadius: 90,
        height: 100,
        width: 100,
        backgroundColor: Palette.shadowAccent,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Palette.buttonOrLines,
        borderWidth: 4,
    },
    status:{
        fontFamily: 'Heading',
        fontSize: 25,
        color: 'white'

    },
    statustext:{
        fontFamily: 'Heading',
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: 20,
        color: Palette.buttonOrLines
    },
    statuscontainer:{
        marginTop: 20,
        marginLeft: 15, 
        marginRight: 15,
        // borderColor: Palette.buttonOrLines,
        // borderWidth: 2,
        alignContent: 'center',
        borderRadius: 15,
    },
    details:{
        fontFamily: 'Poppins',
        fontSize: 16,
        marginTop: 10,
        color: 'white'
    },
    rewardins:{
        fontFamily: 'Poppins',
        fontSize: 16,
        marginTop: 10,
        color: Palette.buttonOrLines
    },
    shadowprop: {
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    elevation: {
        elevation: 10,
        shadowColor: '#52006A',
    },
    rewardsearned:{
        fontFamily: 'Heading',
        fontSize: 20,
        marginLeft: 15
    },
    reward:{
        fontFamily: 'Subheading',
        fontSize: 20,
    },
    detailheader:{
        fontFamily: 'Heading',
        fontSize: 20,
        color: 'white'
    },
    button:{
        padding: 10,
        borderRadius: 60,
        backgroundColor: Palette.buttonOrLines,
        borderColor: 'white',
        borderWidth: 1
    },
    buttontext:{
        fontFamily: 'Poppins',
        fontSize: 16,
        alignSelf: 'center',
        color: 'white'
    },
    workerdashboard:{
        fontFamily: 'Heading',
        fontSize: 30,
        color: 'white'
    },
    count:{
        fontFamily: 'Poppins',
        fontSize: 30,
        color: 'white'
    },
    addpatient:{
        alignSelf: 'flex-end',
        position: 'absolute',
        height: 80,
        width: 80,
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 90,
        alignItems: 'center',
        alignContent: 'center'
    }
});