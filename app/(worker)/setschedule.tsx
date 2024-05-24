import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, Text, StyleSheet, Alert, Platform, TouchableOpacity, Pressable } from "react-native";
import { useWorkerData } from "./_layout";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import Palette from "../../Constants/Palette";
import { supabase } from "../../supabase";
import * as SecureStore from 'expo-secure-store';
import * as SMS from 'expo-sms';
import { router } from "expo-router";

interface NewSchedule {
  patientid: string;
  workerid: string;
  text: string;
  date: string;
  time: string;
}

const SetSchedule: React.FC = () => {
  const { monitoring } = useWorkerData();
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false); // To track whether the date picker is changed
  const [patientArray, setPatientArray] = useState<{ key: string; value: string; }[]>([]);

  const toggleDatePicker = useCallback(() => {
    setShowDatePicker(prevState => !prevState);
  }, []);

  const toggleTimePicker = useCallback(() => {
    setShowTimePicker(prevState => !prevState);
  }, []);

  const confirmDateTime = useCallback(() => {
    toggleDatePicker();
    toggleTimePicker();
    setIsDirty(true); // Indicate that the date picker is changed
  }, [toggleDatePicker, toggleTimePicker]);

  const cancelDateTime = useCallback(() => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setIsDirty(false); // Reset the dirty state
  }, []);

  const sendSMS = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('contact_number')
        .eq('id', selectedPatient)
        .single();

      if (error) {
        console.log("Patient not found");
      } else {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
          const { result } = await SMS.sendSMSAsync(
            data.contact_number,
            `AGENDA: You are scheduled for a face-to-face checkup at the TB DOTS Center on ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${time?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`
          );
          if (result === "sent") Alert.alert("Message sent successfully");
        } else {
          Alert.alert("Messaging not available on this device");
        }
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    }
  };

  const insertSchedule = async () => {
    if (!selectedPatient || !date || !time) {
      Alert.alert("Please complete all fields.");
      return;
    }

    await sendSMS();

    const worker_id = await SecureStore.getItemAsync("id");
    if (worker_id !== null) {
      const newAgenda: NewSchedule = {
        workerid: worker_id,
        patientid: selectedPatient,
        text: notes,
        date: date.toISOString(),
        // date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };

      try {
        const { data, error } = await supabase
          .from('agenda')
          .insert(newAgenda);

        if (error) {
          Alert.alert(error.message);
        } else {
          Alert.alert("Successfully booked a schedule");
          router.navigate('/workerdashboard')
          router.push('/workerschedule')
        }
      } catch (error) {
        console.log("Error setting schedule:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Rendered");
    if (monitoring !== null) {
      const modifiedArray = monitoring.map(obj => ({
        key: `${obj.id}`,
        value: `${obj.firstname} ${obj.lastname}`
      }));
      setPatientArray(modifiedArray);
    } else {
      setPatientArray([]);
    }
  }, [monitoring]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a patient:</Text>
      {monitoring !== null && (
        <SelectList data={patientArray} setSelected={setSelectedPatient} />
      )}
      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter notes"
        onChangeText={setNotes}
        value={notes}
      />
      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>Select date:</Text>
        <Pressable onPress={toggleDatePicker}>
          <TextInput
            style={styles.input}
            placeholder={date ? date.toDateString() : "Select date"}
            onPress={toggleDatePicker}
            editable={false}
            value={date ? date.toDateString() : ""}
          />
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={(event: any, selectedDate?: Date) => {
              if (event.type === "set") {
                setDate(selectedDate);
                setShowDatePicker(false); // Dismiss the picker
              } else {
                cancelDateTime(); // Cancel if date is not selected
              }
            }}
          />
        )}
        <Text style={styles.label}>Select time:</Text>
        <Pressable onPress={toggleTimePicker}>
          <TextInput
            style={styles.input}
            placeholder={time ? time.toTimeString() : "Select time"}
            onPress={toggleTimePicker}
            editable={false}
            value={time ? time.toTimeString() : ""}
          />
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event: any, selectedTime?: Date) => {
              if (event.type === "set") {
                setTime(selectedTime);
                setShowTimePicker(false); // Dismiss the picker
              } else {
                cancelDateTime(); // Cancel if time is not selected
              }
            }}
          />
        )}
        {showDatePicker && Platform.OS === "ios" && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={cancelDateTime}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDateTime}>
              <Text>Select</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={insertSchedule}>
        <View style={styles.button}>
          <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Set Schedule</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  dateTimeContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: Palette.background,
    height: 50,
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default SetSchedule;
