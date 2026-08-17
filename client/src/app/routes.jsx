import React from "react";
import DashboardPage from "../pages/DashboardPage.jsx";
import IntakePage from "../pages/IntakePage.jsx";
import ProductionPage from "../pages/ProductionPage.jsx";
import ByProductsPage from "../pages/ByProductsPage.jsx";
import CharcoalPage from "../pages/CharcoalPage.jsx";
import InventoryPage from "../pages/InventoryPage.jsx";
import SalesPage from "../pages/SalesPage.jsx";
import QualityPage from "../pages/QualityPage.jsx";
import SustainabilityPage from "../pages/SustainabilityPage.jsx";
import UsersPage from "../pages/UsersPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";

export const routes = [
  { path: "dashboard", label: "Dashboard", icon: "dashboard", element: <DashboardPage />, roles: ["ADMIN", "MANAGER", "PRODUCTION", "QC", "SALES", "DELIVERY"] },
  { path: "intake", label: "Raw Intake", icon: "intake", element: <IntakePage />, roles: ["ADMIN", "MANAGER", "PRODUCTION"] },
  { path: "production", label: "Oil Production", icon: "production", element: <ProductionPage />, roles: ["ADMIN", "MANAGER", "PRODUCTION"] },
  { path: "by-products", label: "By-Products", icon: "byproducts", element: <ByProductsPage />, roles: ["ADMIN", "MANAGER", "PRODUCTION"] },
  { path: "charcoal", label: "Charcoal Unit", icon: "charcoal", element: <CharcoalPage />, roles: ["ADMIN", "MANAGER", "PRODUCTION"] },
  { path: "inventory", label: "Inventory", icon: "inventory", element: <InventoryPage />, roles: ["ADMIN", "MANAGER", "SALES", "PRODUCTION"] },
  { path: "sales", label: "Sales & Orders", icon: "sales", element: <SalesPage />, roles: ["ADMIN", "MANAGER", "SALES"] },
  { path: "quality", label: "Quality Control", icon: "quality", element: <QualityPage />, roles: ["ADMIN", "MANAGER", "QC"] },
  { path: "sustainability", label: "Sustainability", icon: "sustainability", element: <SustainabilityPage />, roles: ["ADMIN", "MANAGER"] },
  { path: "users", label: "Users & Roles", icon: "users", element: <UsersPage />, roles: ["ADMIN"] },
  { path: "settings", label: "Settings", icon: "settings", element: <SettingsPage />, roles: ["ADMIN", "MANAGER"] }
];
