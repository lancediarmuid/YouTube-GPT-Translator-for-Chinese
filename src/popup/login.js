
 
    document.getElementById("input").addEventListener("input", (e) => {
        chrome.storage.local.set({apikey: e.target.value})
    })

    chrome.storage.local.get(["apikey"], (result) => {
        if(result.apikey) {
            document.getElementById("input").value = result.apikey
        }
    })