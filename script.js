// MEMORA setup: replace this with your WhatsApp number including country code, no + or spaces.
const WHATSAPP_NUMBER = "918074595781";

const $ = (id) => document.getElementById(id);
const form = $("memoryForm");
const person = $("person"), occasion = $("occasion"), message = $("message"), photo = $("photo");
let photoData = "";

function updatePreview() {
  $("previewName").textContent = person.value.trim() || "Someone Special";
  $("previewOccasion").textContent = "A LITTLE " + (occasion.value || "MOMENT").toUpperCase() + " MAGIC";
  $("previewMessage").textContent = message.value.trim() || "You make the world brighter just by being in it. Here's a little reminder that you are loved!";
}
[person, occasion, message].forEach(el => el.addEventListener("input", updatePreview));
photo.addEventListener("change", () => {
  const file = photo.files && photo.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return alert("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) return alert("Please choose an image under 5 MB for this demo.");
  const reader = new FileReader();
  reader.onload = () => {
    photoData = reader.result;
    $("previewPhoto").innerHTML = `<img src="${photoData}" alt="Your uploaded memory photo">`;
  };
  reader.readAsDataURL(file);
});
form.addEventListener("submit", (e) => { e.preventDefault(); updatePreview(); });

function memoryUrl() {
  // After publishing, this becomes a real shareable page URL.
  const base = new URL("memory.html", window.location.href);
  base.searchParams.set("to", person.value.trim() || "Someone Special");
  base.searchParams.set("occasion", occasion.value);
  base.searchParams.set("message", message.value.trim() || "You are loved more than words can say.");
  return base.toString();
}
$("makeLink").addEventListener("click", () => {
  if (!window.QRCode) {
    alert("QR library did not load. Check your internet connection and try again.");
    return;
  }
  $("qrcode").innerHTML = "";
  const url = memoryUrl();
  new QRCode($("qrcode"), { text: url, width: 150, height: 150, correctLevel: QRCode.CorrectLevel.M });
  $("linkText").textContent = url;
  $("qrArea").hidden = false;
});
$("copyLink").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(memoryUrl()); $("copyLink").textContent = "Copied!"; }
  catch { alert("Copy not available here. Select and copy the link shown above."); }
});
$("whatsappBtn").addEventListener("click", (e) => {
  if (WHATSAPP_NUMBER.includes("X")) {
    e.preventDefault();
    alert("Setup needed: open script.js and replace 91XXXXXXXXXX with your WhatsApp number, including country code.");
    return;
  }
  const text = `Hi MEMORA! I want to order a personalised memory page.\\nFor: ${person.value || "Not entered"}\\nOccasion: ${occasion.value}\\nMessage: ${message.value}\\nPhoto: ${photo.files[0] ? "I will send it in this chat" : "No photo"}\\nPlease share the next steps and final price.`;
  $("whatsappBtn").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
});
$("year").textContent = new Date().getFullYear();
updatePreview();
