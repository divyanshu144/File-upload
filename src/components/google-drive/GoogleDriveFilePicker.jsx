import React from 'react';
import { Button, Typography } from '@mui/material';
import useGooglePicker from './useGoogleDrive';

const GoogleDrivePicker = () => {
  const { isSignedIn, handleAuthClick, handleSignOutClick, createPicker, fileName, handleUpload } = useGooglePicker();

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {!isSignedIn ? (
        <Button variant="contained" color="primary" onClick={handleAuthClick}>
          Sign in with Google
        </Button>
      ) : (
        <>
          <Button variant="contained" color="secondary" onClick={handleSignOutClick}>
            Sign Out
          </Button>
          <Button variant="contained" color="primary" onClick={createPicker} style={{ marginLeft: '10px' }}>
            Open Google Drive Picker
          </Button>
        </>
      )}

      {fileName && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="body1">Selected file: {fileName}</Typography>
          <Button variant="contained" color="primary" onClick={handleUpload} style={{ marginTop: '10px' }}>
            Upload to Firebase
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoogleDrivePicker;

