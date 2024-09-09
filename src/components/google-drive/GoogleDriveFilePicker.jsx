import React from 'react';
import { Button, Typography } from '@mui/material';
import useGooglePicker from './useGoogleDrive';

const GoogleDrivePicker = () => {
  const { isSignedIn, handleAuthClick, handleSignOutClick, createPicker } = useGooglePicker();

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

      <Typography variant="body1" style={{ marginTop: '20px' }}>
        {isSignedIn ? 'Signed in! You can now open Google Drive and select a file.' : 'Please sign in to access Google Drive.'}
      </Typography>
    </div>
  );
};

export default GoogleDrivePicker;
