import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { AppState, Platform, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import toastHandler from "../../Functions/Toasthandler";

const toast = toastHandler();

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  useEffect(() => {
    // 1. App State focus management
    const subscription = AppState.addEventListener('change', onAppStateChange);

    // 2. Online status management
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
      
      const wasOnline = onlineManager.isOnline();
      onlineManager.setOnline(isOnline);

      // Show toast on connectivity change (optional but premium feel)
      if (wasOnline && !isOnline) {
        toast("warn", "You are currently offline. Some features may be limited.");
      } else if (!wasOnline && isOnline) {
        toast("sus", "Back online! Syncing data...");
      }
    });

    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, []);

  const queryClientRef = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 2, 
          refetchOnWindowFocus: true, 
          refetchOnReconnect: true,
          staleTime: 60000, 
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;

// refetchInterval: 15000,
// staleTime: 0,
//it means queries will refetch after stale time and until then considered fresh.
// gcTime: 1000 * 60 * 5,
//by default query labeled as "inactive" when there is not active instance and remain in the cache.
//also its garbage collected after 5 minutes.
