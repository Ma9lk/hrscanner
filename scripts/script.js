/**
 * в этом файле вся логика которая должна отрабатывать вне зависимости от открытости попапа
 * (например, на загрузку страницы)
 * */


win = (function () {
    return this
})();
u = 'undefined';

api_key = null;
vac_list = null;
sendflag = true;

var date = new Date();
date = date.getFullYear() + '' + date.getMonth() + '' + date.getDay();
date = Math.floor(date * 0.3);

window.hrsApiKeyHash = date;
window.hashPrefix = 'hrsdef_';

waitHQ = win.setTimeout(function () {
}, 14000);

lProt = location.protocol;
ROOT = lProt + '//' + location.host;

function init_main(apiKeyHash, hashPrefix) {

    addAuthPop();

    api_key = '';
    chrome.storage.local.get('api_key', function(result) {
        api_key = result.api_key;
        if(!api_key) {
            showAuthPop();//здесь это нужно для отображения ссылки на авторизацию без открытия попапа
        }
    });

    localStorage.setItem('api_key', api_key);

}

function addAuthPop() {
    var block = document.createElement('div');
    block.className = "auth_popup";
    block.style.display = "none";
    block.innerHTML = '<span class="popup_content"><a class="auth-link" style="font-size:13px; line-height: 18px;" target="_blank" href="https://hrscanner.ru/ru/user/home" >Авторизуйтесь в <b>Hrscanner</b></a><span class="close">скрыть</span></span>';
    document.querySelector('body').appendChild(block);

    block.addEventListener('click', function (event) {
        closeAuthPop();
    }, false);
}

function showAuthPop() {
    var block = document.querySelector('.auth_popup');
    if (block) {
        block.style.display = 'block'
        chrome.storage.local.set({'show_backhh':1});
    }
}

function closeAuthPop() {
    var block = document.querySelector('.auth_popup');
    if (block) {
        block.style.display = 'none';
    }
}

