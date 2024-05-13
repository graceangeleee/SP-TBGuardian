import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useWorkerData } from "./_layout";
import { submissionType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";
import Palette from "../../Constants/Palette";

const DailySubmissions = () => {
    const { unverified, verified } = useWorkerData();
    const [unverifiedPressed, setUnverifiedPressed] = useState(true);
    const [verifiedPressed, setVerifiedPressed] = useState(false);

    const toggleUnverified = () => {
        if (!unverifiedPressed) {
            setUnverifiedPressed(true);
            setVerifiedPressed(false);
        }
    };

    const toggleVerified = () => {
        if (!verifiedPressed) {
            setVerifiedPressed(true);
            setUnverifiedPressed(false);
        }
    };

    const renderList = ({ item }: { item: submissionType }) => (
        <SubmissionCard content={item} type="Unverified" />
    );

    return (
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
                unverified?.length !== 0 ? (
                    <FlatList
                        data={unverified}
                        renderItem={renderList}
                        keyExtractor={(item) => item.id.toString()}
                    />
                ) : (
                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 16 }}> No unverified submissions yet</Text>
                    </View>
                )
            ) : verified?.length !== 0 ? (
                <FlatList
                    data={verified}
                    renderItem={renderList}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <View style={{ alignContent: "center", alignItems: "center" }}>
                    <Text style={{ fontFamily: "Poppins", fontSize: 16 }}> No verified submissions yet</Text>
                </View>
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

export default DailySubmissions;
