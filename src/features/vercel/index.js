import React, { useState } from "react";
import {
  Box,
  Card,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import useGetProjects from "./hooks/useGetProjects";
import TokenInputModal from "./components/TokenInputModal";
import VercelAccountList from "./components/VercelAccountList";

const VercelProjectIntegrations = () => {
  const [vercelAccountData, setVercelAccountData] = useState({
    username: "Alper Celik",
    email: "alperwithsteel@gmail.com",
    token: "xutw4zdgv9ROo0VBUB2rAhbk",
  }); // TODO:: Temporary, remove it

  // TODO:: Change the logic
  const [inputVercelUsername, setInputVercelUsername] = useState("");
  const [inputVercelEmail, setInputVercelEmail] = useState("");
  const [inputVercelToken, setInputVercelToken] = useState("");

  const isAnyIntegrationExist = true; // TODO:: Check if any integration exists

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const { handleToken, loading } = useGetProjects(setSnackbar);

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 23,
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      );
    }

    return isAnyIntegrationExist ? (
      <VercelAccountList
        data={vercelAccountData}
        inputVercelUsername={inputVercelUsername}
        inputVercelEmail={inputVercelEmail}
        inputVercelToken={inputVercelToken}
        setInputVercelUsername={setInputVercelUsername}
        setInputVercelEmail={setInputVercelEmail}
        setInputVercelToken={setInputVercelToken}
        handleToken={handleToken}
      />
    ) : (
      <TokenInputModal
        inputVercelToken={inputVercelToken}
        inputVercelUsername={inputVercelUsername}
        inputVercelEmail={inputVercelEmail}
        setInputVercelUsername={setInputVercelUsername}
        setInputVercelEmail={setInputVercelEmail}
        setInputVercelToken={setInputVercelToken}
        handleToken={handleToken}
      />
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>{renderContent()}</Card>
          </Grid>
        </Grid>
      </MDBox>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiAlert-root": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor: "rgb(244, 67, 54)", // Custom background color
            color: "#fff", // Text color
            display: "flex",
            flexDirection: "column",
            "& .MuiAlert-icon": {
              color: "#fff", // Icon color
              textAlign: "center",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default VercelProjectIntegrations;
