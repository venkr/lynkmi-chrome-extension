chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getTabInfo") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ title: tabs[0].title, url: tabs[0].url });
    });
    return true; // Keep channel open for async response
  }

  // Handle other non-async cases synchronously
  // if (request.type === "bookmarkSubmitted") {
  //   chrome.storage.sync.get({ displayMode: "popup" }, (result) => {
  //     if (result.displayMode === "popup") {
  //       chrome.action.setPopup({ popup: "" });
  //     }
  //     sendResponse({ success: true });
  //   });
  //   return true;
  // }

  if (request.type === "bookmarkButtonClicked") {
    triggerBookmark(sendResponse).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// // Add to background.js
// chrome.runtime.onInstalled.addListener(() => {
//   // Register content script specifically for x.com
//   chrome.scripting.registerContentScripts([
//     {
//       id: "x-com-handler",
//       matches: ["*://*.x.com/*"],
//       js: ["twitterHandler.js"],
//     },
//   ]);
// });

// Shared function for handling bookmark trigger from any source
async function triggerBookmark() {
  // if (chrome.extension.getViews({ type: "popup" }).length > 0) {
  //   await chrome.runtime.sendMessage({ type: "closePopup" });
  // } else {
  await chrome.action.openPopup();
  // }
  // const { displayMode } = await chrome.storage.sync.get({
  //   displayMode: "popup",
  // });

  // switch (displayMode) {
  //   case "popup":
  //     chrome.action.openPopup();
  //     break;
  //   case "modal":
  //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //       chrome.tabs.sendMessage(tabs[0].id, { type: "showModal" });
  //     });
  //     break;
  //   case "sidebar":
  //     // TODO: Handle sidebar case
  //     break;
  // }
}

// Command handler now uses shared function
chrome.commands.onCommand.addListener((command) => {
  if (command === "trigger-bookmark") {
    triggerBookmark();
  }
});
