export const resourceConfig = {
  events: {
    title: "Events",
    endpoint: "events",
    hasImage: true,
    columns: [
      ["title", "Title"],
      ["category", "Category"],
      ["venue", "Venue"],
      ["date", "Date"]
    ],
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "category", label: "Category", type: "select", options: ["Workshop", "Seminar", "Hackathon", "Guest Lecture", "Conference", "Other"] },
      { name: "venue", label: "Venue", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "organizer", label: "Organizer" },
      { name: "image", label: "Image", type: "file" }
    ]
  },
  achievements: {
    title: "Achievements",
    endpoint: "achievements",
    hasImage: true,
    columns: [
      ["title", "Title"],
      ["achieverName", "Name"],
      ["achieverType", "Type"],
      ["awardDate", "Award Date"]
    ],
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "achieverName", label: "Achiever Name", required: true },
      { name: "achieverType", label: "Achiever Type", type: "select", options: ["Student", "Faculty"], required: true },
      { name: "awardDate", label: "Award Date", type: "date", required: true },
      { name: "category", label: "Category" },
      { name: "image", label: "Image", type: "file" }
    ]
  },
  internships: {
    title: "Internships",
    endpoint: "internships",
    hasFiles: true,
    documentFields: [
      { name: "offerLetter", label: "Offer Letter" },
      { name: "completionCertificate", label: "Completion Certificate" },
      { name: "verificationProof", label: "Verification Proof" },
      { name: "companyLogo", label: "Company Logo" },
      { name: "studentPhoto", label: "Student Photo" }
    ],
    columns: [
      ["studentName", "Student"],
      ["verificationStatus", "Status"],
      ["company", "Company"],
      ["role", "Role"],
      ["academicYear", "Year"]
    ],
    fields: [
      { name: "studentName", label: "Student Name", required: true },
      { name: "rollNumber", label: "Roll Number" },
      { name: "department", label: "Department" },
      { name: "company", label: "Company", required: true },
      { name: "role", label: "Role", required: true },
      { name: "mode", label: "Mode", type: "select", options: ["Remote", "On-site", "Hybrid"] },
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "stipend", label: "Stipend", type: "number" },
      { name: "academicYear", label: "Academic Year", required: true },
      { name: "verificationStatus", label: "Verification Status", type: "select", options: ["Pending", "Verified", "Rejected"] },
      { name: "technologiesUsed", label: "Technologies Used", placeholder: "Python, React, TensorFlow" },
      { name: "description", label: "Description", type: "textarea" }
    ]
  },
  placements: {
    title: "Placements",
    endpoint: "placements",
    hasFiles: true,
    documentFields: [
      { name: "offerLetter", label: "Placement Offer Letter" },
      { name: "appointmentLetter", label: "Appointment Letter" },
      { name: "verificationProof", label: "Verification Proof" },
      { name: "companyLogo", label: "Company Logo" },
      { name: "studentPhoto", label: "Student Photo" }
    ],
    columns: [
      ["studentName", "Student"],
      ["verificationStatus", "Status"],
      ["company", "Company"],
      ["packageLpa", "Package"],
      ["academicYear", "Year"]
    ],
    fields: [
      { name: "studentName", label: "Student Name", required: true },
      { name: "company", label: "Company", required: true },
      { name: "role", label: "Role", required: true },
      { name: "packageLpa", label: "Package LPA", type: "number", required: true },
      { name: "academicYear", label: "Academic Year", required: true },
      { name: "offerType", label: "Placement Type", type: "select", options: ["Internship", "Full-time", "Internship + Full-time"] },
      { name: "location", label: "Location" },
      { name: "placedDate", label: "Placed Date", type: "date", required: true },
      { name: "joiningDate", label: "Joining Date", type: "date" },
      { name: "recruiterName", label: "Recruiter Name" },
      { name: "companyWebsite", label: "Company Website" },
      { name: "verificationStatus", label: "Verification Status", type: "select", options: ["Pending", "Verified", "Rejected"] }
    ]
  }
};
