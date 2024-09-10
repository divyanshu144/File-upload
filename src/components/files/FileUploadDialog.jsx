import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import GoogleDrivePicker from "../google-drive/GoogleDriveFilePicker";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const FileUploadDialog = ({
  open,
  selectedOption,
  handleFileChange,
  handleUpload,
  handleDialogClose,
  uploading,
  file,
}) => {

  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uploadingUrl, setUploadingUrl] = useState(false);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const validateUrl = async () => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setIsValid(true);
        setOpenSnackbar(true);
        setSnackbarMessage("Valid URL and file found!.");
      } else {
        setIsValid(false);
        setOpenSnackbar(true);
        setSnackbarMessage("Invalid URL or file not found.");
      }
    } catch (error) {
      setIsValid(false);
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateUrl();
  };

  const uploadUrlToFirebase = async () => {
    if (!isValid) return;

    setUploadingUrl(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob(); // Convert the URL to a Blob

      const storageRef = ref(storage, `files/${Date.now()}`); // Create a reference to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, blob); 

      // Listen for state changes, errors, and completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: You can handle upload progress here if needed
        },
        (error) => {
          console.error("Error uploading to Firebase: ", error);
          setSnackbarMessage("Error uploading file to Firebase.");
          setOpenSnackbar(true);
          setUploadingUrl(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setSnackbarMessage("URL successfully uploaded to Firebase!");
            setOpenSnackbar(true);
            setUploadingUrl(false);
          });
        }
      );
    } catch (e) {
      console.error("Error fetching file from URL: ", e);
      setSnackbarMessage("Error fetching file from URL.");
      setOpenSnackbar(true);
      setUploadingUrl(false);
    }
  };

    
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      className="dialog-box"
      disableEnforceFocus // Disable the focus enforcement
      sx={{
        "& .MuiDialog-container": {
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
          <div >
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Paste file URL"
                  variant="outlined"
                  fullWidth
                  value={url}
                  onChange={handleUrlChange}
                  error={!isValid}
                  helperText={!isValid ? "Invalid URL or file not found" : ""}
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                  Validate URL
                </Button>
              </form>
        
              <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={() => setOpenSnackbar(false)}
                >
                  <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={isValid ? "success" : "error"}
                    sx={{ width: '100%' }}
                  >
                    {snackbarMessage}
                  </Alert>
              </Snackbar>
          </div>
        )}

        {selectedOption === "googleDrive" && (
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
            onClick={uploadUrlToFirebase}
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