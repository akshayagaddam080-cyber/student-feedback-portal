const form = document.getElementById("feedbackForm");
const message = document.getElementById("message");
const feedbackList = document.getElementById("feedbackList");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const studentName =
        document.getElementById("studentName").value;

    const studentId =
        document.getElementById("studentId").value;

    const course =
        document.getElementById("course").value;

    const rating =
        document.getElementById("rating").value;

    const feedback =
        document.getElementById("feedback").value;

    const card = document.createElement("div");

    card.className = "feedback-card";

    card.innerHTML = `
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>Student ID:</strong> ${studentId}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Rating:</strong> ${rating}/5</p>
        <p><strong>Feedback:</strong> ${feedback}</p>
    `;

    feedbackList.appendChild(card);

    message.textContent = "Feedback submitted successfully!";

    form.reset();

});