// ======================================
// Finance Tracker Voice Recorder
// ======================================

let mediaRecorder;
let audioChunks = [];
let recordedBlob = null;

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const uploadBtn = document.getElementById("uploadBtn");

const audioPlayback = document.getElementById("audioPlayback");

const transcriptionResult =
    document.getElementById("transcriptionResult");

const expenseResult =
    document.getElementById("expenseResult");

const progressContainer =
    document.getElementById("progressContainer");

// ==============================
// Start Recording
// ==============================

if(recordBtn){

recordBtn.addEventListener("click", async ()=>{

    try{

        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true
        });

        mediaRecorder = new MediaRecorder(stream);

        audioChunks = [];

        mediaRecorder.start();

        recordBtn.disabled = true;
        stopBtn.disabled = false;
        uploadBtn.disabled = true;

        mediaRecorder.ondataavailable=(event)=>{

            audioChunks.push(event.data);

        };

        mediaRecorder.onstop=()=>{

            recordedBlob = new Blob(audioChunks,{
                type:"audio/webm"
            });

            audioPlayback.src =
                URL.createObjectURL(recordedBlob);

            uploadBtn.disabled = false;

        };

    }

    catch(error){

        alert("Unable to access microphone.");

        console.error(error);

    }

});

}

// ==============================
// Stop Recording
// ==============================

if(stopBtn){

stopBtn.addEventListener("click",()=>{

    mediaRecorder.stop();

    recordBtn.disabled = false;
    stopBtn.disabled = true;

});

}

// ==============================
// Upload Audio
// ==============================

if(uploadBtn){

uploadBtn.addEventListener("click",async()=>{

    if(!recordedBlob){

        alert("Please record audio first.");

        return;

    }

    progressContainer.classList.remove("d-none");

    const formData = new FormData();

    formData.append(
        "audio",
        recordedBlob,
        "expense.webm"
    );

    try{

        const response = await fetch("/voice/upload",{

            method:"POST",

            body:formData

        });

        const data = await response.json();

        progressContainer.classList.add("d-none");

        transcriptionResult.classList.remove("d-none");

        transcriptionResult.innerHTML =
            "<strong>Transcription:</strong><br>" +
            data.transcription;

        expenseResult.classList.remove("d-none");

        expenseResult.innerHTML =
            "<strong>Detected Expense</strong><br>" +

            "Amount: ₹" + data.amount + "<br>" +

            "Category: " + data.category + "<br>" +

            "Merchant: " + data.merchant + "<br>" +

            "Date: " + data.date;

    }

    catch(error){

        progressContainer.classList.add("d-none");

        alert("Upload failed.");

        console.error(error);

    }

});

}