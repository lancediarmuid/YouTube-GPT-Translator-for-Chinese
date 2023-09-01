
window.onload = async () => {
    chrome.runtime.sendMessage({ message: "getApikey" }, (response) => {
        document.getElementById("input").value = response.apikey;
    });  
    document.getElementById("input").addEventListener("input", (e) => {
        e.stopPropagation();
        chrome.runtime.sendMessage({ message: "setApikey", apikey: e.target.value });
    })
}