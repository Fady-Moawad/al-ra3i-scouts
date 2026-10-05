
let currentUser = null;


$(document).ready(function () {


    // =========================
    // CHECK LOGIN TOKEN
    // =========================

    const token = localStorage.getItem("token");


    if (!token) {

        window.location.href = "login.html";

        return;

    }
    const params = new URLSearchParams(window.location.search);

    const userId = params.get("id");
    if (!userId) {
        alert("User ID not found");
        return;
    }
    getUserById(userId);


});



/* =========================
        GET USER
========================= */

function getUserById(id) {

    $.ajax({
        url: `http://localhost:4004/api/user/${id}`,
        method: "GET",
        success: function (response) {
            currentUser = response.data;
            if (currentUser.profileCompleted === true) {

                showUserProfile(currentUser);

            } else {

                window.location.href = `../Pages/completeData.html?id=${id}`;

            }

        },


        error: function (xhr) {

            console.error("Failed to get user");

            console.error(xhr);

            alert("فشل في جلب بيانات المستخدم");

        }

    });

}



/* =========================
        USER PROFILE
========================= */

function showUserProfile(user) {


   $("#userAvatar")
        .attr("src", user.avatar || "../assets/images/user.jpg")
        .attr("alt", user.name);

    $("#userName").text(user.name);

    $("#userPhase").html(`
        <i class="bi bi-mortarboard"></i>
        ${user.phase}
    `);

    $("#attendanceBtn").on("click", function () {

        recordAttendance(user);

    });

}


function recordAttendance(user) {
    const button = $("#attendanceBtn");

    if (button.prop("disabled")) return

    button.prop("disabled", true);

    button.html(`

        <span
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
        ></span>

        جاري تسجيل الحضور...

    `);
    $.ajax({

        url: `http://localhost:4004/api/user/attendance/${user._id}`,

        method: "GET",
        headers: {
            authorization: `${localStorage.getItem("token")}`
        },

        success: function (response) {

            console.log("Attendance response:");

            console.log(response);
            button
                .removeClass("attendance-btn-main")
                .addClass("btn-success");
            button.html(`

                <i class="bi bi-check-circle-fill me-2"></i>

                تم تسجيل الحضور

            `);

            button.prop("disabled", true);
            alert(' تم تسجيل الحضور')
           window.location.href = `../index.html`;

        },

        error: function (xhr) {
            let message = "حدث خطأ أثناء تسجيل الحضور";
            if (
                xhr.responseJSON &&
                xhr.responseJSON.message
            ) {

                message = xhr.responseJSON.message;
            }

            alert(message);
window.location.href = `../index.html`;
            button.prop("disabled", false);
            button
                .removeClass("btn-success")
                .addClass("attendance-btn-main");
            button.html(`

                <i class="bi bi-check-circle me-2"></i>

                تسجيل الحضور

            `);

        }

    });

}



/* =========================
        PROFILE FORM
========================= */

function showProfileForm(user) {

    $("#profileForm").on("submit", function (e) {

        e.preventDefault();



        const name = $("#name").val().trim();

        const stage = $("#stage").val();



        // =========================
        // VALIDATION
        // =========================

        if (!name || !stage) {

            return;

        }
        currentUser.name = name;

        currentUser.stage = stage;

        currentUser.profileCompleted = true;

        showUserProfile(currentUser);

    });

}

