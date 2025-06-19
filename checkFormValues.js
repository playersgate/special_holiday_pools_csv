/**
 * フォームの入力値をチェックする関数
 * @param {number} days - 日数 (input type="number")
 * @param {string} date - 開始日 (input type="date" の値, YYYY-MM-DD形式)
 * @param {string} expire - 終了日 (input type="date" の値, YYYY-MM-DD形式)
 * @param {string} employee - 従業員 (select の値)
 * @returns {{isValid: boolean, message: string}} - チェック結果とメッセージ
 */
function checkFormValues(days, date, expire, employee) {
    let message = '';

    // 1. 各値が空白でないか、および days が 0 でないかチェック
    // daysは数値なので、0の場合もfalseとして扱われる「!days」は適していません。
    // そのため、daysがnull, undefined, 空文字列、または0であるかを明示的にチェックします。
    if (days === null || days === undefined || String(days).trim() === '' || Number(days) <= 0 ||
        !date || String(date).trim() === '' ||
        !expire || String(expire).trim() === '' ||
        !employee || String(employee).trim() === '') {
        // daysが0または負の数の場合もここでエラーメッセージを返します。
        // 特定のエラーメッセージを分けたい場合は、別途条件を追加します。
        message = 'すべての項目を入力し、日数は1以上の値を指定してください。';
        return { isValid: false, message: message };
    }

    // 日付オブジェクトに変換（比較のために）
    const startDate = new Date(date + 'T00:00:00'); // UTCの0時として解釈させる
    const expireDate = new Date(expire + 'T00:00:00'); // UTCの0時として解釈させる

    // 日付の妥当性チェック
    if (isNaN(startDate.getTime()) || isNaN(expireDate.getTime())) {
        message = '日付の形式が正しくありません。';
        return { isValid: false, message: message };
    }

    // 2. expire が date より前の日付になっていないかチェック
    if (expireDate.getTime() < startDate.getTime()) {
        message = '期限は付与日より前の日付に設定できません。';
        return { isValid: false, message: message };
    }

    // 3. days が expire と date の期間に収まっているかチェック
    const oneDay = 1000 * 60 * 60 * 24; // 1日のミリ秒数
    const diffTime = expireDate.getTime() - startDate.getTime();
    const actualDaysDuration = (diffTime / oneDay) + 1; // 開始日と終了日を含む日数

    // daysが整数値であることを確認
    if (!Number.isInteger(Number(days))) {
         message = '日数は整数で入力してください。';
         return { isValid: false, message: message };
    }

    if (Number(days) > actualDaysDuration) {
        message = `日数は、選択された期間を超えることはできません。
        ${date}〜${expire}の場合、最大で ${actualDaysDuration} 日まで指定できます。`;
        return { isValid: false, message: message };
    }

    // すべてのチェックを通過した場合
    return { isValid: true, message: '入力は有効です。' };
}

export default checkFormValues; // 関数をエクスポート