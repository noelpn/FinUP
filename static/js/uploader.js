// ======================================
// Finance Tracker File Uploader
// ======================================

const uploadForm = document.getElementById("uploadForm");
const expenseFile = document.getElementById("expenseFile");
const uploadStatus = document.getElementById("uploadStatus");
const progressBar = document.getElementById("progressBar");

// ==============================
// Upload File
// ==============================

if (uploadForm) {

    uploadForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        if (expenseFile.files.length === 0) {

            alert("Please select a file.");

            return;

        }

        const file = expenseFile.files[0];

        const allowedExtensions = [
            "xlsx",
            "xls",
            "csv",
            "pdf"
        ];

        const extension =
            file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {

            alert("Only Excel, CSV and PDF files are allowed.");

            return;

        }

        progressBar.classList.remove("d-none");

        uploadStatus.classList.add("d-none");

        const formData = new FormData();

        formData.append("expenseFile", file);

        try {

            const response = await fetch("/upload", {

                method: "POST",

                body: formData

            });

            const result = await response.json();

            progressBar.classList.add("d-none");

            uploadStatus.classList.remove("d-none");

            if (result.success) {

                uploadStatus.className =
                    "alert alert-success";

                uploadStatus.innerHTML =

                    "<h5>✅ Upload Successful</h5>" +

                    "<p><strong>Imported:</strong> " +
                    result.imported + " expenses</p>" +

                    "<p><strong>Ignored:</strong> " +
                    result.skipped + "</p>" +

                    "<p><strong>Message:</strong> " +
                    result.message + "</p>";

            }

            else {

                uploadStatus.className =
                    "alert alert-danger";

                uploadStatus.innerHTML =

                    "<strong>Error:</strong> " +

                    result.message;

            }

        }

        catch (error) {

            progressBar.classList.add("d-none");

            uploadStatus.classList.remove("d-none");

            uploadStatus.className =
                "alert alert-danger";

            uploadStatus.innerHTML =

                "Upload failed. Please try again.";

            console.error(error);

        }

    });

}

// ==============================
// Show Selected File
// ==============================

if (expenseFile) {

    expenseFile.addEventListener("change", function () {

        if (expenseFile.files.length > 0) {

            console.log(

                "Selected File:",

                expenseFile.files[0].name

            );

        }

    });

}