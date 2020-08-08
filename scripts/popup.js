lProt = location.protocol;
ROOT = lProt + '//' + location.host;
sendflag = true;
params = {};
api_key = '';
u = 'undefined';
link = '';
not_auth = true;

locale = 'ru';
trans = {};

function clearCache() {
	this.removeEventListener('click', clearCache);

	this.classList.toggle('btn-success');

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		chrome.tabs.update(tabs[0].id, {url: tabs[0].url}, function() {
			chrome.storage.local.set({api_key: ''}, function() {
				$('#main-content').hide();
				api_key = '';
				//возможно имеет смысл тут добавить показ попапа с авторизацией
				var someVar = {a:10};
				chrome.tabs.executeScript({
					code: '(' + function(params) {
						var block = document.querySelector('.auth_popup');
						if (block) {
							block.style.display = 'block';
						}
					} + ')(' + JSON.stringify(someVar) + ');'
				}, function(results) {

				});
				chrome.browsingData.removeAppcache({});
			});
		});
	});
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#clearCache').addEventListener('click', clearCache);
});

parse_email = '';//original parsed email
parse_resume_id = '';


function setLocale(loc) {
	$.getJSON("_locales/"+loc+"/messages.json", function(json) {
		console.log(json);
		trans = json;

		chrome.storage.local.set({saved_locale:loc}, function() { });

		var i18n_elem = document.querySelectorAll('[data-i18n]');
		for (var j=i18n_elem.length-1; j>=0; j--) {
			console.log(i18n_elem[j].getAttribute('data-i18n'));
			i18n_elem[j].textContent = trans[ i18n_elem[j].getAttribute('data-i18n') ]['message'];
		}
		$('#clearCache').attr('data-msg', trans['clear_cache1_btn']['message'])
	});
}

