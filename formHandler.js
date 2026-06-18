const TENANT_ID = "e9e12381-c93c-4a27-8c9b-fbcf50a8842a";
const API_URL = `https://api.leafyops.com/api/v1/tenant/contact-us/${TENANT_ID}`;

// Toast notification function
function showToast(message, type = 'success', title = '') {
  const toastContainer = document.getElementById('toastContainer');
  
  if (!toastContainer) {
    return;
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✓' : '✕';
  const toastTitle = title || (type === 'success' ? 'Success!' : 'Error!');
  
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${toastTitle}</div>
      <p class="toast-message">${message}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Validation functions
function validateName(name) {
  // Only letters and spaces allowed, no numbers
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(name) && name.length >= 2;
}

function validateEmail(email) {
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

function showFieldError(fieldId, errorId, message) {
  $(`#${fieldId}`).addClass('form-error');
  $(`#${errorId}`).text(message).addClass('show');
}

function clearFieldError(fieldId, errorId) {
  $(`#${fieldId}`).removeClass('form-error');
  $(`#${errorId}`).removeClass('show');
}

async function submitContactForm(formData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber || "",
        message: formData.message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}

$(document).ready(function () {
  // Real-time error clearing when user starts typing
  $('#firstName').on('input', function() {
    if ($(this).val().trim()) {
      clearFieldError('firstName', 'firstNameError');
    }
  });

  $('#lastName').on('input', function() {
    if ($(this).val().trim()) {
      clearFieldError('lastName', 'lastNameError');
    }
  });

  $('#email').on('input', function() {
    if ($(this).val().trim()) {
      clearFieldError('email', 'emailError');
    }
  });

  $('#phone').on('input', function() {
    if ($(this).val().trim()) {
      clearFieldError('phone', 'phoneError');
    }
  });

  $('#message').on('input', function() {
    if ($(this).val().trim()) {
      clearFieldError('message', 'messageError');
    }
  });

  $("#myForm").on("submit", function (event) {
    event.preventDefault();

    // Clear all previous errors
    $('.form-error').removeClass('form-error');
    $('.error-message').removeClass('show');

    // Get form values
    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();
    const message = $("#message").val().trim();

    let isValid = true;

    // Validate first name
    if (!firstName) {
      showFieldError('firstName', 'firstNameError', 'First name is required');
      isValid = false;
    } else if (!validateName(firstName)) {
      showFieldError('firstName', 'firstNameError', 'Please enter a valid first name (letters only)');
      isValid = false;
    }

    // Validate last name
    if (!lastName) {
      showFieldError('lastName', 'lastNameError', 'Last name is required');
      isValid = false;
    } else if (!validateName(lastName)) {
      showFieldError('lastName', 'lastNameError', 'Please enter a valid last name (letters only)');
      isValid = false;
    }

    // Validate email
    if (!email) {
      showFieldError('email', 'emailError', 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showFieldError('email', 'emailError', 'Please enter a valid email address');
      isValid = false;
    }

    // Validate phone
    if (!phone) {
      showFieldError('phone', 'phoneError', 'Phone number is required');
      isValid = false;
    } else if (!validatePhone(phone)) {
      showFieldError('phone', 'phoneError', 'Please enter a valid 10-digit phone number');
      isValid = false;
    }

    // Validate message
    if (!message) {
      showFieldError('message', 'messageError', 'Message is required');
      isValid = false;
    }
    
    if (!isValid) {
      showToast('Please fill in all required fields correctly', 'error', 'Validation Error');
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const formData = {
      name: fullName,
      email: email,
      phoneNumber: phone,
      message: message,
    };

    // Show loading state
    const $button = $(this).find('button[type="submit"]');
    const originalText = $button.text();
    $button.prop("disabled", true).text("Submitting...");

    submitContactForm(formData)
      .then(function (response) {
        showToast(
          "Your message has been submitted successfully. We will get back to you soon.",
          'success',
          'Thank You!'
        );
        console.log("Success:", response);
        $("#myForm")[0].reset();
        // Clear all errors after successful submission
        $('.form-error').removeClass('form-error');
        $('.error-message').removeClass('show');
      })
      .catch(function (error) {
        showToast(
          "Error submitting form. Please try again later.",
          'error',
          'Submission Failed'
        );
        console.error("Error:", error);
      })
      .finally(function () {
        $button.prop("disabled", false).text(originalText);
      });
  });
});
