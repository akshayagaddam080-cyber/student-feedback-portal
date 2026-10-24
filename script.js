
// Get saved feedback from the browser
function getFeedback() {
    try {
        return JSON.parse(localStorage.getItem("smartCampusFeedback")) || [];
    } catch (error) {
        return [];
    }
}

// Save feedback in the browser
function saveFeedback(feedback) {
    localStorage.setItem("smartCampusFeedback", JSON.stringify(feedback));
}

// Calculate average rating
function calculateAverage(feedback) {
    if (feedback.length === 0) return "0.0";

    const total = feedback.reduce(
        (sum, item) => sum + Number(item.rating), 0
    );

    return (total / feedback.length).toFixed(1);
}

// Safely create text elements
function addText(parent, tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    parent.appendChild(element);
    return element;
}

// Submit feedback form
function setupFeedbackForm() {
    const form = document.getElementById("feedbackForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const studentName = document.getElementById("studentName").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const course = document.getElementById("course").value.trim();
        const category = document.getElementById("category").value;
        const rating = Number(document.getElementById("rating").value);
        const feedbackText = document.getElementById("feedback").value.trim();

        if (
            !studentName ||
            !studentId ||
            !course ||
            !category ||
            !feedbackText ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            alert("Please complete all fields and select a rating.");
            return;
        }

        const feedback = getFeedback();

        feedback.push({
            studentName: studentName,
            studentId: studentId,
            course: course,
            category: category,
            rating: rating,
            feedback: feedbackText,
            submittedAt: new Date().toISOString()
        });

        try {
            saveFeedback(feedback);
            window.location.href = "thank-you.html";
        } catch (error) {
            alert("Unable to save feedback in this browser. Please try again.");
        }
    });
}

