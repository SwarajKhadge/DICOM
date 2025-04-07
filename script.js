const currentTabKey = 'currentTab';
const defaultTab = 'uploadTab';


cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstone = cornerstone;

// Enable the DICOM viewer element
const dicomViewer = document.getElementById('dicomViewer');
cornerstone.enable(dicomViewer);

function loadAndDisplayImage(file) {
const reader = new FileReader();
reader.onload = function (event) {
const arrayBuffer = event.target.result;
const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

// Load and display image
cornerstone.loadImage(imageId).then(image => {
cornerstone.displayImage(dicomViewer, image);
cornerstoneTools.init();
setupTools();  // Setup interaction tools
}).catch(err => {
console.error("Error loading DICOM image:", err);
alert("Failed to load DICOM file.");
});
};
reader.readAsArrayBuffer(file);
}

function setupTools() {
const toolGroup = cornerstoneTools.addToolGroup('defaultToolGroup');
cornerstoneTools.addTool(cornerstoneTools.PanTool);
cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 }); // Left-click for Pan
}

function enablePan() {
cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
}

function enableZoom() {
cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });
}

function enableWindowLevel() {
cornerstoneTools.setToolActive('WindowLevel', { mouseButtonMask: 1 });
}

function resetView() {
cornerstone.reset(dicomViewer);
}

function invertColors() {
const viewport = cornerstone.getViewport(dicomViewer);
viewport.invert = !viewport.invert;
cornerstone.setViewport(dicomViewer, viewport);
}

function rotateImage() {
const viewport = cornerstone.getViewport(dicomViewer);
viewport.rotation += 90;
cornerstone.setViewport(dicomViewer, viewport);
}

// Handle file upload and load DICOM image
document.getElementById('imageInput').addEventListener('change', function(event) {
const file = event.target.files[0];
if (file) {
loadAndDisplayImage(file);
switchTab('dicomTab'); // Switch to DICOM tab
} else {
alert('Please select a DICOM file.');
}
});

// Original Function to switch tabs
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.main-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    // Highlight active tab
    document.querySelectorAll('.drawer a').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(tabId + 'Link').classList.add('active');

    localStorage.setItem(currentTabKey, tabId); // Save current tab to localStorage
}

// function switchTab(tabId) {
//     const targetTab = document.getElementById(tabId);
    
//     if (!targetTab) {
//         console.error(`Tab with ID ${tabId} not found`);
//         return; // Prevent further execution if tab is not found
//     }

//     // Hide all tabs
//     const tabs = document.querySelectorAll('.main-content');
//     tabs.forEach(tab => {
//         tab.classList.remove('active');
//     });

//     // Show the selected tab
//     targetTab.classList.add('active');

//     // Highlight active tab link in drawer
//     document.querySelectorAll('.drawer a').forEach(link => {
//         link.classList.remove('active');
//     });

//     const activeLink = document.querySelector(`.drawer a[onclick="switchTab('${tabId}')"]`);
//     if (activeLink) {
//         activeLink.classList.add('active');
//     } else {
//         console.error(`No link found for tab ID ${tabId}`);
//     }
// }

// Future Functions
// function uploadImage() {
//     const imageInput = document.getElementById('imageInput');
//     const file = imageInput.files[0];

//     // Check if a file is selected
//     if (!file) {
//         alert('Please select a DICOM file to upload.');
//         return;
//     }

//     const formData = new FormData();
//     formData.append('file', file); // 'dicomImage' must match the key expected by your backend

//     console.log('Uploading file:', file.name); // Log the file being uploaded

//     // Uploading DICOM image to the server
//     fetch('http://192.168.97.36:8000/api/dicom/extract-parameters/', { // Replace with actual API endpoint
//         method: 'POST',
//         body: formData,
//     })
//     .then(response => {
//         console.log('Response status:', response.status); // Log the response status
//         if (!response.ok) {
//             throw new Error('Failed to upload image');
//         }
//         return response.json(); // Parse response as JSON
//     })
//     .then(data => {
//         console.log('Server response data:', data); // Log server response data

//         if (data.success) {
//             // Display the uploaded DICOM image and analysis details
//             displayDicomAnalysis(data);
//             // Switch to the 'View DICOM' tab
//             switchTab('dicomTab');
//         } else {
//             // Alert if upload failed with a reason from the backend
//             alert('Image upload failed: ' + (data.message || 'Unknown error'));
//         }
//     })
//     .catch(error => {
//         console.error('Error during upload:', error);
//         alert('An error occurred during the upload process.');
//     });
// }


// function displayDicomAnalysis(data) {
//     const dicomImage = document.getElementById('dicomImage');
//     const analysisDetails = document.getElementById('analysisDetails');

//     // Set the image source and make it visible
//     dicomImage.src = data.imageUrl || ''; // Use the image URL from the response
//     dicomImage.style.display = data.imageUrl ? 'block' : 'none';

//     // Helper function to set content with fallback
//     const setContentOrNull = (elementId, value) => {
//         document.getElementById(elementId).textContent = value ? value : 'NULL';
//     };

//     // Update analysis details with null checks
//     setContentOrNull('resolution', data.resolution);
//     setContentOrNull('size', data.size);
//     setContentOrNull('format', data.format);
//     setContentOrNull('modality', data.modality);
//     setContentOrNull('patientName', data.patientName);
//     setContentOrNull('patientID', data.patientID);
//     setContentOrNull('studyDate', data.studyDate);
//     setContentOrNull('studyTime', data.studyTime);
//     setContentOrNull('accessionNumber', data.accessionNumber);
//     setContentOrNull('referringPhysician', data.referringPhysician);

//     // Make the analysis details section visible
//     analysisDetails.style.display = 'block';
// }



// Function to upload an image
async function uploadImage() {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];

    // Check if a file is selected and has the .dcm extension
    if (!file || !file.name.endsWith('.dcm')) {
        alert('Please upload a valid DICOM file with a .dcm extension.');
        return;
    }

    try {
        // Send the DICOM file to extract parameters
        const formData = new FormData();
        formData.append('file', file);

        const dicomResponse = await http.post('http://192.168.29.42:8000/api/dicom/extract-parameters/', formData);

        if (!dicomResponse.ok) {
            throw new Error('Failed to extract parameters from DICOM file');
        }

        const dicomData = await dicomResponse.json();
        displayDicomData(dicomData);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}


//Function to display DICOM data on the View DICOM screen
function displayDicomData(data) {
    const dicomImage = document.getElementById('dicomImage');
    const analysisDetails = document.getElementById('analysisDetails');

    dicomImage.src = data['image-url'];
    dicomImage.style.display = 'block';
    
    // Display analysis details
    document.getElementById('resolution').textContent = `${data.Rows} x ${data.Columns}`;
    document.getElementById('size').textContent = `${data.PixelData.length / 1024} KB`; // Example size calculation
    document.getElementById('format').textContent = data.PhotometricInterpretation;
    document.getElementById('otherDetails').textContent = `Modality: ${data.Modality}, Patient Name: ${data.PatientName}, Patient ID: ${data.PatientID}`;

    analysisDetails.style.display = 'block';
}

// Load the last visited tab
window.onload = function() {
    const lastTab = localStorage.getItem(currentTabKey) || defaultTab;
    switchTab(lastTab);
};

// HTTP Request function using http package
const http = {
    async post(url, body) {
        const response = await fetch(url, {
            method: 'POST',
            body: body,
        });
        return response;
    }
};
