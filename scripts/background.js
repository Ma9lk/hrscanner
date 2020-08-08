'use strict';

function getStatus() {
    return localStorage.getItem('hrs_extension_status') === 'true';
}
function setStatus(status) {
    localStorage.setItem('hrs_extension_status', "" + status);
}

function isHHorHRS(tab, flag=false) {
    var hostname = tab.url.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
    //alert(hostname);
    var isHH = ['hh.ru', 'career.ru', 'hh.ua', 'hh.uz', 'hh.kz', 'headhunter.ge', 'headhunter.kg'].indexOf(hostname.split('.').slice('-2').join('.')) !== -1;
    var isHRS = ['hrscanner.ru', 'preprod.hrscanner.ru', 'ufa.hrscanner.ru'].indexOf(hostname) !== -1;
    var isHFL = ['huntflow.ru'].indexOf(hostname) !== -1;
    var isSPJ = ['superjob.ru'].indexOf(hostname) !== -1;
    //alert(isHFL);
    if(flag == false){
        return isHH || isHRS || isHFL;
    } else {
        var whatIs = '';
        if(isHH) whatIs = 'hh';
        if(isHRS) whatIs = 'hrs';
        if(isHFL) whatIs = 'hfl';
        if(isSPJ) whatIs = 'spj';

        return whatIs;
    }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo && changeInfo.status === 'complete' && isHHorHRS(tab)) {
        chrome.tabs.executeScript(tabId, {
            file: "scripts/inject.js"
        }, function(result){
            var whatIs = isHHorHRS(tab, true);

            if(whatIs == 'hh' || whatIs == 'hfl' || whatIs == 'spj') {
                chrome.tabs.executeScript(tabId, {
                    file: "scripts/script.js"
                }, function(res){
                    chrome.tabs.executeScript(tabId, {
                        code: "init_main();"
                    }, function(res2){});
                });

            } else if(whatIs == 'hrs'){
                chrome.tabs.executeScript(tabId, {
                    file: "scripts/script_auth.js"
                }, function(res3){
                    chrome.tabs.executeScript(tabId, {
                        code: "init_auth();"
                    }, function(res4){});
                });
            }
        });
    }
});

if (getStatus() === undefined) {
    setStatus(false);
}

chrome.browserAction.onClicked.addListener(function (tab) {
    if (isHHorHRS(tab)) {
        return;
    }
    var status = getStatus();
    setStatus(!status);
    chrome.tabs.reload();
});

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.method === 'getLocalStorage') {
        sendResponse({
            globalStatus: getStatus()
        });
    }
});