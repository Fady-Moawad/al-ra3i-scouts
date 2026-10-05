
let isLoggingIn = false;


$(document).ready(function () {

    $("#loginForm").on("submit", function (e) {

        e.preventDefault();


        if (isLoggingIn) {

            return;

        }

        const email = $("#email").val().trim();

        const password = $("#password").val();


        if (!email || !password) {

            alert("من فضلك أدخل البريد الإلكتروني وكلمة المرور");

            return;

        }

        login(email, password);

    });
    $("#togglePassword").on("click", function () {

        const passwordInput = $("#password");

        const icon = $(this).find("i");


        if (passwordInput.attr("type") === "password") {

            passwordInput.attr("type", "text");

            icon
                .removeClass("fa-eye")
                .addClass("fa-eye-slash");

        } else {

            passwordInput.attr("type", "password");

            icon
                .removeClass("fa-eye-slash")
                .addClass("fa-eye");

        }

    });

});



function login(email, password) {

    isLoggingIn = true;


    const button = $("#loginForm button[type='submit']");


    // =========================
    // DISABLE BUTTON
    // =========================

    button.prop("disabled", true);


    // =========================
    // LOADING UI
    // =========================

    button.html(`

        <span
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
        ></span>

        جاري تسجيل الدخول...

    `);

    $.ajax({
        url: "http://localhost:4004/api/user/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: function (response) {
            const token = response.data
            localStorage.setItem("token", token);
            window.location.href = "../index.html";

        },


        // =========================
        // ERROR
        // =========================

        error: function (xhr) {

            console.error("Login error:");

            console.error(xhr);


            let message = "حدث خطأ أثناء تسجيل الدخول";


            // =========================
            // BACKEND MESSAGE
            // =========================

            if (
                xhr.responseJSON &&
                xhr.responseJSON.message
            ) {

                message = xhr.responseJSON.message;

            }


            alert(message);


            resetLoginButton();

        }

    });

}



function resetLoginButton() {

    isLoggingIn = false;


    const button = $("#loginForm button[type='submit']");


    button.prop("disabled", false);


    button.html(`

        تسجيل الدخول

    `);

}

