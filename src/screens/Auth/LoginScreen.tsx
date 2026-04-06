import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { 
  AtSign, 
  ShieldCheck, 
  ArrowUpRight, 
  Command,
  HelpCircle,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
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
import { useAuthActions } from "../../features/auth/useAuthActions";
import { AuthStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../theme/ThemeProvider";

const { width, height } = Dimensions.get("window");

const GoogleIcon = ({ size = 20 }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </Svg>
);

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const [role, setRole] = useState("user");
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [identity, setIdentity] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const { loginWithEmail, loading } = useAuthActions();

  const handleLogin = async () => {
    if (authMode === "email") {
      if (!identity || !pin) return;
      const success = await loginWithEmail(identity, pin);
      if (success) {
        navigation.navigate("OTP", { phone: identity, role });
      }
    } else {
      if (!phone) return;
      navigation.navigate("OTP", { phone: phone, role });
    }
  };

  const dynamicStyles = useMemo(() => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    heroGlow: {
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
      fontSize: 48,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      lineHeight: 52,
    } as TextStyle,
    heroDesc: {
      fontSize: 16,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 24,
      marginTop: 20,
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
    modeToggleRow: {
      flexDirection: "row" as const,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 20,
      padding: 4,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    } as ViewStyle,
    modeTabActive: {
      backgroundColor: theme.colors.surfaceBright,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    } as ViewStyle,
    modeTabTextActive: {
      color: theme.colors.primary,
    } as TextStyle,
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.outlineVariant,
    } as ViewStyle,
    footerLink: {
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.onSurfaceDim,
      letterSpacing: 0.5,
    } as TextStyle,
    requestAccessLink: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.headlineBold,
    } as TextStyle,
    forgotText: {
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.primary,
      letterSpacing: 0.5,
    } as TextStyle,
  }), [theme, isDark]);

  return (
    <SafeAreaView style={dynamicStyles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={dynamicStyles.heroGlow} />
      <View style={[dynamicStyles.heroGlow, dynamicStyles.glowSecondary]} />

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
              <Text style={dynamicStyles.badgeText}>FINANCIAL GATEWAY</Text>
            </View>
            <Text style={dynamicStyles.heroText}>Your</Text>
            <Text style={dynamicStyles.heroText}>
              <Text style={{ color: theme.colors.primary, fontStyle: "italic" }}>financial</Text>
              <Text> hub</Text>
            </Text>
            <Text style={dynamicStyles.heroText}>awaits.</Text>

            <Text style={dynamicStyles.heroDesc}>
              Elevate your financial journey with high-fidelity 
              wealth management tools. Join a secure digital ecosystem.
            </Text>
          </View>

          <View style={dynamicStyles.hubCard}>

            <View style={styles.form}>
              <View style={dynamicStyles.modeToggleRow}>
                <Pressable 
                   style={[styles.modeTab, authMode === "email" && dynamicStyles.modeTabActive]}
                   onPress={() => setAuthMode("email")}
                >
                   <Text style={[styles.modeTabText, authMode === "email" && dynamicStyles.modeTabTextActive]}>
                     Email / ID
                   </Text>
                </Pressable>
                <Pressable 
                   style={[styles.modeTab, authMode === "phone" && dynamicStyles.modeTabActive]}
                   onPress={() => setAuthMode("phone")}
                >
                   <Text style={[styles.modeTabText, authMode === "phone" && dynamicStyles.modeTabTextActive]}>
                     Phone Number
                   </Text>
                </Pressable>
              </View>

              {authMode === "email" ? (
                <>
                  <Input
                    value={identity}
                    onChangeText={setIdentity}
                    placeholder="Enter email or account ID"
                    leftIcon={AtSign}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <Input
                    value={pin}
                    onChangeText={setPin}
                    placeholder="Security Pin"
                    secureTextEntry
                    leftIcon={ShieldCheck}
                    rightElement={
                      <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
                        <Text style={dynamicStyles.forgotText}>FORGOT?</Text>
                      </Pressable>
                    }
                  />
                </>
              ) : (
                <Input
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Mobile number +91"
                  leftIcon={AtSign}
                  keyboardType="phone-pad"
                />
              )}

              <Button
                title={authMode === "email" ? "Login" : "Send OTP"}
                onPress={handleLogin}
                loading={loading}
                style={styles.loginBtn}
                disabled={authMode === "email" ? (!identity || !pin) : !phone}
              />
            </View>

          </View>

          <View style={styles.footer}>
            <Text style={[styles.requestAccessText, { color: theme.colors.onSurface }]}>
              Don't have an account?{" "}
              <Text style={dynamicStyles.requestAccessLink} onPress={() => navigation.navigate("Signup")}>Sign Up</Text>
            </Text>

            <View style={styles.footerLinks}>
              <Text style={dynamicStyles.footerLink}>PRIVACY HUB</Text>
              <Text style={dynamicStyles.footerLink}>SYSTEM STATUS</Text>
              <Text style={dynamicStyles.footerLink}>SUPPORT</Text>
            </View>

            <Text style={[styles.copyright, { color: theme.colors.onSurfaceDim }]}>© 2026 THE WEALTH METHOD SYSTEMS</Text>
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
    gap: 12,
    marginTop: 24,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 16,
  },
  modeTabText: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "#64748b",
  },
  loginBtn: {
    marginTop: 12,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerText: {
    fontSize: 10,
    fontFamily: "Inter-SemiBold",
    color: "#64748b",
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  footer: {
    marginTop: 48,
    alignItems: "center",
    gap: 32,
  },
  requestAccessText: {
    fontSize: 14,
  },
  footerLinks: {
    flexDirection: "row",
    gap: 24,
  },
  copyright: {
    fontSize: 10,
    opacity: 0.6,
  },
});
