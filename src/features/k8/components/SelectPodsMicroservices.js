import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import k8spm from "../../../assets/images/k8spm.png";
import { useMaterialUIController } from "contexts/UIContext";
import MDSnackbar from "components/MDSnackbar";
import useSnackbar from "hooks/useSnackbar";

const SelectPodsComponent = () => {
  const [pods, setPods] = useState([]);
  const [filteredPods, setFilteredPods] = useState([]);
  const [selectedPods, setSelectedPods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [controller, _] = useMaterialUIController();

  const prometheusServer = "http://127.0.0.1:9090"; // prometheus' most common server URL and port
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { darkMode } = controller;
  let debounceTimeout;

  useEffect(() => {
    const fetchPods = async () => {
      setLoading(true);
      try {
        // TODO:: put them on action + axios
        const query = `up{job="kubernetes-pods"}`;
        const response = await fetch(
          `${prometheusServer}/api/v1/query?query=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          const podDetails = data.data.result.map((item) => ({
            pod: item.metric.pod,
            app: item.metric.app || "N/A",
          }));
          setPods(podDetails);
          setFilteredPods(podDetails);
        }
      } catch (err) {
        snackbar.openSnackbar(
          err.message,
          "error",
          "Error fetching cluster info or pod metrics",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPods();
  }, [prometheusServer]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearching(true);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setFilteredPods(
        pods.filter((item) =>
          item.pod.toLowerCase().includes(query.toLowerCase())
        )
      );
      setSearching(false);
    }, 500);
  };

  const handleSelectPod = (podName) => {
    setSelectedPods((prevSelected) =>
      prevSelected.includes(podName)
        ? prevSelected.filter((pod) => pod !== podName)
        : [...prevSelected, podName]
    );
  };

  const handleSelectAll = (isSelected) => {
    const visiblePods = filteredPods.map((pod) => pod.pod);
    setSelectedPods(isSelected ? visiblePods : []);
  };

  const handleConnect = () => {
    console.log("Selected Pods:: ", selectedPods);
    if (selectedPods.length === 0) {
      snackbar.openSnackbar("Please select at least one pod.", "error", "Empty selection");
      return;
    }
    navigate("/next-screen", { state: { selectedPods } }); // TODO:: continue here
  };

  const handleItemsPerPageChange = (event) => {
    const value = event.target.value;
    if (value === "show-all") {
      setItemsPerPage(filteredPods.length);
    } else {
      setItemsPerPage(parseInt(value, 10));
    }
  };

  const areAllVisiblePodsSelected =
    filteredPods.length > 0 &&
    filteredPods.every((pod) => selectedPods.includes(pod.pod));

  const isSomeVisiblePodsSelected =
    filteredPods.some((pod) => selectedPods.includes(pod.pod)) &&
    !areAllVisiblePodsSelected;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h5">
          Kubernetes Cluster Monitoring via Prometheus
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Select Pods & Microservices
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={areAllVisiblePodsSelected}
                  indeterminate={isSomeVisiblePodsSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  disabled={filteredPods.length === 0}
                />
              }
              label="Select All"
            />
            <TextField
              label="Search..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ maxWidth: 300 }}
            />
            <TextField
              select
              label="Display"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              sx={{
                width: 72,
                ".MuiOutlinedInput-root": {
                  height: 44.13,
                },
              }}
            >
              {[6, 12, 24, 48].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
              {filteredPods.length > 48 && (
                <MenuItem value="show-all">Show All</MenuItem>
              )}
            </TextField>
          </Box>
        </Box>
      </Box>

      {loading || searching ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 18,
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      ) : filteredPods.length === 0 ? (
        <Typography variant="h6" align="center" padding={18}>
          There is nothing to show here...
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredPods.slice(0, itemsPerPage).map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.pod}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    boxShadow: selectedPods.includes(item.pod)
                      ? "0px 0px 10px 2px #1976d2"
                      : undefined,
                    border: selectedPods.includes(item.pod)
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectPod(item.pod)}
                >
                  <img
                    src={k8spm}
                    alt={`${item.pod} icon`}
                    style={{ height: 140 }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{ fontSize: "1rem" }}
                    >
                      {item.app}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      align="center"
                      color={darkMode ? "#FFF" : "text.primary"}
                      sx={{
                        fontSize: "0.75rem",
                        mt: 1,
                      }}
                    >
                      {item.pod}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color={darkMode ? "primary" : "black"}
            sx={{
              mt: 3,
              width: "100%",
              "&.Mui-disabled": {
                color: "white",
                backgroundColor: "gray",
              },
            }}
            disabled={selectedPods.length === 0}
            onClick={handleConnect}
          >
            Compare Selected Microservices
          </Button>
        </>
      )}
      <MDSnackbar
        open={snackbar.isOpen}
        onClose={snackbar.closeSnackbar}
        message={snackbar.message}
        title={snackbar.title}
        icon={snackbar.icon}
        type={snackbar.type}
      />
    </Box>
  );
};

export default SelectPodsComponent;