$(document).ready(function(){
	locale = 'en';
	chrome.storage.local.get('saved_locale',  function(result){
		locale = (result.saved_locale)?result.saved_locale:'en';;
		setLocale(locale);
		$('#locale_switcher').val(locale);
	})



	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse){
			switch(request.exec_func) {
				case "setPartFields":
					setPartFields(request);
					break;
				case "setPhoneField":
					setPhoneField(request);
					break;
				case "setEmailField":
					setEmailField(request);
					break;
				case "addVacOption":
					addVacOption(request);
					break;
				case "showMainContainer":
					showMainContainer(request);
					break;
				case "hideMainContainer":
					hideMainContainer();
					break;
			}
		}
	);

	$('#locale_switcher').on('change',function(){
		console.log('switch locale');
		var loc = $(this).val();
		setLocale(loc);
	});

	function showMainContainer(request) {
		not_auth = false;
		$('#main-content').show();
		api_key = request.api_key;
	}

	function hideMainContainer() {
		not_auth = true;
		$('#main-content').hide();
		api_key = '';
	}

	function setPartFields(request) {
		if(not_auth !== true && request.email) {
			checkEmail(request.email);
		} else {
			console.log('empty_email');
		}
		$('#_name').val(request.name);
		$('#_phone').val(request.phone);
		if(! request.resumeID) {
			console.log('empty_resumeID');
			//hideMainContainer();
		}
		$('#_resumeID').val(request.resumeID);
		parse_resume_id = request.resumeID;

		$('#_email').val(request.email);
		parse_email = request.email;

		$('#_city').val(request.city);
		$('#_gender').val(request.gender);
		$('#_age').val(request.age);
		$('#_coverLetter').val(request.cover_letter);
		$('#_photo').val(request.photo);
		$('#_resumeURL').val(request.url);
		link = request.url;
	}

	$('#_email').on('input', function(){
		//если email вводится другой, то, вероятней всего, никакого отношения
		// к сохраненному айди резюме он не имеет. Считаем его другим кандидатом
		if($(this).val() == parse_email) {
			$('#_resumeID').val(parse_resume_id);
		} else {
			$('#_resumeID').val('');
		}
	});

	function setPhoneField(request){// для поздней подстановки (в hh, после клика)
		$('#_phone').val(request.phone);
	}

	function setEmailField(request){// для поздней подстановки (в hh, после клика)
		$('#_email').val(request.email);
	}

	function addVacOption(response){
		response =  response.vacs_data;
		var html_list = '';
		response = response['vacs'];
		var cup = '';
		var saved_vac = window.localStorage.getItem('saved_vac');
		if(!saved_vac) saved_vac = 'all';
		for(var i in response) {
			cup = '';
			selected = '';
			if(response[i].length > 0) {
				for(var j in response[i]) {
					selected = '';
					if(saved_vac == response[i][j].id) {
						if(response[i][j].vi === 1) {
							vi_btns = document.querySelectorAll('.test_vi');
							vi_btns.forEach(function(node) {
								node.style.display = 'inline-block';
							});
						} else {
							vi_btns = document.querySelectorAll('.test_vi');
							vi_btns.forEach(function(node) {
								node.style.display = 'none';
							});
						}
						selected = 'selected';
					}
					cup += '<option vi_data ="'+response[i][j].vi+'" value="'+response[i][j].id+'" '+selected+'>'+response[i][j].name+'</option>';
				}
				html_list += '<optgroup label="'+i+'">'+cup+'</optgroup>';
			}
		}
		selected = '';
		if(saved_vac == 'all') selected = 'selected';

		html_list = '<option value="all" '+selected+'>Без вакансии</option>'+html_list;
		html_list = '<select class="vac-select">'+html_list+'</select>';

		var dom = document.createElement('div');
		//dom.innerHTML = html_list;
		$(dom).html(html_list);

		$('.com').after(dom);
		var select = $(dom).find('select');
		$(select).on('change', function(){
			setVac(this);
		});
	}


	function setVac(select) {
		var curr_val = select.value;

		vi_btns = document.querySelectorAll('.test_vi');
		if(select.selectedOptions[0] && select.selectedOptions[0].getAttribute('vi_data') == 1) {
			vi_btns.forEach(function(node) {
				node.style.display = 'inline-block';
			});
		} else {
			vi_btns.forEach(function(node) {
				node.style.display = 'none';
			});
		}
		selects = document.querySelectorAll('.vac-select');
		selects.forEach(function(node) {
			var a = node.querySelector('option[value="'+curr_val+'"]');
			node.value = curr_val;
			a.selected = true;
		});
		window.localStorage.setItem('saved_vac', curr_val);
	}

	function sendRequest(btn) {
		params = {};
		var name = $('#_name').val();
		var phone = $('#_phone').val();
		var photo = $('#_photo').val();
		var resume_id = $('#_resumeID').val();
		var email = $('#_email').val();
		var city = $('#_city').val();
		var gender = $('#_gender').val();
		var age = $('#_age').val();
		var cover_letter = $('#_coverLetter').val();
		var vacancy_id = $('#_vacancy').val();
		var resume_url = $('#_resumeURL').val();

		var part = btn.getAttribute('data-part');

		var vacancy_select = $('.vac-select');

		var vacancy_hrs = 'all';
		if(vacancy_select && vacancy_select.val()) {
			vacancy_hrs = vacancy_select.val();
		}

		params.url = 'https://hrscanner.ru/api/create_participant';
		params.resume_url = resume_url;
		params.link = link;
		params.method = 'post';
		params.headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest"};
		params.onload = function(data) {
			console.log('onload exec');
			sendflag = true;


			data = JSON.parse(data.responseText);
			$('.submit-form__contact').prop('disabled', false);
			var mess = '';
			if(data.err) {
				if(data.msg.indexOf('Many participant') > -1 || data.msg.indexOf('already exists') > -1) {
					mess = trans['participant_exist']['message'];
					showMessage(mess, 'warning');
				} else {
					mess = trans['incorrect_data']['message'];
					showMessage(mess, 'danger');
				}
			} else {
				if(part*1 == 0) {
					mess = trans['participant_added']['message'];
					showMessage(mess, 'success');
				} else {
					mess = trans['test_sended']['message'];
					showMessage(mess, 'success');
				}
			}
		};
		params.onerror = function(data) {
			console.log('onerror exec');
			mess = trans['send_error']['message'];
			showMessage(mess, 'danger');
		};
		params.onreadystatechange = function(data) {
			console.log('onreadystatechange exec');
		};


		params.data = {};
		params.data.part = part;
		params.data.email = email;
		params.data.city = city;
		params.data.sex = gender;
		params.data.cover_letter = cover_letter.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').replace(/([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g, '');
		params.data.photo = (photo) ? ROOT + photo : '';
		params.data.ext_vacancy_id = vacancy_id;
		params.data.vacancy = vacancy_hrs;
		params.data.ext_resume_id = resume_id;
		params.data.api_key = api_key;
		params.data.resume_url = resume_url;

		params.data.phone = phone;

		name = name.split(' ');
		params.data.name = name[0];
		params.data.last_name = (name.length > 1)?name[1]:'';

		params.data.age = age;

		params.data = serialize(params.data);

		GM_xmlhttpRequest(params);

	}

	function checkEmail(email) {
		debugger
		var params2 = {};
		params2.url = 'https://hrscanner.ru/api/search_participant';
		params2.link = 'https://hrscanner.ru/api/search_participant';
		params2.method = 'post';
		params2.headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest"};
		params2.data = {};
		params2.data.email = email;
		params2.data.api_key = api_key;
		params2.data = serialize(params2.data);
		params2.onload = function(data) {
			var tests = data.responseText;
			tests = JSON.parse(tests);
			var participants = tests.participants;
			var test_links = [];
			var participant = [];
			var cup = [];
			var p_id = '';
			var link = '';
			// т.к. результаты отсортированы по id, то проходим по порядку от самых новых
			// к более старым и сохраняем в test_links первый найденный результат
			// таким образом, в массиве ссылок будут только последние результаты по каждому тесту
			// независимо от того, к какому кандидату они привязаны
			for(var p in participants) {
				participant = participants[p];
				cup = participant['tests_finish'];

				if(cup) {
					for(i in cup) {
						if(! test_links[i]) {
							test_links[i] = cup[i];
							switch(i) {
								case 'RESALT':
									$('.test_resalt').hide();
									$('.test_resalt.completed').css('display', 'inline-block').attr('href', cup[i]);
									break;
								case 'TOOLS':
									$('.test_tools').hide();
									$('.test_tools.completed').css('display', 'inline-block').attr('href', cup[i]);
									break;
								case 'SAILS':
									$('.test_sails').hide();
									$('.test_sails.completed').css('display', 'inline-block').attr('href', cup[i]);
									break;
								case 'VI':
									$('.test_vi').hide();
									$('.test_vi.completed').css('display', 'inline-block').attr('href', cup[i]);
									break;
								case 'LOGIS':
									$('.test_logis').hide();
									$('.test_logis.completed').css('display', 'inline-block').attr('href', cup[i]);
									break;
							}
						}
					}
				}
			}
		};
		params2.onerror = function(data) {
			console.log(data);
		};
		params2.onstatechange = function(data) {
			console.log(data);
		};
		GM_xmlhttpRequest(params2);
	}

	$('.hrsc-btnn').on('click', function(){
		if(sendflag === true) {
			sendflag = false;
			$('.submit-form__contact').prop('disabled',true);
			sendRequest(this);
		} else {
			console.log('already sended');
			return false;
		}
	});

	chrome.tabs.executeScript({
		file: "scripts/script2.js"
	}, function(res){
	});

	function showMessage(text, type) {

		$('.message-text').text(text);
		$('.message-content').removeClass('danger warning success').addClass(type);
		setTimeout(function () {
			notice.style.display = 'block'
			}, 6500)
		setTimeout(function () {
			notice.style.display = 'none'
			}, 8500)
	}


	/**
	 *
	 * AJAX-send func, vanilla
	 *
	 */
	GM_xmlhttpRequest = function (h) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {

			var responseState = {
				responseXML: xhr.readyState == 4 ? xhr.responseXML : ''
				, responseText: xhr.readyState == 4 ? xhr.responseText : ''
				, readyState: xhr.readyState
				, responseHeaders: xhr.readyState == 4 ? xhr.getAllResponseHeaders() : ''
				, status: xhr.readyState == 4 ? xhr.status : 0
				, statusText: xhr.readyState == 4 ? xhr.statusText : ''
			};
			h.onreadystatechange && h.onreadystatechange(responseState);
			if (xhr.readyState == 4) {
				if (h.onload && xhr.status >= 200 && xhr.status < 300)
					h.onload(responseState);
				if (h.onerror && (xhr.status < 200 || xhr.status >= 300))
					h.onerror(responseState);
			}
		};
		try {

			xhr.open(h.method, h.url);
		} catch (er) {

			if (h.onerror) {

				h.onerror({
					responseXML: '',
					responseText: '',
					readyState: 4,
					responseHeaders: '',
					status: 403,
					statusText: 'Forbidden'
				});
			}
			return;
		}
		if (h.headers)
			for (var prop in h.headers)
				xhr.setRequestHeader(prop, h.headers[prop]);
		xhr.send((typeof(h.data) != u) ? h.data : null);
	};

	/**
	 *
	 * Function for serialization params-object to query string
	 *
	 */
	serialize = function (obj, prefix) {
		var str = [], p;
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p,
					v = obj[p];
				str.push((v !== null && typeof v === "object") ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	}

});

