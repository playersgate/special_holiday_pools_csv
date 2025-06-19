import getCsv from "./getCsv.js";

// モーダル関連の要素を取得
const confirmModal = document.getElementById('confirmModal');
const closeModalButton = document.getElementById('closeModalButton');
const cancelModalButton = document.getElementById('cancelModalButton');
const modalBackground = document.querySelector('.modal-background');
const okButton = document.getElementById('okButton');

// 確認表示用のspan要素
const confirmEmployee = document.getElementById('confirmEmployee');
const confirmDate = document.getElementById('confirmDate');
const confirmExpire = document.getElementById('confirmExpire');
const confirmDays = document.getElementById('confirmDays');

// モーダルを開く関数
function openModal(employee, date, expire, days) {
    // モーダルの内容をクリア
    confirmEmployee.textContent = '';
    confirmDate.textContent = '';
    confirmExpire.textContent = '';
    confirmDays.textContent = '';

    // モーダルに値をセット
    confirmEmployee.textContent = employee;
    confirmDate.textContent = date;
    confirmExpire.textContent = expire;
    confirmDays.textContent = days;

    // モーダルを表示
    confirmModal.classList.add('is-active');
}

// モーダルを閉じる関数
function closeModal() {
    confirmModal.classList.remove('is-active');
}

// イベントリスナーの設定
closeModalButton.addEventListener('click', closeModal); // モーダル右上のXボタンで閉じる
cancelModalButton.addEventListener('click', closeModal); // モーダルのキャンセルボタンで閉じる
modalBackground.addEventListener('click', closeModal); // モーダルの背景クリックで閉じる

// OKボタンの処理
okButton.addEventListener('click', function() {
    getCsv(
        confirmEmployee.textContent,
        confirmDays.textContent,
        confirmDate.textContent,
        confirmExpire.textContent
    ); // CSVを生成
    closeModal(); // モーダルを閉じる
});

export default openModal; // モーダル操作関数をエクスポート