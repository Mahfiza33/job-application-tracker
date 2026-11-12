const form = document.querySelector("form");
const applicationList = document.getElementById("application-list");
const searchInput = document.getElementById("search");

const applications =
  JSON.parse(localStorage.getItem("applications")) || [];

// Save applications in this browser.
function saveApplications() {
  localStorage.setItem("applications", JSON.stringify(applications));
}

// Display applications on the page.
function displayApplications() {
  applicationList.textContent = "";

  document.getElementById("application-count").textContent =
    `Total applications: ${applications.length}`;

  const searchText = searchInput.value.toLowerCase().trim();

  applications.forEach(function (job, index) {
    const selectedStatus = document.getElementById("status-filter").value;

if (selectedStatus && job.status !== selectedStatus) {
  return;
}
    const jobText = `${job.company} ${job.jobTitle}`.toLowerCase();

    if (!jobText.includes(searchText)) {
      return;
    }

    const item = document.createElement("li");

    const details = document.createElement("p");
    details.textContent =
      `${job.company} — ${job.jobTitle} — Applied: ${
        job.dateApplied || "Date not added"
      }`;

    // Create the status dropdown.
    const statusSelect = document.createElement("select");
    statusSelect.setAttribute(
      "aria-label",
      `Application status for ${job.jobTitle} at ${job.company}`
    );

    ["Applied", "Interview", "Offer", "Rejected"].forEach(function (status) {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      statusSelect.appendChild(option);
    });

    statusSelect.value = job.status;
statusSelect.className = job.status.toLowerCase();
    statusSelect.addEventListener("change", function () {
      job.status = statusSelect.value;
      statusSelect.className = job.status.toLowerCase();
      saveApplications();
      displayApplications();
    });

    // Create the Delete button.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
          const confirmed = confirm(
    `Delete your application for ${job.jobTitle} at ${job.company}?`
  );

  if (!confirmed) {
    return;
  }
      applications.splice(index, 1);
      saveApplications();
      displayApplications();
    });

    item.appendChild(details);
    item.appendChild(statusSelect);
    item.appendChild(deleteButton);
    applicationList.appendChild(item);
  });

  // Show a message when there are no matching applications.
  document.getElementById("empty-message").hidden =
    applicationList.children.length > 0;
}

// Add a new application.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const company = document.getElementById("company").value.trim();
  const jobTitle = document.getElementById("job-title").value.trim();
  const status = document.getElementById("status").value;
  const dateApplied = document.getElementById("application-date").value;

  if (!company || !jobTitle || !dateApplied) {
    return;
  }

  applications.push({ company, jobTitle, status, dateApplied });

  saveApplications();
  form.reset();
  setTodayDate();
  displayApplications();
});

// Update results as you type.
searchInput.addEventListener("input", function () {
  displayApplications();
});

// Display saved applications when the page opens.
displayApplications();
function setTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  document.getElementById("application-date").value =
    `${year}-${month}-${day}`;
}

setTodayDate();
document.getElementById("status-filter").addEventListener("change", function () {
  displayApplications();
});