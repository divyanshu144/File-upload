import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";

const UploadedFilesGrid = ({ uploadedFiles }) => {
  return (
    <>
      {uploadedFiles.length > 0 && (
        <Grid container spacing={2}>
          {uploadedFiles.map((file, index) => (
            <Grid item xs={12} key={index}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                borderBottom="1px solid #e0e0e0"
              >
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start"
                }}>
                  <Typography variant="body1" component="p">
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {file.size} MB
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#B53736",
                  }}
                  href={file.url}
                  target="_blank"
                >
                  View File
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default UploadedFilesGrid;
