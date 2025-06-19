const handleEmployeeChange = (event) => {
  // イベントのターゲットから選択された要素を取得
  const employeeSelect = event.target;
  
  // 「選択してください」のオプションを取得
  const placeholderOption = employeeSelect.querySelector('option[value=""]');

  if (employeeSelect.value !== "") {
    // 「選択してください」以外が選択されたら、「選択してください」を無効化
    placeholderOption.disabled = true;
  } else {
    // なんらかの理由で「選択してください」がに戻った場合、有効化
    // おそらくこのブロックはそこまで必要ないが、念のため
    placeholderOption.disabled = false;
  }
};