import createCsvButtonControl from "./createCsvButtonControl.js";
import openErrorModal from "./error.js";

const getCsv = async (employee, days, date, expire) => {    
  try {
    const response = await fetch("https://special-holiday-pools-csv-1.onrender.com/api/create-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee, days, date, expire })
    });
    if (!response.ok) throw new Error("サーバーエラー");

    const blob = await response.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    
    const disposition = response.headers.get('Content-Disposition');
    let filename =`特別休暇_${date.replaceAll("-", "")}_${employee}.csv`;

    if (disposition && disposition.includes('filename=')) {
      filename = decodeURIComponent(disposition.split("''")[1]);
    }
    a.download = filename;
    a.click();
    createCsvButtonControl("CSVを作成する", false); // ボタンを初期状態に戻す
  } catch (err) {
    openErrorModal("通信エラーが発生しました。");
  }
}

export default getCsv;