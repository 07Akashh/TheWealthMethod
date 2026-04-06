import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { 
  ArrowLeft, 
  RotateCcw, 
  Mail, 
  ShieldCheck, 
  Shield, 
  ArrowRight 
} from "lucide-react-native";
import React, { useState, useMemo } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AuthStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../theme/ThemeProvider";

const { width, height } = Dimensions.get("window");

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPin">;

export const ResetPinScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const [tempPin, setTempPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const handleUpdatePin = () => {
    if (!tempPin || !newPin) return;
    navigation.navigate("Login");
  };

  const dynamicStyles = useMemo(() => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    glow: {
      position: "absolute" as const,
      top: -100,
      right: -100,
      width: width * 0.8,
      height: width * 0.8,
      borderRadius: (width * 0.8) / 2,
      backgroundColor: theme.colors.primary,
      opacity: isDark ? 0.08 : 0.12,
    } as ViewStyle,
    glowSecondary: {
      top: height * 0.4,
      left: -100,
      opacity: isDark ? 0.05 : 0.08,
      backgroundColor: theme.colors.info,
    } as ViewStyle,
    logoSquare: {
      width: 32,
      height: 32,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginRight: 12,
    } as ViewStyle,
    logoCircle: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.colors.surface,
    } as ViewStyle,
    brandTitle: {
      fontSize: 22,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurface,
      letterSpacing: -0.5,
    } as TextStyle,
    badge: {
      alignSelf: "flex-start" as const,
      backgroundColor: theme.colors.primary + "1A",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      marginBottom: 20,
    } as ViewStyle,
    badgeText: {
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.primary,
      letterSpacing: 1.2,
    } as TextStyle,
    heroText: {
      fontSize: 42,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      lineHeight: 48,
    } as TextStyle,
    heroDesc: {
      fontSize: 15,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 22,
      marginTop: 16,
      opacity: 0.8,
    } as TextStyle,
    hubCard: {
      backgroundColor: theme.colors.surfaceContainer,
      borderRadius: 32,
      padding: 24,
      borderWidth: 1.5,
      borderColor: theme.colors.outlineVariant + "20",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: isDark ? 0.4 : 0.06,
      shadowRadius: 24,
      elevation: 12,
    } as ViewStyle,
    hubTitle: {
      fontSize: 20,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurface,
    } as TextStyle,
    hubSubtitle: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      marginTop: 2,
    } as TextStyle,
    bottomFeatures: {
      flexDirection: "row" as const,
      marginTop: 40,
      gap: 16,
    } as ViewStyle,
    featureItem: {
      flex: 1,
      backgroundColor: theme.colors.surfaceContainerLow,
      padding: 16,
      borderRadius: 24,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant + "10",
    } as ViewStyle,
    featureIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceContainer,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    } as ViewStyle,
    featureTitle: {
      fontSize: 15,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurface,
    } as TextStyle,
    featureDesc: {
      fontSize: 11,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 16,
      opacity: 0.8,
    } as TextStyle,
    resendPin: {
      textAlign: "center" as const,
      marginTop: 24,
    } as ViewStyle,
    resendPinText: {
      fontSize: 14,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.primary,
      textAlign: "center" as const,
    } as TextStyle,
  }), [theme, isDark]);

  return (
    <SafeAreaView style={dynamicStyles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={dynamicStyles.glow} />
      <View style={[dynamicStyles.glow, dynamicStyles.glowSecondary]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.branding}>
            <View style={dynamicStyles.logoSquare}>
              <View style={dynamicStyles.logoCircle} />
            </View>
            <Text style={dynamicStyles.brandTitle}>The Wealth Method</Text>
          </View>

          <View style={styles.heroBlock}>
            <View style={dynamicStyles.badge}>
              <Text style={dynamicStyles.badgeText}>PIN RECOVERY</Text>
            </View>

            <Text style={dynamicStyles.heroText}>Reset your</Text>
            <Text style={dynamicStyles.heroText}>
               <Text style={{ color: theme.colors.primary }}>Security</Text>
               <Text> Pin</Text>
            </Text>

            <Text style={dynamicStyles.heroDesc}>
              Enter the temporary pin sent to your email to set a new security pin 
              and restore full encrypted access.
            </Text>
          </View>

          <View style={dynamicStyles.hubCard}>
            <View style={styles.hubHeader}>
              <View>
                <Text style={dynamicStyles.hubTitle}>Credential Hub</Text>
                <Text style={dynamicStyles.hubSubtitle}>Defining new access parameters</Text>
              </View>
              <Text style={styles.stepTag}>STEP 02</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="TEMPORARY PIN"
                value={tempPin}
                onChangeText={setTempPin}
                placeholder="6-digit code"
                leftIcon={Mail}
                keyboardType="numeric"
              />

              <Input
                label="NEW SECURITY PIN"
                value={newPin}
                onChangeText={setNewPin}
                placeholder=". . . . ."
                secureTextEntry
                leftIcon={ShieldCheck}
                keyboardType="numeric"
              />

              <Button
                title="Update Pin"
                onPress={handleUpdatePin}
                style={styles.actionBtn}
                disabled={!tempPin || !newPin}
                icon={ArrowRight}
              />

              <Pressable onPress={() => {}} style={dynamicStyles.resendPin}>
                <Text style={dynamicStyles.resendPinText}>Resend temporary pin</Text>
              </Pressable>
            </View>
          </View>

          <View style={dynamicStyles.bottomFeatures}>
            <View style={dynamicStyles.featureItem}>
              <View style={dynamicStyles.featureIconCircle}>
                <Shield size={20} color={theme.colors.primary} />
              </View>
              <Text style={dynamicStyles.featureTitle}>Encryption</Text>
              <Text style={dynamicStyles.featureDesc}>
                Your security pin is end-to-end encrypted and never stored.
              </Text>
            </View>

            <View style={dynamicStyles.featureItem}>
              <View style={dynamicStyles.featureIconCircle}>
                <RotateCcw size={20} color={theme.colors.primary} />
              </View>
              <Text style={dynamicStyles.featureTitle}>Activity Log</Text>
              <Text style={dynamicStyles.featureDesc}>
                Pin changes are logged for your protection. Check alerts.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.copyright, { color: theme.colors.onSurfaceDim }]}>
              © 2026 THE WEALTH METHOD SECURE GATEWAY
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  branding: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  heroBlock: {
    marginBottom: 40,
  },
  hubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  stepTag: {
    fontSize: 10,
    fontFamily: "Inter-SemiBold",
    color: "#64748b",
    letterSpacing: 1,
    marginTop: 6,
  },
  form: {
    gap: 16,
    marginTop: 8,
  },
  actionBtn: {
    marginTop: 12,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  copyright: {
    fontSize: 10,
    opacity: 0.6,
    letterSpacing: 1,
  },
});
