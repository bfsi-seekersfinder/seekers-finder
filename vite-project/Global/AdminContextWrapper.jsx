// src/Admin/AdminContextWrapper.js
import React from "react";
import { AdminProvider } from "../Global/AdminUserContext";

const AdminContextWrapper = ({ children }) => {
  return <AdminProvider>{children}</AdminProvider>;
};

export default AdminContextWrapper;
