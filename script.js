import checkFormValues from "./checkFormValues.js";
import createCsvButtonControl from "./createCsvButtonControl.js";
import openErrorModal from "./error.js";
import getEmployee from "./getEmployee.js";
import openModal  from "./modal.js";

// HTMLの読み込みが完了したら実行 
document.addEventListener("DOMContentLoaded", async () => {
  // 従業員名の読み込み
  await getEmployee();
});

// CSVを作成するボタンをクリックした時の処理
document.getElementById("csvForm").addEventListener("submit", (e) => {
  // フォームの送信を防止
  e.preventDefault();

  // 作成ボタンを非活性にしテキストを変更する
  createCsvButtonControl("CSVを作成中...", true);

  // フォームの値を取得
  const days = e.target.elements["days"].value;
  const date = e.target.elements["date"].value;
  const expire = e.target.elements["expire"].value;
  const employee = e.target.elements["employee"].value;

  // 入力値のチェック
  const { isValid, message } = checkFormValues(days, date, expire, employee);
  if (!isValid) {
    openErrorModal(message);
    return;
  }

  // フォームの値を渡してモーダルを開く
  openModal(employee, date, expire, days);

});