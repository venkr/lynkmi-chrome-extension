document.addEventListener(
  "click",
  (event) => {
    console.log("Got a click");
    if (event.target.getAttribute("aria-label") === "Button") {
      console.log("Button clicked");
      chrome.runtime.sendMessage({ type: "buttonClicked" });
    }
  },
  true
); // Use capture to ensure we get the event first
