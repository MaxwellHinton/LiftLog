import React, { useState, useRef} from "react";
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


const GymMap = () => {

    const containerWidth = screenWidth * 1;
    const containerHeight = screenHeight * 0.67;


    // zoomable image code using gesture
    // shared value for scale and translation of the image
    const scale = useSharedValue(1.5); // zooming
    const translateX = useSharedValue((containerWidth - 1000) / -2); // for x-axis panning (horizontal)
    const translateY = useSharedValue((containerHeight - 1000) / -2); // for y-axis panning (vertical)

    // Zooming gesture
    const pinchSpeed = 0.1;
    const pinchGesture = Gesture.Pinch().onUpdate((event) => {
        const minScale = 1;
        const maxScale = 3;
        scale.value = Math.min(Math.max(scale.value * (1 + (event.scale - 1) * pinchSpeed), minScale), maxScale);
    });

    const panGesture = Gesture.Pan().onUpdate((event) => {
        // update our value with their finger position
        const panSpeed = 0.1;
        const scaledWidth = 1000 * scale.value;
        const scaledHeight = 1000 * scale.value;

        const maxTranslateX = (scaledWidth - containerWidth) /2;
        const maxTranslateY = (scaledHeight - containerHeight) /2;

        translateX.value = Math.min(
            Math.max(translateX.value + event.translationX * panSpeed, -maxTranslateX),
            maxTranslateX
        );
        translateY.value = Math.min(
            Math.max(translateY.value + event.translationY * panSpeed, -maxTranslateY),
            maxTranslateY
        );

    })
    .onEnd(() => {
        const scaledWidth = 1000 * scale.value;
        const scaledHeight = 1000 * scale.value;
  
        const maxTranslateX = (scaledWidth - containerWidth) / 2;
        const maxTranslateY = (scaledHeight - containerHeight) / 2;
  
        translateX.value = withTiming(
          Math.min(Math.max(translateX.value, -maxTranslateX), maxTranslateX)
        );
        translateY.value = withTiming(
          Math.min(Math.max(translateY.value, -maxTranslateY), maxTranslateY)
        );
    });

    // combined gestures
    const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {scale: scale.value },
                {translateX: translateX.value },
                {translateY: translateY.value },
            ],
        };
    });

    const resetMap = () => {
        scale.value = withTiming(1.5);
        translateX.value = withTiming((1000 - containerWidth) / 10);
        translateY.value = withTiming((1000 - containerHeight) / 7);
        console.log(translateX.value)
        console.log(translateY.value)
        console.log('container height:', containerHeight);
        console.log('container width: ', containerWidth);
        console.log('screen height: ', screenHeight);
        console.log('screen width: ', screenWidth);

    };


    const [isHelpVisible, setIsHelpVisible] = useState<boolean>(false);

    const toggleHelpModal = () => {
        setIsHelpVisible(!isHelpVisible);
    };

    return (
        <View style={styles.mapSection}>
            {/* Rectangle container for the image, overflow hidden */}
            <View style={[styles.imageContainer, { width: containerWidth, height: containerHeight}]}>
                <GestureDetector gesture= {combinedGesture}>
                    <Animated.View style={{ flex: 1 }}>
                        <Animated.Image 
                            source={require('../assets/maps/1000x1000/HomeGym1000x1000.png')}
                            style={[styles.mapImage, animatedStyles]}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </GestureDetector>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.resetButton} onPress={resetMap}>
                    <Text style={styles.resetButtonText}>↺</Text>
                </TouchableOpacity>

                {/* Help Button */}
                <TouchableOpacity style={styles.helpButton} onPress={toggleHelpModal}>
                    <Text style={styles.helpButtonText}>?</Text>
                </TouchableOpacity>
            </View>

            {/* Help Container */}
            {isHelpVisible && (
                <View style={styles.helpContainer}>
                    <ScrollView contentContainerStyle={styles.helpContent}>
                        <Text style={styles.tipText}>
                            Navigate the gym using the interactive map.
                        </Text>
                        <Text style={styles.tipText}>
                            Click on a machine to log your lift, goals, reps, and to find out
                            more information.
                        </Text>
                        <Text style={styles.tipText}>
                            Use the search feature to navigate to a machine.
                        </Text>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={toggleHelpModal}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
    
const styles = StyleSheet.create({
    mapSection: {
        flex: 1,
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#000000',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: '0%',
        right: '0%',
        flexDirection: "row", // Align items horizontally
        justifyContent: "flex-end", // Space between the buttons
        alignItems: "center", // Center vertically
    },
    helpButton: {
        backgroundColor: '#80D0D2',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginHorizontal: 20,
        marginBottom: 20,
    },
    helpButtonText: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    helpContainer: {
        position: 'absolute',
        bottom: '30%', // Position the container above the help button
        left: '10%',
        right: '10%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    helpContent: {
        paddingVertical: 10,
    },
    resetButton: {
        backgroundColor: '#80D0D2',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginHorizontal: 20,
        marginBottom: 20,
    },
    resetButtonText: {
        fontSize: 24,
        color: "#ffffff",
        fontWeight: "bold",
    },
    tipText: {
        fontSize: 16,
        fontFamily: 'Roboto-Mono',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#80D0D2',
        borderRadius: 20,
        alignSelf: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
    
export default GymMap;