import React, { useEffect, useRef, useState} from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import apiClient from '../apiClient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MachineDisplay, MachineGoals, UserData } from '../interfaces';
import MyMachinesTable from '../table/machines-table';

export default function myMachines() {

    const router = useRouter();

    const { gymName, gymMachines, machineGoals, userId, unitWeight } = useLocalSearchParams();

    const machines: MachineDisplay[] = typeof gymMachines === 'string' ? JSON.parse(gymMachines) : [];
    
    console.log(userId);
    console.log(unitWeight);

    // define machine goals as the parsed json string into a MachineGoals[] structure.
    const parsedMachineGoals: MachineGoals = typeof machineGoals === 'string' ? JSON.parse(machineGoals): [];

    const [machineStates, setMachinesStates] = useState(
        machines.map((machine: MachineDisplay) => ({ ...machine, checked: false}))
    )


    // button functions
    const handleBackBtn = () => {
        router.back();
    };

    const handleSaveBtn = () => {
        console.log("{save nigga");
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Machines</Text>

            </View>

            {/* <Text style={styles.subheading}>Select machines to include in your workout. {"\n"}
                Interact with the table to log progress.</Text> */}


            <View style={styles.content}>
                <MyMachinesTable machines={machines} machineGoals={parsedMachineGoals}
                                 userId={userId} unitWeight={unitWeight}
                />

            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.btn} onPress={handleSaveBtn}>
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={handleBackBtn}>
                    <Text style={styles.btnText}>Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Image 
                    source={require('../../assets/images/muscle.png')}
                    style={styles.logoImage} 
                />
                <Text style={styles.logoText}>LiftLog</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FBFF96',
        height: '12%',
        width: '100%',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'Reddit-Sans',
        fontSize: 24,
        textAlign: 'center',

    },

    // headings

    subheading: {
        fontFamily: 'Reddit-Sans',
        fontSize: 20,
        textAlign: 'center'
    },

    // middle content
    content: {
        flex: 1,
    },

    // bottom buttons (save/back)
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '8%',
        marginBottom: '3%',
        marginTop: '3%'
    },
    btn: {
        width: '40%',
        height: '70%',
        backgroundColor: '#FBFF96',
        borderWidth: 1.5,
        borderRadius: 50,
        marginHorizontal: '5%',
        justifyContent: 'center'
    },
    btnText: {
        fontSize: 20,
        fontFamily: 'Reddit-Sans',
        color: '#000000',
        textAlign: 'center',
    },
    
    // logo footer
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '14%',
        borderTopWidth: 1,
    },
    logoImage: {
        width: 40,
        height: 40,

    },
    logoText: {
        fontSize: 20,
        fontFamily: 'Roboto-Mono-Bold',
        color: '#000000'
    },

})

