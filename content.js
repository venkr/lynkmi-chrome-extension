// Only register the click handler if we're on x.com or twitter.com
if (
  window.location.hostname === "x.com" ||
  window.location.hostname === "twitter.com"
) {
  document.addEventListener(
    "click",
    (event) => {
      let element = event.target;

      while (element) {
        // console.log("Got an elements");
        // console.log(element);
        // console.log(element.getAttribute("aria-label"));
        if (
          // element.getAttribute("aria-label") === "Bookmark" ||
          element.getAttribute("aria-label") === "Bookmark"
        ) {
          event.preventDefault();
          event.stopPropagation();
          // second loop, find the parent element with data-testid of "tweet"
          while (element) {
            console.log(element);
            console.log(element.getAttribute("data-testid"));
            if (element.getAttribute("data-testid") === "tweet") {
              const url = element.querySelector("a > time").closest("a").href;
              chrome.runtime.sendMessage({
                type: "bookmarkButtonClicked",
                url: url,
              });
              // store the url in storage
              chrome.storage.sync.set({
                twitterBookmarkUrl: url,
              });
              console.log("Stored twitterBookmarkUrl in storage:", url);
              break;
            }
            element = element.parentElement;
          }
          break;
        }
        element = element.parentElement;
      }
    },
    true
  ); // Use capture to ensure we get the event first
}

// First, inject Bootstrap CSS if not present
// if (!document.querySelector("#lynkmi-bootstrap-css")) {
//   const bootstrapCSS = document.createElement("link");
//   bootstrapCSS.id = "lynkmi-bootstrap-css";
//   bootstrapCSS.rel = "stylesheet";
//   bootstrapCSS.href = chrome.runtime.getURL("bootstrap.min.css");
//   document.head.appendChild(bootstrapCSS);
// }
// Inject modal HTML if not present
// (async () => {
//   if (!document.querySelector("#lynkmi-modal")) {
//     const formResponse = await fetch(chrome.runtime.getURL("form.html"));
//     const formText = await formResponse.text();

//     // Extract body content from form.html
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = formText;
//     const formContent = tempDiv.querySelector("body").innerHTML;

//     const modalDiv = document.createElement("div");
//     modalDiv.id = "lynkmi-modal";
//     modalDiv.innerHTML = `
//       <div class="modal fade" tabindex="-1">
//         <div class="modal-dialog">
//           <div class="modal-content">
//             <div class="modal-body">
//               ${formContent}
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//     document.body.appendChild(modalDiv);
//   }
// })();

// Listen for showModal message
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "showModal") {
//     // Initialize Bootstrap modal if not already done
//     if (!window.bootstrapModal) {
//       const script = document.createElement("script");
//       script.src = chrome.runtime.getURL("bootstrap.min.js");
//       script.onload = () => {
//         const modalEl = document.querySelector("#lynkmi-modal .modal");
//         window.bootstrapModal = new bootstrap.Modal(modalEl);
//         window.bootstrapModal.show();
//       };
//       document.head.appendChild(script);
//     } else {
//       window.bootstrapModal.show();
//     }
//   }
// });
// Listen for bookmarkSubmitted to close modal
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "bookmarkSubmitted") {
//     window.close();
//     // chrome.storage.sync.get({ displayMode: "popup" }, (result) => {
//     //   if (result.displayMode === "modal" && window.bootstrapModal) {
//     //     window.bootstrapModal.hide();
//     //   }
//     //   sendResponse({ success: true });
//     // });
//     // return true;
//   }
//   //   if (request.type === "closePopup") {
//   //     chrome.action.closePopup();
//   //     sendResponse({ success: true });
//   //     return true;
//   //   }
// });

// // Add to content.js
// window.addEventListener("message", (event) => {
//   // Forward messages from iframe to background
//   if (
//     event.data.type === "getTabInfo" ||
//     event.data.type === "bookmarkSubmitted"
//   ) {
//     chrome.runtime.sendMessage(event.data);
//   }
// });
