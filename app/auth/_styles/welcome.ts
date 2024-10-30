import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '50%',
        // alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        maxWidth: '80%',
        color: Colors.light.text,
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        textAlign: 'center',
        maxWidth: '80%',
        color: Colors.light.text,
        marginVertical: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
        gap: 15,
    },
    button: {
        width: '50%',
        backgroundColor: Colors.light.primary,
        padding: 12,
        borderRadius: 7,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});