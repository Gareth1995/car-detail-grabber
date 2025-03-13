// saving elements to variable
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const generateButton = document.getElementById("generate-data");
const infoContainer = document.getElementsByClassName("info-container")[0];

// add event listners
fileInput.addEventListener("change", uploadImage);
generateButton.addEventListener("click", generateData);

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = "#e0e0e0";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.backgroundColor = "#fafafa";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = "#fafafa";
    const files = e.dataTransfer.files; // get dropped file
    fileInput.files = files; // assign dropped file to file input
    
    if (files.length > 0 && files[0].type.startsWith("image/")) {
        uploadImage();
    }
});

// function to upload image to dropzone
function uploadImage() {
    const fileObj = fileInput.files[0]; // get the file object
    let imgUrl = URL.createObjectURL(fileObj); // get the image url
    dropZone.style.backgroundImage = `url(${imgUrl})`; // set the image url as background image 
}

async function generateData() {
    file = fileInput.files[0]
    console.log(file);

    if(file){
        
        const reader = new FileReader();
        reader.onloadend = async function () {
            const base64String = reader.result.split(',')[1]; // Get Base64 part

            //////// Make this a separate function /////////////////////////
            // reader.readAsDataURL(file); // Trigger the file read
            const url = 'http://localhost:3000/invoke-llm';  // server url for data gen

            // Making a POST request using axios
            axios.post(url, { Image: base64String })
            .then(response => {
                console.log('GPT output:', response.data); // Handle the response from the server
            })
            .catch((error) => {
                console.error('Error:', error); // Handle any errors
            });
            /////////////////////////////////////////////////////////
        }

        reader.readAsDataURL(file); // Read the image file as Base64
    }
    
    infoContainer.style.display = 'block';

    // The data you want to send in the POST request
    // const data = {
    //     input: 'pretend this is an image of a car. You see that it is a red Toyota and the number plate is CY445789' // Replace with actual input
    // };
    
}

function hideModal(){
    infoContainer.style.display = 'none';
}

function submitData(){
    
}