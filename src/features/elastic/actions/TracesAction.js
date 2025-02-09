import React from "react";
import { useNavigate } from "react-router-dom";

import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import { IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";

const TracesAction = ({ name, selectedData }) => {
  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate(`/elastic-services-trace-visualize/${name}`, {
      state: { traceName: name, selectedData: selectedData },
    });
  };

  return (
    <IconButton onClick={onClickHandler}>
      <MDTypography variant="caption" color="text" fontWeight="medium">
        <VisibilitySharpIcon fontSize="medium" />
      </MDTypography>
    </IconButton>
  );
};

export default TracesAction;
