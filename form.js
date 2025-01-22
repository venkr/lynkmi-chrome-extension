function maybeGetHandle(url) {
  // https://x.com/patio11/status/1882106330930127071 -> @patio11
  const handle = url.split("/")[3];
  return handle ? `@${handle}` : null;
}

const populateBookmarkInfo = async () => {
  const { twitterBookmarkUrl } = await chrome.storage.sync.get([
    "twitterBookmarkUrl",
  ]);

  // Remove the bookmark url from storage
  chrome.storage.sync.remove("twitterBookmarkUrl");

  if (twitterBookmarkUrl) {
    const handle = maybeGetHandle(twitterBookmarkUrl);
    document.getElementById("url").value = twitterBookmarkUrl;
    document.getElementById("title").value = handle
      ? `Tweet from ${handle}`
      : "Tweet";
  } else {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "getTabInfo" }, (response) => {
        if (response) {
          document.getElementById("title").value = response.title;
          document.getElementById("url").value = response.url;
        }
      });
    });
  }
};

// Check login status and show appropriate form
const init = async () => {
  const { lynkmiUsername, lynkmiPassword } = await chrome.storage.sync.get([
    "lynkmiUsername",
    "lynkmiPassword",
  ]);
  if (lynkmiUsername && lynkmiPassword) {
    showBookmarkForm();
    await populateBookmarkInfo();
  } else {
    showLoginForm();
  }
};

const showLoginForm = () => {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("bookmarkForm").classList.add("hidden");
};

const showBookmarkForm = () => {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("bookmarkForm").classList.remove("hidden");
};

// Login handler
document.getElementById("loginSubmit").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await chrome.storage.sync.set({
    lynkmiUsername: username,
    lynkmiPassword: password,
  });
  showBookmarkForm();
  await populateBookmarkInfo();
});

// Bookmark submission handler
document
  .getElementById("bookmarkSubmit")
  .addEventListener("click", async () => {
    const { lynkmiUsername, lynkmiPassword } = await chrome.storage.sync.get([
      "lynkmiUsername",
      "lynkmiPassword",
    ]);

    const data = {
      username: lynkmiUsername,
      password: lynkmiPassword,
      title: document.getElementById("title").value,
      url: document.getElementById("url").value,
      tags: document
        .getElementById("tags")
        .value.split(",")
        .map((t) => t.trim()),
      description: document.getElementById("description").value,
    };

    try {
      const response = fetch("https://lynkmi-api.fly.dev/submitLink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setTimeout(() => {
        const successDiv = document.getElementById("bookmarkSuccess");
        successDiv.textContent = "Bookmark added!";
        successDiv.classList.remove("hidden");
        setTimeout(() => successDiv.classList.add("hidden"), 2000);
      }, 500);

      setTimeout(() => {
        // chrome.runtime.sendMessage({ type: "bookmarkSubmitted" });
        window.parent.window.close();
      }, 1000);
    } catch (error) {
      const errorDiv = document.getElementById("bookmarkError");
      errorDiv.textContent = error.message;
      errorDiv.classList.remove("hidden");
      setTimeout(() => errorDiv.classList.add("hidden"), 2000);
    }
  });

// Command+Enter submission
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    document.getElementById("bookmarkSubmit").click();
  }
});

document.addEventListener("DOMContentLoaded", init);
