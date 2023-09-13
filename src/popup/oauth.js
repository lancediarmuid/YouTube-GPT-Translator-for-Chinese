window.onload = function() {

    document.getElementById("input").addEventListener("input", (e) => {
      chrome.storage.local.set({apikey: e.target.value})
    })
  
    chrome.storage.local.get(["apikey"], (result) => {
      if(result.apikey) {
          document.getElementById("input").value = result.apikey
      }
    })

    // let login = document.querySelector('#google-login')
    // login.addEventListener('click', function() {
    //   chrome.identity.getAuthToken({interactive: true}, function(token) {
    //     console.log('token',token)

    //     let init = {
    //       method: 'GET',
    //       async: true,
    //       headers: {
    //         Authorization: 'Bearer ' + token,
    //         'Content-Type': 'application/json'
    //       },
    //       'contentType': 'json'
    //     };
    //     fetch(
    //         'https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=AIzaSyD8Hdd0-_g4LDv--3y7fZbJMWxiVUHItpo',
    //         init)
    //         .then((response) => response.json())
    //         .then(function(data) {
    //           console.log(data)
    //         });
    //   });
    // });

  };

