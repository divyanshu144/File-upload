import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import {
  Button,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { storage } from "../../firebase";
import FileUploadDialog from "./FileUploadDialog";
import UploadedFilesGrid from "./UploadedFilesGrid";
import "./FileUpload.css";
import GoogleDrivePicker from "../google-drive/GoogleDriveFilePicker";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const progress = 50;
  const fileName = 'Final_points';
  const fileSize = '1.9MB';

  useEffect(() => {
    fetchUploadedFiles();
  }, []);


  const fetchUploadedFiles = async () => {
    const filesRef = ref(storage, "files/");
    try {
      const result = await listAll(filesRef);
      const files = await Promise.all(
        result.items.map(async (item) => {
          const downloadURL = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          return {
            name: metadata.name, 
            size:(metadata.size / 1000000).toFixed(2), 
            url: downloadURL, 
          };
        })
      );
      setUploadedFiles(files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const storageRef = ref(storage, `files/${file.name}`);
    setUploading(true);

    try {
      await uploadBytes(storageRef, file);
      await fetchUploadedFiles();
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
      setOpenDialog(false);
    }
  };

  // const handleUrlUpload = async () => {
  //   if (!url) {
  //     alert("Please enter a URL!");
  //     return;
  //   }

  //   try {
  //     new URL(url);
  // } catch (_) {
  //     alert("Invalid URL format.");
  //     return;
  // }

  //   try {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     const fileRef = ref(storage, `files/${new Date().getTime()}`);

  //     setUploading(true);
  //     await uploadBytes(fileRef, blob);
  //     await fetchUploadedFiles();
  //     alert("File uploaded successfully!");
  //   } catch (error) {
  //     console.error("Error uploading file from URL:", error);
  //     alert("Error uploading file from URL.");
  //   } finally {
  //     setUploading(false);
  //     setOpenDialog(false);
  //   }
  // };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);
    setSelectedOption(option);
    if (option) {
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFile(null);
    setUrl("");
    setSelectedOption("");
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <Typography variant="h4" align="center">
          File Upload
        </Typography>
        <div className="file-container">
        <Button
            variant="contained"
            sx={{ 
              backgroundColor: "#B53736",
              width: '201px',
              height: '52px',
              marginTop: '20px',

            }}
            startIcon={<CloudUpload />}
            onClick={handleMenuClick}
          >
            Select File
          </Button>
          <GoogleDrivePicker/>
        </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleMenuClose("")}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#F5F5F5",
                width: '201px'
              },
            }}
          >
            <MenuItem onClick={() => handleMenuClose("computer")}>
              From my computer
            </MenuItem>
            <MenuItem onClick={() => handleMenuClose("url")}>By URL</MenuItem>
            <MenuItem onClick={() => handleMenuClose("googleDrive")}>
              From Google Drive
            </MenuItem>
          </Menu>

      </div>
          
      <div className="container">
        <h6 className="heading">Uploaded Files</h6>

        <div className="file-details">
          <div className="file-info">
            <p className="file-name">{fileName}</p>
            <p className="file-size">{fileSize}</p>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-percentage">{progress}%</p>
          </div>
        </div>
    </div>

      <hr />

      <UploadedFilesGrid uploadedFiles={uploadedFiles} />

      <FileUploadDialog
        open={openDialog}
        selectedOption={selectedOption}
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
        // handleUrlUpload={handleUrlUpload}
        handleDialogClose={handleDialogClose}
        uploading={uploading}
        file={file}
      />
    </div>
  );
};

export default FileUpload;