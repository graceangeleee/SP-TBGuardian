import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { submissionType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";
import Palette from "../../Constants/Palette";
import { supabase } from "../../supabase";
import * as SecureStore from 'expo-secure-store';

const DailySubmissions = () => {
    const [unverifiedPressed, setUnverifiedPressed] = useState(true);
    const [verifiedPressed, setVerifiedPressed] = useState(false);
    const [verified, setVerified] = useState<submissionType[]>([]);
    const [unverified, setUnverified] = useState<submissionType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        const date = new Date().toISOString();
        const userid = await SecureStore.getItem("id")
        try {
            const { data: verifiedData, error: verifiedError, status: verifiedStatus } = await supabase
                .from('submissions')
                .select()
                .eq("status", "TRUE")
                .eq("verified", "TRUE")
                .eq("workerid", userid)

            const { data: unverifiedData, error: unverifiedError, status: unverifiedStatus } = await supabase
                .from('submissions')
                .select()
                .eq("status", "TRUE")
                .eq("verified", "FALSE")
                .eq("workerid", userid)

            if (verifiedError && verifiedStatus !== 406) {
                throw verifiedError;
            }

            if (unverifiedError && unverifiedStatus !== 406) {
                throw unverifiedError;
            }

            if (verifiedData) {
                verifiedData.sort((a, b) => new Date(b.date_submitted).getTime() - new Date(a.date_submitted).getTime());
                setVerified(verifiedData);
            }

            if (unverifiedData) {
                unverifiedData.sort((a, b) => new Date(b.date_submitted).getTime() - new Date(a.date_submitted).getTime());
                setUnverified(unverifiedData);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleUnverified = () => {
        setUnverifiedPressed(true);
        setVerifiedPressed(false);
    };

    const toggleVerified = () => {
        setVerifiedPressed(true);
        setUnverifiedPressed(false);
    };

    const renderList = ({ item }: { item: submissionType }) => (
        <SubmissionCard content={item} type={unverifiedPressed ? "Unverified" : "Verified"} />
    );

    return (
        <>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <View style={styles.switchcontainer}>
                        <TouchableOpacity
                            onPress={toggleUnverified}
                            style={[
                                styles.switch,
                                unverifiedPressed ? { borderBottomWidth: 3, borderColor: Palette.buttonOrLines } : {},
                            ]}
                        >
                            <Text style={styles.switchtext}>UNVERIFIED</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleVerified}
                            style={[
                                styles.switch,
                                verifiedPressed ? { borderBottomWidth: 3, borderColor: Palette.buttonOrLines } : {},
                            ]}
                        >
                            <Text style={styles.switchtext}>VERIFIED</Text>
                        </TouchableOpacity>
                    </View>
                    {unverifiedPressed ? (
                        unverified.length !== 0 ? (
                            <FlatList
                                data={unverified}
                                renderItem={renderList}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No unverified submissions yet</Text>
                            </View>
                        )
                    ) : verified.length !== 0 ? (
                        <FlatList
                            data={verified}
                            renderItem={renderList}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No verified submissions yet</Text>
                        </View>
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
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    emptyText: {
        fontFamily: "Poppins",
        fontSize: 16,
    },
});

export default DailySubmissions;
