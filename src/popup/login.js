
 
    document.getElementById("input").addEventListener("input", (e) => {
        chrome.storage.local.set({apikey: e.target.value})
    })

    chrome.storage.local.get(["apikey"], (result) => {
        document.getElementById("input").value = result.apikey
    })