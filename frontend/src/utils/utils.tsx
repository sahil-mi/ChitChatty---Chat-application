import { Navigate } from "react-router-dom";

export const media_base_url = "http://localhost:8000";

export const handleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
};

export const handleLoginError = (error, setOpenSnack, setSnackData) => {
  // console.error("Login error:", error.response?.data || error.message);

  const errors = error.response?.data;
  let errorMessage = "An error occurred.";

  // Check if errors exist and format the message
  if (errors) {
    // If it's a string (like the "detail" field), handle it directly
    if (typeof errors === "string") {
      errorMessage = errors; // Just use the string
    } else if (Array.isArray(errors)) {
      // If the errors are in array format
      errorMessage = errors.join(", ");
    } else {
      // Handle the case where errors are an object
      errorMessage = Object.entries(errors)
        .map(([key, messages]) => {
          // Ensure messages is an array before joining
          if (Array.isArray(messages)) {
            return `${key}: ${messages.join(", ")}`;
          } else {
            return `${key}: ${messages}`; // Just use the value if it's not an array
          }
        })
        .join("\n"); // Join with line breaks for better readability
    }
  } else {
    errorMessage = error.message; // Fallback to a generic error message
  }

  setOpenSnack(true);
  setSnackData({
    type: "error",
    message: errorMessage,
  });
};

const ProtectedRoute = ({ children }) => {
  const access_token = localStorage.getItem("access_token");

  if (!access_token) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/sign-in/" />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;
