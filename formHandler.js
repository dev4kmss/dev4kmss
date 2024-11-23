$(document).ready(function () {
    $('#myForm').on('submit', function (event) {
        event.preventDefault(); 
        const formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            company: $('#company').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            message: $('#message').val()
        };
        $.ajax({
            url: 'https://apikrishnamurthyedtech.com/api/v1/ed-tech/user-enquiry', 
            method: 'POST',
            contentType: 'application/json',    
            data: JSON.stringify(formData),
            success: function (response) {
                alert('Form submitted successfully!');
                console.log(response);
            },
            error: function (xhr, status, error) {
                alert('Error submitting form!');
                console.log(error);
            }
        });
    });
});
