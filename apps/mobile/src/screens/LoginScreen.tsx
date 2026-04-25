import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Theme } from '../theme/Theme';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        // Dispatch login logic
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.blurTop} />
            <View style={styles.blurBottom} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo} />
                    <Text style={styles.title}>weRide</Text>
                    <Text style={styles.subtitle}>Premium Ride Sharing</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="rider@example.com"
                            placeholderTextColor={Theme.colors.textDim}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={Theme.colors.textDim}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkContainer}>
                        <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    blurTop: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        backgroundColor: Theme.colors.primary,
        borderRadius: 150,
        opacity: 0.1,
    },
    blurBottom: {
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 300,
        height: 300,
        backgroundColor: Theme.colors.secondary,
        borderRadius: 150,
        opacity: 0.1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: Theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 60,
        height: 60,
        backgroundColor: Theme.colors.primary,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Theme.colors.text,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.textMuted,
        marginTop: 5,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        color: Theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4,
    },
    input: {
        backgroundColor: Theme.colors.card,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.md,
        padding: 18,
        color: Theme.colors.text,
        fontSize: 16,
    },
    button: {
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.radius.md,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: {
        color: Theme.colors.textDim,
        fontSize: 14,
    },
    linkHighlight: {
        color: Theme.colors.primary,
        fontWeight: '600',
    }
});

export default LoginScreen;
