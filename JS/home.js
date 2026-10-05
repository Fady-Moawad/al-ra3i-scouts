console.log("main.js loaded");

$(document).ready(function () {

    const token = localStorage.getItem("token");
    const loginButton = $("#loginButton");

    console.log("Token:", token);
    console.log("Button:", loginButton.length);

    if (token) {

        loginButton.attr("href", "../Pages/dashboard.html");
console.log('y');

        loginButton.html(`
            <i class="bi bi-speedometer2 me-2"></i>
            لوحة التحكم
        `);

    } else {

        loginButton.attr("href", "../Pages/login.html");
console.log('n');

        loginButton.html(`
            تسجيل الدخول
        `);

    }

});