# The Wealth Method 🏦

**The Wealth Method** is a premium, high-fidelity financial management portal designed to transform your wealth tracking into a data-driven, editorial experience. Built for those who prioritize privacy and performance, it offers an offline-first, vault-secured architecture for managing targets, transactions, and long-term financial growth.

---

## 🔒 Security & Authentication
As this is a **fully functional demo**, the security layer is designed to be both rigorous and easy to navigate for testing.

### Login Method: 4-Digit Secure PIN
1.  **First Launch (Onboarding)**:
    *   You will be asked to complete your profile (Name & Email).
    *   **Create Your PIN**: Set a unique 4-digit PIN. This is stored locally in your device's secure enclave.
2.  **Subsequent Access**:
    *   Every time you re-open the app or the session locks, you must enter your **4-digit PIN**.
    *   **Failed Attempts**: For security, if you exceed 10 failed attempts, the vault logic is designed to trigger a local data wipe (Enterprise-grade privacy).
3.  **Biometric Bypass**:
    *   Once a PIN is set, you can enable **FaceID / TouchID** in the Profile settings.
    *   On future logins, tap the "FaceID" icon on the Keypad to unlock instantly.

---

## 🚀 Key Features

### 🏦 The Vault (Wealth Strategy)
*   **Auto-Allocation Engine**: Distributes your total liquid balance across multiple objectives based on priority and progress.
*   **Dynamic Projections**: See exactly when you'll reach your targets (e.g., "OCT 2027") based on your real-time monthly saving rate (Income - Expenses).
*   **Goal Management**: Create and track specific objectives (Emergency Fund, Estate, Trip, etc.) with automated streak tracking.

### 📊 Editorial Analytics
*   **Wealth Hub Dashboard**: A high-fidelity, animated overview of your total balance, monthly performance, and category breakdowns.
*   **Categorized Spending**: Visualize exactly where your money goes with color-coded spending charts.
*   **Privacy Mode**: One-tap "Confidentiality" toggle on the Home screen to mask all sensitive balances (••••) for safe public viewing.

### 🌐 Multi-Currency Sync
*   **Instant Conversion**: Seamlessly switch between global currencies (USD, EUR, GBP, JPY, etc.) with **INR as the baseline default**.
*   **Live Exchange Rates**: Integrated with the Frankfurter API for real-time currency calculation and symbol synchronization.

---

## 🛠️ Technology Stack
*   **Framework**: Expo (React Native)
*   **Database**: SQLite (Offline-first, data never leaves your device)
*   **State Management**: TanStack Query (Server state) & Zustand (Global UI state)
*   **Animations**: React Native Reanimated (60fps fluid UI)
*   **Icons**: Lucide Native (Premium icon set)

---

## 🏗️ Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/the-wealth-method.git
    cd the-wealth-method
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Start the Development Server**:
    **npx expo start**

4.  **Run on Device**:
    *   Download the **Expo Go** app on your iOS/Android device.
    *   Scan the QR code from your terminal.
    *   *Note: For the best experience, use a physical device to test Biometric (FaceID) features.*

---

## 🧪 Demo Data
The application comes pre-packaged with **Seed Data** (Salary, Dividends, and common Expenses) so you can explore the analytics and vault features immediately without manual entry.

---

## 📜 License
© 2026 The Wealth Method. All Rights Reserved. Designed for premium financial management.