// Display feedback cards and apply search and filters
function renderFeedback() {
    const feedbackList = document.getElementById("feedbackList");

    if (!feedbackList) return;

    const allFeedback = getFeedback();
    const searchInput = document.getElementById("searchFeedback");
    const categoryFilter = document.getElementById("filterCategory");
    const ratingFilter = document.getElementById("filterRating");
    const countElement = document.getElementById("feedbackCount");

    function displayResults() {
        const searchText = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedCategory = categoryFilter
            ? categoryFilter.value
            : "";

        const selectedRating = ratingFilter
            ? ratingFilter.value
            : "";

        const filtered = allFeedback.filter(function (item) {
            const searchableText = [
                item.studentName,
                item.course,
                item.feedback,
                item.category
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(searchText);
            const matchesCategory =
                !selectedCategory || item.category === selectedCategory;
            const matchesRating =
                !selectedRating || String(item.rating) === selectedRating;

            return matchesSearch && matchesCategory && matchesRating;
        });

        feedbackList.replaceChildren();

        if (countElement) {
            countElement.textContent =
                "Showing " + filtered.length +
                " of " + allFeedback.length + " submissions";
        }

        if (filtered.length === 0) {
            addText(
                feedbackList,
                "p",
                allFeedback.length === 0
                    ? "No feedback submitted yet."
                    : "No feedback matches your search or filters."
            );
            return;
        }

        filtered.slice().reverse().forEach(function (item) {
            const card = document.createElement("div");
            card.className = "feedback-card";

            addText(card, "h3", item.studentName);
            addText(card, "p", "Student ID: " + item.studentId);
            addText(card, "p", "Course: " + item.course);
            addText(card, "p", "Category: " + item.category);
            addText(
                card,
                "p",
                "Rating: " + "★".repeat(Number(item.rating)) +
                " (" + item.rating + "/5)"
            );
            addText(card, "p", "Feedback: " + item.feedback);

            if (item.submittedAt) {
                addText(
                    card,
                    "small",
                    "Submitted: " +
                    new Date(item.submittedAt).toLocaleDateString()
                );
            }

            feedbackList.appendChild(card);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", displayResults);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", displayResults);
    }

    if (ratingFilter) {
        ratingFilter.addEventListener("change", displayResults);
    }

    displayResults();
}

// Display statistics on the home page
function renderHomeStats() {
    const totalElement = document.getElementById("homeTotalFeedback");
    const averageElement = document.getElementById("homeAverageRating");

    if (!totalElement && !averageElement) return;

    const feedback = getFeedback();

    if (totalElement) {
        totalElement.textContent = "Total Feedback: " + feedback.length;
    }

    if (averageElement) {
        averageElement.textContent = calculateAverage(feedback) + " / 5";
    }
}

// Create a labeled progress bar
function createProgressBar(parent, label, value, maximum, detail) {
    const row = document.createElement("div");
    row.className = "stat-row";

    const labelRow = document.createElement("div");
    labelRow.className = "stat-label";

    addText(labelRow, "span", label);
    addText(labelRow, "span", detail);

    const track = document.createElement("div");
    track.className = "progress-track";

    const fill = document.createElement("div");
    fill.className = "progress-fill";

    const percentage = maximum > 0
        ? Math.max(0, Math.min(100, (value / maximum) * 100))
        : 0;

    fill.style.width = percentage + "%";

    track.appendChild(fill);
    row.appendChild(labelRow);
    row.appendChild(track);
    parent.appendChild(row);
}

// Display analytics dashboard
function renderCategoryStats() {
    const totalElement = document.getElementById("totalFeedback");
    const averageElement = document.getElementById("averageRating");
    const positiveElement = document.getElementById("positiveFeedback");
    const categoryElement = document.getElementById("categoryStats");
    const distributionElement = document.getElementById("ratingDistribution");

    if (
        !totalElement &&
        !averageElement &&
        !positiveElement &&
        !categoryElement &&
        !distributionElement
    ) {
        return;
    }

    const feedback = getFeedback();
    const total = feedback.length;

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (averageElement) {
        averageElement.textContent = calculateAverage(feedback) + " / 5";
    }

    const positiveCount = feedback.filter(
        item => Number(item.rating) >= 4
    ).length;

    const positivePercentage = total > 0
        ? Math.round((positiveCount / total) * 100)
        : 0;

    if (positiveElement) {
        positiveElement.textContent = positivePercentage + "%";
    }

    // Category-wise response counts and average ratings
    if (categoryElement) {
        categoryElement.replaceChildren();

        if (total === 0) {
            addText(categoryElement, "p", "No feedback data available yet.");
        } else {
            const categories = {};

            feedback.forEach(function (item) {
                const category = item.category || "Other";

                if (!categories[category]) {
                    categories[category] = {
                        count: 0,
                        ratingTotal: 0
                    };
                }

                categories[category].count++;
                categories[category].ratingTotal += Number(item.rating);
            });

            Object.entries(categories).forEach(function ([category, stats]) {
                const average = stats.ratingTotal / stats.count;
                const row = document.createElement("div");
                row.className = "feedback-card";

                addText(row, "h3", category);
                addText(
                    row,
                    "p",
                    stats.count + " response(s) · Average rating: " +
                    average.toFixed(1) + " / 5"
                );

                createProgressBar(
                    row,
                    "Responses",
                    stats.count,
                    total,
                    Math.round((stats.count / total) * 100) + "%"
                );

                categoryElement.appendChild(row);
            });
        }
    }

    // Rating distribution from 1 to 5 stars
    if (distributionElement) {
        distributionElement.replaceChildren();

        if (total === 0) {
            addText(distributionElement, "p", "No feedback data available yet.");
        } else {
            for (let rating = 5; rating >= 1; rating--) {
                const count = feedback.filter(
                    item => Number(item.rating) === rating
                ).length;

                createProgressBar(
                    distributionElement,
                    rating + (rating === 1 ? " Star" : " Stars"),
                    count,
                    total,
                    count + " response(s)"
                );
            }
        }
    }
}

// Run the required functions when a page loads
document.addEventListener("DOMContentLoaded", function () {
    setupFeedbackForm();
    renderFeedback();
    renderHomeStats();
    renderCategoryStats();
});

