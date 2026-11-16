window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}

var consent = null;
try {
  consent = document.cookie
    .split("; ")
    .find(function (r) {
      return r.startsWith("consentChoice=");
    })
    ?.split("=")[1];
} catch (e) {}

if (consent === "accepted") {
  gtag("consent", "default", { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
} else if (consent === "rejected") {
  gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
} else {
  gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
}
