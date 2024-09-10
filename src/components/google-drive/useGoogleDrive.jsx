import { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const CLIENT_ID = '224746190372-7gb5uj8chdnodd82eavbspi19htpq35f.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDT0ERXRkDx9ZFCsEr6KCEh0jTG-Cmy4Ok';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

const useGooglePicker = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [pickerLoaded, setPickerLoaded] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [fileData, setFileData] = useState(null);
  
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
      if (pickerLoaded && isSignedIn) {
        const view = new google.picker.View(google.picker.ViewId.DOCS);
        const picker = new google.picker.PickerBuilder()
          .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
          .addView(view)
          .setDeveloperKey(API_KEY)
          .setCallback(pickerCallback)
          .build();
        picker.setVisible(true);
  
        setTimeout(() => {
          const pickerIframe = document.querySelector('iframe.picker-dialog');
          if (pickerIframe) {
            pickerIframe.style.position = 'relative';
            pickerIframe.style.zIndex = '1301';
          }
        }, 1000);
      } else {
        console.error('Picker not loaded or user not signed in.');
      }
    };
  
    const pickerCallback = async (data) => {
      if (data.action === google.picker.Action.PICKED) {
        // const file = data[google.picker.Response.DOCS][0];
        // const fileName = file[google.picker.Document.NAME];
        const file = data.docs[0];
        const fileId = file.id;
        console.log('Selected file:', file);
        alert(`You selected the file: ${file.name}`);
  
        setFileName(file.name);
  
        try {
          const response = await gapi.client.drive.files.get({
            fileId
          });
          console.log("response:--",response.body)
          setFileData(response.body);
        } catch (error) {
          console.error('Error fetching file data:', error);
        }
      }
    };
  
    const handleUpload = () => {
      if (fileName && fileData) {
        uploadFileToFirebase(fileName, fileData);
      }
    };
  
    const uploadFileToFirebase = (fileName, fileData) => {
      const storageRef = ref(storage, `files/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, new Blob([fileData]));
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error uploading file:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        }
      );

      alert("uploaded to firebase")
    };
  
    return { isSignedIn, handleAuthClick, handleSignOutClick, createPicker, fileName, handleUpload };
  };
  
  export default useGooglePicker;