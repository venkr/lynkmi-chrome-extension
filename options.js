const saveOptions = () => {
  const displayMode = document.querySelector(
    'input[name="displayMode"]:checked'
  ).value;
  chrome.storage.sync.set({ displayMode }, () => {
    const status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => (status.textContent = ""), 750);
  });
};

const restoreOptions = () => {
  chrome.storage.sync.get({ displayMode: "modal" }, (items) => {
    document.querySelector(
      `input[value="${items.displayMode}"]`
    ).checked = true;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document
  .querySelectorAll('input[name="displayMode"]')
  .forEach((radio) => radio.addEventListener("change", saveOptions));
