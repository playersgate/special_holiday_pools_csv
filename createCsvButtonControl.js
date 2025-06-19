function createCsvButtonControl(text, disabled) {
  const createCsvButton = document.getElementById("createCsvButton");
  createCsvButton.disabled = disabled;
  createCsvButton.textContent = text;
}

export default createCsvButtonControl;