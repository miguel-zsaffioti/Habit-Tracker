import { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType, Animated, Pressable } from "react-native";

type BadgeCardProps = {
    image: ImageSourcePropType;
    title: string;
    description: string;
    isLocked?: boolean;
}

export default function BadgeCard({ image, title, description, isLocked = false }: BadgeCardProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    const [hovered, setHovered] = useState(false);

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
        >
            <Animated.View style={[
                styles.container, 
                isLocked ? styles.containerLocked : styles.containerUnlocked,
                { transform: [{ scale }] },
                hovered && styles.hovered,
            ]}>
                <Image 
                    source={image} 
                    style={[styles.badgeImage, isLocked && styles.imageLocked]} 
                />
                <Text style={[styles.badgeTitle, isLocked && styles.textLocked]}>
                    {title}
                </Text>
                <Text style={[styles.badgeDescription, isLocked && styles.textLocked]}>
                    {description}
                </Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 10,
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    containerUnlocked: {
        backgroundColor: '#FFF9D2',
        borderWidth: 1,
        borderColor: '#FFE600',
    },
    containerLocked: {
        backgroundColor: '#F8F9FA',
        borderWidth: 0,
    },
    badgeImage: {
        width: 32,
        height: 32,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    imageLocked: {
        opacity: 0.6,
    },
    badgeTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    badgeDescription: {
        fontSize: 10,
        color: '#555555',
        textAlign: 'center',
    },
    textLocked: {
        color: '#A0A0A0',
    },
    hovered: {
        opacity: 0.8,
    },
})