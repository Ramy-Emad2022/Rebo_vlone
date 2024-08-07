document
  .getElementById("resultForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const examNumber = document.getElementById("examNumber").value.trim();

    fetch(`http://localhost:3000/result/${examNumber}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          document.getElementById("result").innerText = data.message;
        } else {
          document.getElementById("result").innerText = `
            الاسم: ${data.name}
            الدرجة: ${data.grade}
            الحالة: ${data.case}
            وصف الحالة: ${data.caseDesc}
            علم: ${data.flag}
          `;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("result").innerText =
          "حدث خطأ أثناء تحميل البيانات.";
      });
  });
