import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextStyle,
  ViewStyle,
  Switch,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Vibration,
} from "react-native";
import {
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Key,
  Smartphone,
  Laptop,
  Tablet,
  History,
  ChevronRight,
  Info,
  Zap,
  X,
  CheckCircle2,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";
import { useUserStore } from "../../store/userStore";

const SecurityItem = ({ icon: Icon, title, desc, status, variant = "default" }: any) => {
  const { theme } = useAppTheme();
  return (
    <View style={{ 
      backgroundColor: theme.colors.surfaceContainerLow, 
      borderRadius: 24, 
      padding: 20, 
      flexDirection: "row", 
      alignItems: "center", 
      gap: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant + "20"
    }}>
      <View style={{ 
        width: 48, 
        height: 48, 
        borderRadius: 14, 
        backgroundColor: variant === "active" ? theme.colors.success + "15" : theme.colors.primary + "10",
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <Icon size={24} color={variant === "active" ? theme.colors.success : theme.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
           <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>{title}</Text>
           {status && (
              <View style={{ backgroundColor: theme.colors.success + "15", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                 <Text style={{ fontSize: 9, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.success, textTransform: "uppercase" }}>{status}</Text>
              </View>
           )}
        </View>
        <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>{desc}</Text>
      </View>
    </View>
  );
};

export const SecurityScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { biometricsEnabled, pinEnabled, privacyEnabled, pin, wipeDataEnabled, updateProfile } = useUserStore();

  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [step, setStep] = useState(1);
  const [modalError, setModalError] = useState<string | null>(null);

  const resetModal = () => {
    setShowPinModal(false);
    setCurrentPinInput("");
    setNewPinInput("");
    setStep(1);
    setModalError(null);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (currentPinInput === pin) {
        setStep(2);
        setModalError(null);
      } else {
        setModalError("Current PIN is incorrect");
        Vibration.vibrate(400);
      }
    } else {
      if (newPinInput.length === 6) {
        updateProfile({ pin: newPinInput });
        Alert.alert("Success", "Security PIN updated successfully");
        resetModal();
      } else {
        setModalError("PIN must be 6 digits");
      }
    }
  };

  const styles = useThemedStyles((t) => ({
    container: {
      paddingBottom: 40,
    } as ViewStyle,
    topLabel: {
      fontSize: 10,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.primary,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    } as TextStyle,
    title: {
      fontSize: 32,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      lineHeight: 38,
    } as TextStyle,
    healthCard: {
      backgroundColor: t.colors.surfaceContainerLow,
      borderRadius: 28,
      padding: 24,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant + "30",
    } as ViewStyle,
    scoreBox: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom: 20,
    } as ViewStyle,
    scoreText: {
      fontSize: 64,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      lineHeight: 64,
    } as TextStyle,
    totalText: {
      fontSize: 24,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurfaceDim,
      marginBottom: 10,
    } as TextStyle,
    trackContainer: {
       width: "100%",
       height: 6,
       backgroundColor: t.colors.outlineVariant + "40",
       borderRadius: 3,
       marginBottom: 16,
       overflow: "hidden",
    } as ViewStyle,
    trackFill: {
       width: "98%",
       height: "100%",
       backgroundColor: t.colors.success,
    } as ViewStyle,
    healthStatus: {
       fontSize: 12,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.success,
       textTransform: "uppercase",
       letterSpacing: 1,
    } as TextStyle,
    sectionTitle: {
       fontSize: 20,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurface,
    } as TextStyle,
    activityCard: {
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 24,
       padding: 24,
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "20",
    } as ViewStyle,
    activityImg: {
       height: 120,
       backgroundColor: t.colors.primaryContainer + "10",
       borderRadius: 16,
       marginBottom: 16,
       overflow: "hidden",
       justifyContent: "center",
       alignItems: "center",
    } as ViewStyle,
    actionCard: {
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 24,
       padding: 20,
       flexDirection: "row",
       alignItems: "center",
       gap: 16,
    } as ViewStyle,
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      padding: 20,
    } as ViewStyle,
    modalContent: {
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: 32,
      padding: 24,
      gap: 20,
    } as ViewStyle,
  }));

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <Text style={styles.topLabel}>SECURITY HUB</Text>
      <Text style={styles.title}>Vault Protection</Text>

      {/* Privacy Mode */}
      <View style={{ backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 20, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
         <View>
            <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Privacy Mode</Text>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>Hide sensitive balances</Text>
         </View>
         <Switch value={privacyEnabled} onValueChange={(val) => updateProfile({ privacyEnabled: val })} trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }} />
      </View>

      {/* Security Health */}
      <View style={styles.healthCard}>
         <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>Security Health</Text>
         <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>98</Text>
            <Text style={styles.totalText}>/100</Text>
         </View>
         <View style={styles.trackContainer}>
            <View style={styles.trackFill} />
         </View>
         <Text style={styles.healthStatus}>EXCELLENT</Text>
         <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 12 }}>Your account is fortified. Complete the <Text style={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamily.headlineBold }}>Legacy Contact</Text> setup to reach 100.</Text>
      </View>

      {/* Primary Protections */}
      <View style={{ marginTop: 32 }}>
        <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>App Shielding</Text>
        
        {/* Biometric Toggle */}
        <View style={{ 
          backgroundColor: theme.colors.surfaceContainerLow, 
          borderRadius: 24, 
          padding: 20, 
          flexDirection: "row", 
          alignItems: "center", 
          gap: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant + "20"
        }}>
          <View style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 14, 
            backgroundColor: biometricsEnabled ? theme.colors.success + "15" : theme.colors.primary + "10",
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <Fingerprint size={24} color={biometricsEnabled ? theme.colors.success : theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
               <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Biometric Access</Text>
               <Switch value={biometricsEnabled} onValueChange={(val) => updateProfile({ biometricsEnabled: val })} trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }} />
            </View>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Use device FaceID or Fingerprint.</Text>
          </View>
        </View>

        {/* PIN Toggle */}
        <View style={{ 
          backgroundColor: theme.colors.surfaceContainerLow, 
          borderRadius: 24, 
          padding: 20, 
          flexDirection: "row", 
          alignItems: "center", 
          gap: 16,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant + "20"
        }}>
          <View style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 14, 
            backgroundColor: pinEnabled ? theme.colors.success + "15" : theme.colors.primary + "10",
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <Key size={24} color={pinEnabled ? theme.colors.success : theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
               <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>App PIN Access</Text>
               <Switch value={pinEnabled} onValueChange={(val) => updateProfile({ pinEnabled: val })} trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }} />
            </View>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Secondary security layer via app PIN.</Text>
            
            {pinEnabled && (
                <Pressable 
                  onPress={() => setShowPinModal(true)}
                  style={{ marginTop: 12, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: theme.colors.primary + "10", borderRadius: 12, alignSelf: "flex-start" }}
                >
                  <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.primary }}>CHANGE SECURITY PIN</Text>
                </Pressable>
            )}
          </View>
        </View>
      </View>
      
      <SecurityItem icon={Smartphone} title="Authenticator App" desc="Time-based codes (TOTP) required for all withdrawals." status="ENFORCED" variant="active" />

      {/* Recent Activity */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 32, marginBottom: 20 }}>
         <Text style={styles.sectionTitle}>Recent Activity</Text>
         <Pressable>
            <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.primary, textTransform: "uppercase" }}>View All Logs</Text>
         </Pressable>
      </View>

      <View style={styles.activityCard}>
         <View style={styles.activityImg}>
            <Laptop size={64} color={theme.colors.primary} opacity={0.2} />
         </View>
         <View>
            <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>MacBook Pro 16" • Zurich, CH</Text>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Web dashboard access via Safari 17.2</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
               <View>
                  <Text style={{ fontSize: 14, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface }}>Oct 24, 09:12</Text>
                  <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim, textTransform: "uppercase" }}>TERMINATED</Text>
               </View>
            </View>
         </View>
      </View>

      {/* Advanced Protection */}
      <Text style={[styles.sectionTitle, { marginTop: 32, marginBottom: 20 }]}>Advanced Protection</Text>
      
      <Pressable 
        onPress={() => Alert.alert("Coming Soon", "Passkeys are currently in development for better passwordless access.")}
        style={styles.actionCard}
      >
         <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.primary + "10", alignItems: "center", justifyContent: "center" }}>
            <Key size={20} color={theme.colors.primary} />
         </View>
         <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Passkeys</Text>
            <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>Passwordless login using device security</Text>
         </View>
         <ChevronRight size={18} color={theme.colors.onSurfaceDim} />
      </Pressable>

      <Pressable 
        onPress={() => Alert.alert("Coming Soon", "Legacy Contact features will arrive in the next major patch.")}
        style={styles.actionCard}
      >
         <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.tertiary + "10", alignItems: "center", justifyContent: "center" }}>
            <Zap size={20} color={theme.colors.tertiary} />
         </View>
         <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Legacy Contact</Text>
            <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>Designate heirs for your digital vault</Text>
         </View>
         <ChevronRight size={18} color={theme.colors.onSurfaceDim} />
      </Pressable>

      <View style={[styles.actionCard, { backgroundColor: theme.colors.error + "0A" }]}>
         <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.error + "10", alignItems: "center", justifyContent: "center" }}>
            <ShieldAlert size={20} color={theme.colors.error} />
         </View>
         <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.error }}>Wipe Data</Text>
            <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>Erase all local data after 10 failed attempts</Text>
         </View>
         <Switch 
            value={wipeDataEnabled} 
            onValueChange={(val) => updateProfile({ wipeDataEnabled: val })}
            trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.error }} 
         />
      </View>

      <View style={{ height: 40 }} />

      {/* PIN Change Modal */}
      <Modal visible={showPinModal} transparent animationType="fade" onRequestClose={resetModal}>
        <View style={styles.modalContainer}>
           <Animated.View entering={FadeInDown} style={styles.modalContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                 <Text style={{ fontSize: 20, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface }}>
                    {step === 1 ? "Verify Current PIN" : "Setup New PIN"}
                 </Text>
                 <Pressable 
                   onPress={resetModal}
                   hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                   style={({ pressed }) => ({
                     opacity: pressed ? 0.5 : 1,
                     padding: 4
                   })}
                 >
                    <X size={24} color={theme.colors.onSurfaceVariant} />
                 </Pressable>
              </View>

              <Text style={{ fontSize: 14, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>
                {step === 1 ? "Please enter your current 6-digit security PIN to proceed." : "Enter a new 6-digit PIN for your vault shielding."}
              </Text>

              <TextInput
                style={{ 
                  backgroundColor: theme.colors.surfaceContainerLow, 
                  borderRadius: 16, 
                  padding: 16, 
                  fontSize: 24, 
                  textAlign: "center", 
                  letterSpacing: 8,
                  color: theme.colors.onSurface,
                  fontFamily: theme.typography.fontFamily.displayBold,
                  borderWidth: 1,
                  borderColor: theme.colors.outlineVariant
                }}
                value={step === 1 ? currentPinInput : newPinInput}
                onChangeText={step === 1 ? setCurrentPinInput : setNewPinInput}
                placeholder="000000"
                placeholderTextColor={theme.colors.outline}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                autoFocus
              />

              {modalError && (
                 <Text style={{ color: theme.colors.error, fontSize: 12, fontFamily: theme.typography.fontFamily.headlineSemi, textAlign: "center" }}>
                   {modalError}
                 </Text>
              )}

              <Pressable 
                onPress={handleNextStep}
                style={{ 
                  backgroundColor: theme.colors.primary, 
                  padding: 16, 
                  borderRadius: 16, 
                  alignItems: "center",
                  marginTop: 8
                }}
              >
                 <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.typography.fontFamily.headlineBold, fontSize: 16 }}>
                    {step === 1 ? "Verify" : "Save PIN"}
                 </Text>
              </Pressable>
           </Animated.View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};
