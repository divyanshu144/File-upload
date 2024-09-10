import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
} from "@mui/material";
import GoogleDrivePicker from "../google-drive/GoogleDriveFilePicker";

const FileUploadDialog = ({
  open,
  selectedOption,
  handleFileChange,
  handleUpload,
  handleUrlUpload,
  handleDialogClose,
  uploading,
  file,
  url,
}) => {

    
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      className="dialog-box"
      disableEnforceFocus // Disable the focus enforcement
      sx={{
        "& .MuiDialog-container": {
          // backdropFilter: "blur(4px)",
          zIndex: '10',
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle>
        {selectedOption === "computer" && "Add file from Computer"}
        {selectedOption === "url" && "Add by URL"}
        {selectedOption === "googleDrive" && "Add file from Google Drive"}
      </DialogTitle>
      <DialogContent>
        {selectedOption === "computer" && (
          <>
            <input
              accept="*"
              className="file-input"
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                sx={{ backgroundColor: "#B53736" }}
                component="span"
              >
                Choose File
              </Button>
            </label>
            {file && (
              <Typography variant="body2">Selected file: {file.name}</Typography>
            )}
          </>
        )}

        {selectedOption === "url" && (
          <TextField
            label="Enter File URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        {selectedOption === "googleDrive" && (
          // <Typography variant="body1">
          //   Google Drive upload functionality is not implemented yet.
          // </Typography>
          <div>
            <GoogleDrivePicker/>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="secondary">
          Cancel
        </Button>
        {selectedOption === "computer" && (
          <Button
            onClick={handleUpload}
            sx={{ backgroundColor: "#B53736", color: "white" }}
            disabled={uploading || !file}
          >
            {uploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        )}
        {selectedOption === "url" && (
          <Button
            onClick={handleUrlUpload}
            sx={{ backgroundColor: "#B53736", color: "white" }}
            disabled={uploading || !url}
          >
            {uploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;