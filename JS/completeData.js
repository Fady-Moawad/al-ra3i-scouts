$(document).ready(function () {

    // Get user ID from URL
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    // Get token from localStorage
    const token = localStorage.getItem("token");

    console.log("User ID:", userId);
    console.log("Token:", token);

    // Check ID
    if (!userId) {
        alert("User ID not found");
        return;
    }

    // Check token
    if (!token) {
        alert("يجب تسجيل الدخول أولًا");
        window.location.href = "login.html";
        return;
    }

    showProfileForm(userId, token);
});


function showProfileForm(userId, token) {

    $("#profileForm").on("submit", function (e) {

        e.preventDefault();

        const name = $("#name").val().trim();
        const stage = $("#stage").val();

        if (!name || !stage) {
            return;
        }

        const button = $(this).find("button[type='submit']");

        // Disable button
        button.prop("disabled", true);

        button.html(`
            <span class="spinner-border spinner-border-sm me-2"></span>
            جاري حفظ البيانات...
        `);


        $.ajax({

            url: `http://localhost:4004/api/user/completedata/${userId}`,

            method: "patch",

            headers: {
                Authorization: `${token}`
            },

            contentType: "application/json",

            data: JSON.stringify({
                name: name,
                phase: stage
            }),

            success: function (response) {

                console.log("Profile updated successfully");
                console.log(response);

                alert("تم حفظ البيانات بنجاح");

                // ممكن بعد كده تروح لصفحة المستخدم
                window.location.href = `../Pages/attendance.html?id=${userId}`;

            },

            error: function (xhr) {

                console.error("Update profile error:");
                console.error(xhr);

                const message =
                    xhr.responseJSON?.message ||
                    "حدث خطأ أثناء حفظ البيانات";

                alert(message);

                button.prop("disabled", false);

                button.html(`
                    <i class="bi bi-check-lg me-2"></i>
                    حفظ البيانات
                `);
            }

        });

    });

}