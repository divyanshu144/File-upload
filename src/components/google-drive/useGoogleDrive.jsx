import { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '224746190372-7gb5uj8chdnodd82eavbspi19htpq35f.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDT0ERXRkDx9ZFCsEr6KCEh0jTG-Cmy4Ok';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

const useGooglePicker = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [pickerLoaded, setPickerLoaded] = useState(false);
  
    useEffect(() => {
      const initClient = () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        }).then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsSignedIn);
  
          if (authInstance.isSignedIn.get()) {
            loadPickerLibrary();
          }
        }).catch(error => {
          console.error('Error initializing GAPI client:', error);
        });
      };
  
      const loadGapi = () => {
        gapi.load('client:auth2', initClient);
      };
  
      const loadPickerLibrary = () => {
        gapi.load('picker', () => {
          setPickerLoaded(true);
        });
      };
  
      loadGapi();
    }, []);
  
    const handleAuthClick = () => {
      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance) {
        authInstance.signIn();
      } else {
        console.error('Auth instance not available.');
      }
    };
  
    const handleSignOutClick = () => {
      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance) {
        authInstance.signOut();
      } else {
        console.error('Auth instance not available.');
      }
    };
  
    const createPicker = () => {

        console.log("pickerLoaded",pickerLoaded)
      if (pickerLoaded && isSignedIn) {
        const view = new google.picker.View(google.picker.ViewId.DOCS); // To select any kind of file
        const picker = new google.picker.PickerBuilder()
          .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
          .addView(view)
          .setDeveloperKey(API_KEY)
          .setCallback(pickerCallback)
          .build();
        picker.setVisible(true);
      } else {
        console.error('Picker not loaded or user not signed in.');
      }
    };
  
    const pickerCallback = (data) => {
      if (data.action === google.picker.Action.PICKED) {
        const file = data.docs[0];
        console.log('Selected file:', file);
        alert(`You selected the file: ${file.name}`);
      }
    };
  
    return { isSignedIn, handleAuthClick, handleSignOutClick, createPicker };
  };

export default useGooglePicker;