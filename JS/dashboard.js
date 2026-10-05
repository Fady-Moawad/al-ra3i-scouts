$(document).ready(function () {

    // =========================
    // CHECK LOGIN
    // =========================

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "../Pages/login.html";

        return;

    }


    // =========================
    // LOAD DASHBOARD
    // =========================

    loadDashboard();


    // =========================
    // TEAM SELECT
    // =========================

    $("#teamSelect").on("change", function () {

        const teamId = $(this).val();

        loadDashboard(teamId);

    });

});



/* =========================
        LOAD DASHBOARD
========================= */

function loadDashboard(teamId = "all") {

    const token = localStorage.getItem("token");


    // =========================
    // BUILD URL
    // =========================

let url = "http://test-api.bonto.run/api/user/dashboard";

    if (teamId !== "all") {

        url += `?teamId=${teamId}`;

    }


    // =========================
    // API REQUEST
    // =========================

    $.ajax({

        url: url,

        method: "GET",

        headers: {

            authorization: token

        },


        success: function (response) {

            console.log("Dashboard response:");
            console.log(response);


            const data = response.data;


            // =========================
            // UPDATE CARDS
            // =========================

            $("#totalUsers")
                .text(data.totalUsers);


            $("#totalTeam")
                .text(data.totalGroup);


            $("#todayAttendance")
                .text(data.todayAttendance);


            $("#todayAbsent")
                .text(data.Absence);


            $("#attendancePercentage")
                .text(`${data.attendancePercentage}%`);


            // =========================
            // UPDATE CHART
            // =========================

            updateAttendanceChart(
                data.todayAttendance,
                data.Absence
            );

        },


        error: function (xhr) {

            console.error("Dashboard error:");
            console.error(xhr);


            if (xhr.status === 401) {

                localStorage.removeItem("token");

                window.location.href = "login.html";

                return;

            }


            alert("فشل في تحميل بيانات لوحة التحكم");

        }

    });

}



/* =========================
        CHART
========================= */

let attendanceChart = null;



function updateAttendanceChart(attendance, absence) {

    const ctx = document.getElementById("attendanceChart");


    // =========================
    // DESTROY OLD CHART
    // =========================

    if (attendanceChart) {

        attendanceChart.destroy();

    }


    // =========================
    // CREATE CHART
    // =========================

    attendanceChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "الحضور",
                "الغياب"
            ],

            datasets: [

                {

                    data: [
                        attendance,
                        absence
                    ],

                    borderWidth: 0

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: true,

                    position: "bottom"

                }

            }

        }

    });

}