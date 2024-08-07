const express = require("express");
const XLSX = require("xlsx");
const NodeCache = require("node-cache");
const path = require("path");
const app = express();
const port = 3000;

// إعداد التخزين المؤقت
const cache = new NodeCache({ stdTTL: 600 }); // الكاش يحتفظ بالبيانات لمدة 10 دقائق

// تحديد مسار ملف الإكسل
const filePath = path.join(__dirname, "نتيجة الثانوية 24 (1).xlsx");

// قراءة ملف الإكسل وتحويله إلى JSON
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);
// console.log(data.map((e) => e["رقم الجلوس"]));

// console.log(data);
// إعداد خادم Express

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(express.json());

app.get("/result/:examNumber", (req, res) => {
  const examNumber = req.params.examNumber;
  console.log(`Received request for exam number: ${examNumber}`);

  // البحث في البيانات باستخدام الاسم الصحيح للعمود
  const student = data.find((item) => item["رقم الجلوس"] == examNumber);

  if (student) {
    console.log("Student found:", student);
    // cache.set(examNumber, student);
    cache.del(examNumber);
    res.json({
      name: student["الاسم"],
      grade: student["الدرجة"],
      case: student["student_case"],
      caseDesc: student["student_case_desc"],
      flag: student["c_flage"],
    });
  } else {
    console.log("Student not found");
    res.json({ message: "رقم الجلوس غير صحيح" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
