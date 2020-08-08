win = (function(){return this})();
u = 'undefined';

//api_key = null;

lProt = location.protocol;
ROOT = lProt+'//'+location.host;

function init_auth() {
    setTimeout(function(){
        var back = document.querySelector('input.back_href');
        if(back) back = back.value;
        var show_flag = 1;
        chrome.storage.local.get('show_backhh', function(result) {
            show_flag = result.show_backhh;
            if(back && show_flag == 1) {
                chrome.storage.local.set({'show_backhh':0});
                addBackPop(back);
                showBackPop();
                return false;
            }
        });

    }, 2000)
}
function showBackPop() {
    var block = document.querySelector('.backhh_popup');
    if(block) {
        block.style.display = 'block';
    }
}

function closeBackPop() {
    var block = document.querySelector('.backhh_popup');
    if(block) {
        block.style.display = 'none';
    }
}

function addBackPop(href) {
    var location = getLocation(href);
    var host = location.hostname
    var block = document.createElement('div');
    block.className = "backhh_popup";
    block.innerHTML = '<span class="popup_content"><a class="auth-link" href="'+href+'" >Вернуться в <b>'+host+'</b></a><span class="close">x</span></span>';
    document.querySelector('body').appendChild(block);

    block.addEventListener('click', function (event) {
        closeBackPop();
    }, false);
}

function getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};


function closeBackPop() {
    var block = document.querySelector('.backhh_popup');
    if (block) {
        block.style.display = 'none';
    }
}