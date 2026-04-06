import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPin: { identifier: string };
  OTP: { phone: string; role: string };
};

export type PortalStackParamList = {
  MainTabs: NavigatorScreenParams<PortalTabParamList>;
  PortalHome: undefined;
  PortalHistory: undefined;
  PortalAdd: undefined;
  PortalGoals: undefined;
  PortalAnalytics: undefined;
  PortalProfile: undefined;
  PortalNotifications: undefined;
  NotificationSettings: undefined;
  SecurityHub: undefined;
  PortalMessages: undefined;
  ChangePassword: undefined;
  PersonalInfo: undefined;
  IndigoVault: undefined;
  HelpCenter: undefined;
  ContactUs: undefined;
  EditProfile: undefined;
  
  // Tab shortcuts for easier navigation
  HomeTab: undefined;
  HistoryTab: undefined;
  AddTab: undefined;
  GoalsTab: undefined;
  AnalyticsTab: undefined;
  GoalDetail: { goal: any };
};

export type PortalTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  AddTab: undefined;
  GoalsTab: undefined;
  AnalyticsTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  PortalStack: NavigatorScreenParams<PortalStackParamList>;
};
