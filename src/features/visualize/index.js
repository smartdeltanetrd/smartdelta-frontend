import { useState, forwardRef, useEffect } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  Card,
  Grid,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  CircularProgress,
  Box,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InsightsIcon from "@mui/icons-material/Insights";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { useFileController } from "contexts/FileContext";
import ReactFlowWrapper from "./ForceLayout";
import { useVisualizerController } from "contexts/VisualizerContext";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "contexts/UIContext";
import useUserGuide from "features/userTours/useUserGuide";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Visualizer() {
  const [controller, _] = useMaterialUIController();
  const { state, dispatch: dpc, viewFile } = useFileController();
  const { fileStateToView } = state;
  const { fileName } = fileStateToView || {};

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { dispatch, toggleResourceSidebar } = useVisualizerController();
  const { darkMode } = controller;

  // for resetting the user guide for each local storage key
  const { resetUserGuide: resetVisualizerTools } =
    useUserGuide("visualizer-tools");
  const { resetUserGuide: resetDetailPanel } =
    useUserGuide("interaction-panel");
  const { resetUserGuide: resetSidebarOptions } = useUserGuide("latency-menu");

  const clickResourcePrediction = async () => {
    toggleResourceSidebar(dispatch, true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYesClose = async () => {
    resetVisualizerTools();
    resetDetailPanel();
    resetSidebarOptions();

    setLoading(true);

    const filename = localStorage.getItem("visualizationClickedPath");
    await viewFile(dpc, filename);

    setLoading(false);

    navigate("/visualizer");

    setOpen(false);
  };

  useEffect(() => {
    setLoading(false); // after state update loading is done for re-render
  }, [fileStateToView]);

  const bgStyles = {
    background: "#360033" /* fallback for old browsers */,
    background:
      "-webkit-linear-gradient(to right, #0b8793, #360033)" /* Chrome 10-25, Safari 5.1-6 */,
    background:
      "linear-gradient(to right, #0b8793, #360033)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
  };

  const breadcrumbs = [
    <MDTypography variant="h6" color="white">
      Dataset
    </MDTypography>,
    <MDTypography variant="h6" color="white">
      {fileName}
    </MDTypography>,
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <Breadcrumbs
                  separator={
                    <NavigateNextIcon
                      fontSize="small"
                      sx={{ color: "#e6ee9c" }}
                    />
                  }
                  aria-label="breadcrumb"
                >
                  {breadcrumbs}
                </Breadcrumbs>
                {fileStateToView && (
                  <>
                    <Tooltip title="Services Summary">
                      <IconButton
                        onClick={clickResourcePrediction}
                        sx={{
                          position: "absolute",
                          left: 2,
                          bottom: 5,
                          color: darkMode ? "#FFFFFF" : "#000000",
                        }}
                      >
                        <SummarizeIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Help">
                      <IconButton
                        onClick={handleClickOpen}
                        sx={{
                          position: "absolute",
                          left: 32,
                          bottom: 5,
                          color: darkMode ? "#FFFFFF" : "#000000",
                        }}
                      >
                        <HelpOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Resource Usage">
                      <IconButton
                        onClick={clickResourcePrediction}
                        sx={{
                          position: "absolute",
                          left: 62,
                          bottom: 5,
                          color: darkMode ? "#FFFFFF" : "#000000",
                        }}
                      >
                        <InsightsIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <div>
                  <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle sx={bgStyles}>
                      {"Do you want to restart the visualizer tour guide?"}
                    </DialogTitle>
                    <DialogContent sx={bgStyles}>
                      <DialogContentText id="alert-dialog-slide-description">
                        Explore our visualizer feature for a better
                        understanding and control of your microservices
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={bgStyles}>
                      <Button onClick={handleClose}>No</Button>
                      <Button onClick={handleYesClose}>Yes</Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </MDBox>
              <MDBox pt={3} pl={10} pb={5}>
                {loading ? (
                  <Box display="flex" justifyContent="center" pb={20} pt={20}>
                    <CircularProgress color="inherit" />
                  </Box>
                ) : fileStateToView ? ( // data from the file state
                  <ReactFlowWrapper csvData={fileStateToView} />
                ) : (
                  <Box sx={{ color: darkMode ? "#FFFFFF" : "#000000", p: 3 }}>
                    There is no data to visualize yet
                  </Box>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Visualizer;
