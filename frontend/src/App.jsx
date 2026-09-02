import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BankingProvider } from './context/BankingContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';

// Layouts
import { AppShell } from './components/layout/AppShell';
import { PublicLayout } from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { AdminLayout } from './features/admin/AdminLayout';

// Public & Auth Pages
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { VerifyOtpPage } from './features/auth/VerifyOtpPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';

// Protected Banking Pages
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AccountsPage } from './features/accounts/AccountsPage';
import { AccountDetailPage } from './features/accounts/AccountDetailPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { TransactionDetailPage } from './features/transactions/TransactionDetailPage';
import { TransferPage } from './features/transfers/TransferPage';
import { BeneficiariesPage } from './features/beneficiaries/BeneficiariesPage';
import { BillPaymentsPage } from './features/billpay/BillPaymentsPage';
import { CardsPage } from './features/cards/CardsPage';
import { LoansPage } from './features/loans/LoansPage';
import { LoanCalculatorPage } from './features/loans/LoanCalculatorPage';
import { ProductsPage } from './features/products/ProductsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { SecurityPage } from './features/security/SecurityPage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { DocumentsPage } from './features/documents/DocumentsPage';
import { SupportPage } from './features/support/SupportPage';
import { SettingsPage } from './features/settings/SettingsPage';

// Admin Portal Pages
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';
import { AdminProductsPage } from './features/admin/AdminProductsPage';
import { AdminCustomersPage } from './features/admin/AdminCustomersPage';
import { AdminTransactionsPage } from './features/admin/AdminTransactionsPage';
import { AdminSupportPage } from './features/admin/AdminSupportPage';
import { AdminSystemLogsPage } from './features/admin/AdminSystemLogsPage';

// System Pages
import { ForbiddenPage } from './features/system/ForbiddenPage';
import { NotFoundPage } from './features/system/NotFoundPage';
import { ServerErrorPage } from './features/system/ServerErrorPage';
import { MaintenancePage } from './features/system/MaintenancePage';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BankingProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public / Landing Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-otp" element={<VerifyOtpPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                </Route>

                {/* Protected Internet Banking Application Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/accounts" element={<AccountsPage />} />
                    <Route path="/accounts/:id" element={<AccountDetailPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/transactions/:id" element={<TransactionDetailPage />} />
                    <Route path="/transfer" element={<TransferPage />} />
                    <Route path="/beneficiaries" element={<BeneficiariesPage />} />
                    <Route path="/bill-payments" element={<BillPaymentsPage />} />
                    <Route path="/cards" element={<CardsPage />} />
                    <Route path="/loans" element={<LoansPage />} />
                    <Route path="/loans/calculator" element={<LoanCalculatorPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/security" element={<SecurityPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>

                {/* Protected Admin Portal Routes */}
                <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/products" element={<AdminProductsPage />} />
                    <Route path="/admin/customers" element={<AdminCustomersPage />} />
                    <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
                    <Route path="/admin/support" element={<AdminSupportPage />} />
                    <Route path="/admin/logs" element={<AdminSystemLogsPage />} />
                  </Route>
                </Route>

                {/* System Error Routes */}
                <Route path="/403" element={<ForbiddenPage />} />
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </BankingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
