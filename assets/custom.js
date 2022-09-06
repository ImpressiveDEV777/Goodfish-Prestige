/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */
 

(function() {

	//minify document & body
	const d = document;
	const b = d.body;
	
	//get our sticky header element and wrapper
	const sticky_header_wrapper = d.querySelector('#shopify-section-header');
	const sticky_header = d.querySelector('#section-header');
	
	//get our main wrapper element for picking out child elements
	const mainEl = d.querySelector('main#main');
	
	//get our header settings
	const header_settings = JSON.parse(sticky_header.dataset.sectionSettings);
	
	//check to see if our header is sticky. if so, add a class to the wrapper element (can't access directly as it's added by Shopify, but the theme is using it to apply the sticky css	
	if (header_settings['isSticky'] == true) {
		
		b.classList.add('header-is-sticky')
				
		let initial_position = parseFloat(header_settings['stickyPosition']);
		
		if (initial_position > 0 ) {
			
			if ( header_settings['stickyPositionHome'] == false || b.classList.contains('template-index') ) {
			
				//add a couple classes to the body so we can alter how section heights are calculated if needed
				b.classList.add('header-initial-position-changed');
				
				if (!Shopify.designMode) { //Only fire if we're not in the editor, messes with the editor's UI, need to fix TODO (see commented code below)
					mainEl.childNodes[ initial_position ].after(sticky_header_wrapper);
				}
				
			}
		}
		
		
	}
	
	// d.addEventListener('shopify:section:load', function(ev) {
    // 	console.log(1)
	// });
	
	//const first_section = d.getElementById('shopify-section-template--15268170924228__163952370021aefa00');

	// Method stuff goes below
	var perishableZones = document.getElementsByTagName('body')[0].dataset.localDeliveryZones.split(',');

  var currentPostal = document.getElementById('Current__Postal');
  var containerBtn = document.querySelector('.ProductSelection__Container');
  var alertContainer = document.querySelector('.DeliveryAlert__Container');
  var methodModalContainer = document.querySelector(".MethodModal__Container");
  var methodDropdownContainer = document.querySelector("#MethodDropdown");
  var local_methodContainer = document.querySelector("#MethodModal .Method__Selector .Method__Local");
  var pickup_methodContainer = document.querySelector("#MethodModal .Method__Selector .Method__Pickup");
  var mail_methodContainer = document.querySelector("MethodModal .Method__Selector .Method__Mail");
  var local_methodContainerDrop = document.querySelector("#MethodDropdown .Method__Selector .Method__Local");
  var pickup_methodContainerDrop = document.querySelector("#MethodDropdown .Method__Selector .Method__Pickup");
  var mail_methodContainerDrop = document.querySelector("#MethodDropdown .Method__Selector .Method__Mail");
  var inputPostalModal = document.getElementById('PostalCode');
  var inputPostalDropdown = document.getElementById('PostalCode__Drop');
  var M1T = document.querySelector('body').dataset.m1t;
  var M2T = document.querySelector('body').dataset.m2t;
  var M2D1 = document.querySelector('body').dataset.m2d1;
  var M2D2 = document.querySelector('body').dataset.m2d2;
  var QAE = document.querySelector('body').dataset.qae;
  var MSA = document.querySelector('body').dataset.msa;
  var mainNav = document.querySelector('.main_nav_wrapper');
  var shippingNav = document.querySelector('.shipping_nav_wrapper');
  var mainNavMob = document.querySelector('.main_menu_mobwrapper');
  var shippingNavMob = document.querySelector('.shipping_menu_mobwrapper');
  
  window.onresize = () => {
    if (localStorage.getItem('method')) {
      document.getElementById('MainContent').style.marginTop = '0';
    }
  }
  
  window.onload = function() {
    var zapierContainer = document.querySelectorAll('#storePickupApp .checkoutMethod');
    var mthod = localStorage.getItem("method");
    
    var waitForInput = () => {
      var deliveryGeoSearchField = document.getElementById('deliveryGeoSearchField');
      if (!deliveryGeoSearchField) {
        setTimeout(waitForInput, 100);
        return;
      }
      deliveryGeoSearchField.value = localStorage.getItem('postalcode') || '';
      deliveryGeoSearchField.nextElementSibling.click();            
    }
    
    var waitForPickup = () => {
      var location = document.querySelector('.locations');
      if (!location) {
        setTimeout(waitForPickup, 100);
        return;
      }
      switch (localStorage.getItem('postalcode')) {
        case M2D1:
          location.querySelector('div:first-child').click();
          break;
        case M2D2: 
          location.querySelector('div:last-child').click();
          break;
        default:
          break;
      }
    }
    
    if (mthod == '' || mthod == null) {
      openMethodModal();
    }
    else {
      mainNav.style.display = 'none';
      shippingNav.style.display = 'none';
      mainNavMob.style.display = 'none';
      shippingNavMob.style.display = 'none';
      document.querySelectorAll('.header__wrapper .header__dropdown').forEach((el) => {
        el.classList.add('active');
      });
      if (document.getElementById('template-product')) {
        if (alertContainer && mthod == '3') {
          alertContainer.style.display = 'block';
          containerBtn.style.display = 'none';
        }
      }
      document.querySelectorAll('[data-quick-add-label]').forEach((el) => {
        el.querySelector('small:first-child').innerText = "quick add";
      });
      var method, data;
      switch (localStorage.getItem("method")) {
        case '1':
          if (zapierContainer[1]) {
            zapierContainer[1].click();
            setTimeout((e)=>{zapierContainer[0].classList.add('disable')}, 1);
          }          
          waitForInput();
          mainNav.style.display = 'block';
          mainNavMob.style.display = 'block';
          method = M1T;
          data = localStorage.getItem("postalcode");
          inputPostalDropdown.value = data;
          inputPostalDropdown.classList.add('active');
          inputPostalDropdown.style.display = 'block';
          break;
        case '2':
          mainNav.style.display = 'block';
          mainNavMob.style.display = 'block';
          method = M2T;
          data = localStorage.getItem("postalcode");
          if (zapierContainer[1]) {
            zapierContainer[2].click();
            setTimeout((e)=>{zapierContainer[0].classList.add('disable')}, 1);
          }          
          waitForPickup();
          break;
        case '3':
          if (zapierContainer[1]) {
            zapierContainer[0].click();
          }
          shippingNav.style.display = 'block';
          shippingNavMob.style.display = 'block';
          document.querySelectorAll('[data-quick-add-label]').forEach( el => {
            if (el.dataset.tag != "Shipping") {
              el.querySelector('small:first-child').innerText = QAE;
            }
          });
          method = "Delivery Method";
          data = 'Shipping';
          if (checkoutBtn) {
            cartItems.forEach((el) => {
              if (el.dataset.shipping != 1) {
                // shipping_alert.style.display = 'block';
                checkoutBtn.style.display = 'none';
              }
            });
          }
          break;
      }
      currentPostal.innerHTML = method + ": <span>" + data + "</span>";
      stickHeader();
    }
    
   	if (zapierContainer[0]) {
 	  zapierContainer[0].addEventListener('click', (e) => {
        cartItems = document.querySelectorAll('.cart__items .cart-item');
        cartItems.forEach((el) => {
          if (el.dataset.shipping != 1) {
            // shipping_alert.style.display = 'block';
            checkoutBtn.style.display = 'none';
          }
        });
	  });
    }
    
    if (zapierContainer[1]) {
 	  zapierContainer[1].addEventListener('click', (e) => {
        // shipping_alert.style.display = 'none';
        checkoutBtn.style.display = 'block';
	  });
    }
    
    if (zapierContainer[2]) {
 	  zapierContainer[2].addEventListener('click', (e) => {
        // shipping_alert.style.display = 'none';
        checkoutBtn.style.display = 'block';
	  });
    }
  
    if (document.querySelector('#methodModal label[for="address1"]')) {
      document.querySelector('#methodModal label[for="address1"]').onclick = () => {
        pickup_methodContainer.classList.add('active');
        localStorage.setItem('method', 2);
      }
    }
    
    if (document.querySelector('#methodModal label[for="address2"]')) {
      document.querySelector('#methodModal label[for="address2"]').onclick = () => {
        pickup_methodContainer.classList.add('active');
        localStorage.setItem('method', 2);
      }
    }
    
    if (document.querySelector('#methodDropdown label[for="address3"]')) {
      document.querySelector('#methodDropdown label[for="address3"]').onclick = () => {
        pickup_methodContainerDrop.classList.add('active');
        localStorage.setItem('method', 2);
      }
    }
    
    if (document.querySelector('#methodDropdown label[for="address4"]')) {
      document.querySelector('#methodDropdown label[for="address4"]').onclick = () => {
        pickup_methodContainerDrop.classList.add('active');
        localStorage.setItem('method', 2);
      }
    }    

    if (document.getElementById('method_confirm_drop')) {
      document.getElementById('method_confirm_drop').onclick = () => {
        document.querySelectorAll('.header__wrapper .header__dropdown').forEach((el) => {
          el.classList.add('active');
        });
        mainNav.style.display = 'none';
        shippingNav.style.display = 'none'
        mainNavMob.style.display = 'none';
        shippingNavMob.style.display = 'none';
        
        var mthd = localStorage.getItem("method"), dtad;
        
        if (mthd == '' || mthd == null) {
          alert(MSA);
          return;
        }
        
        document.querySelectorAll('[data-quick-add-label]').forEach( el => {
          el.querySelector('small:first-child').innerText = "quick add";
        });
        
        switch (mthd) {
          case '1':
            localStorage.setItem('postalcode', document.querySelector('#methodDropdown #postalcode_drop').value);
            if (zapierContainer[1]) {
              zapierContainer[1].click();
              waitForInput();
            }
            mainNav.style.display = 'block';
            mainNavMob.style.display = 'block';
            dtad = localStorage.getItem('postalcode');
            var zip = dtad.slice(0, 3);
            if (perishableZones.join(',').toLowerCase().split(',').indexOf(zip.toLowerCase()) == -1){
              document.querySelector('.post_alert_d').style.display = 'block';
              return;
            }
            document.querySelector('.post_alert_d').style.display = 'none';
            currentPostal.innerHTML = M1T + ": <span>" + dtad + "</span>";
            if (alertContainer) {
              alertContainer.style.display = 'none';
              containerBtn.style.display = 'block';
            }
            stickHeader();
            methodDropdownContainer.classList.remove('active');
            if (checkoutBtn) {
              // shipping_alert.style.display = 'none';
              checkoutBtn.style.display = 'block';
            }
            break;
          case '2':
            if(document.getElementById('address3').checked) {
              dtad = M2D1;
              localStorage.setItem("pickup", "1");
              localStorage.setItem("postalcode", dtad);
            }
            if(document.getElementById('address4').checked) {
              dtad = M2D2;
              localStorage.setItem("pickup", "2");
              localStorage.setItem("postalcode", dtad);
            }
            if (zapierContainer[2]) {
              zapierContainer[2].click();
            }
            waitForPickup();
            mainNav.style.display = 'block';
            mainNavMob.style.display = 'block';
            methodDropdownContainer.classList.remove('active');
            if (alertContainer) {
              alertContainer.style.display = 'none';
              containerBtn.style.display = 'block';
            }
            currentPostal.innerHTML = M2T + ": <span>" + localStorage.getItem('postalcode') + "</span>";
            stickHeader();
            if (checkoutBtn) {
              // shipping_alert.style.display = 'none';
              checkoutBtn.style.display = 'block';
            }
            break;
          case '3':
            localStorage.setItem("postalcode", "Shipping");
            if (zapierContainer[0]) {
              zapierContainer[0].click();
            }
            shippingNav.style.display = 'block';
            shippingNavMob.style.display = 'block';
            document.querySelectorAll('[data-quick-add-label]').forEach( el => {
              if (el.dataset.tag != "Shipping") {
                el.querySelector('small:first-child').innerText = QAE;
              }
            });
            methodDropdownContainer.classList.remove('active');
            currentPostal.innerHTML = "Delivery Method: <span>Shipping</span>";
            if (alertContainer) {
              alertContainer.style.display = 'block';
              containerBtn.style.display = 'none';  
            }
            stickHeader();
            if (checkoutBtn) {
              cartItems = document.querySelectorAll('.cart__items .cart-item');
              cartItems.forEach((el) => {
                if (el.dataset.shipping != 1) {
                  // shipping_alert.style.display = 'block';
                  checkoutBtn.style.display = 'none';
                }
              });
            }
            break;
        }
      }
    }
    
    if (document.getElementById('method_confirm')) {
      document.getElementById('method_confirm').onclick = () => {
        document.querySelectorAll('.header__wrapper .header__dropdown').forEach((el) => {
          el.classList.add('active');
        });
        mainNav.style.display = 'none';
        shippingNav.style.display = 'none'
        mainNavMob.style.display = 'none';
        shippingNavMob.style.display = 'none'
        var mth = localStorage.getItem("method");
        if (mth == '' || mth == null) {
          alert(MSA);
          return;
        }
        var dta = localStorage.getItem('postalcode');
        switch (mth) {
          case '1':
            localStorage.setItem('postalcode', document.querySelector('#methodModal #postalcode').value);
            inputPostalDropdown.value = document.querySelector('#methodModal #postalcode').value;
            inputPostalDropdown.classList.add('active');
            inputPostalDropdown.style.display = 'block';
            if (zapierContainer[1]) {
              zapierContainer[1].click();
              waitForInput();
            }
            mainNav.style.display = 'block';
            mainNavMob.style.display = 'block';
            var zip = dta.slice(0, 3);
            if (perishableZones.join(',').toLowerCase().split(',').indexOf(zip.toLowerCase()) == -1){
              document.querySelector('.post_alert_p').style.display = 'block';
              return;
            }
            document.querySelector('.post_alert_p').style.display = 'none';
            currentPostal.innerHTML = M1T + ": <span>" + dta + "</span>";
            if (alertContainer) {
              alertContainer.style.display = 'none';
              containerBtn.style.block = 'block';
            }
            stickHeader();
            methodModalContainer.classList.remove('active');
            break;
          case '2':
            if(document.getElementById('address1').checked) {
              dta = M2D1;
              localStorage.setItem("pickup", "1");
              localStorage.setItem("postalcode", dta);
            }
            if(document.getElementById('address2').checked) {
              dta = M2D2;
              localStorage.setItem("pickup", "2");
              localStorage.setItem("postalcode", dta);
            }
            if (zapierContainer[2]) {
              zapierContainer[2].click();
            }
            waitForPickup();
            mainNav.style.display = 'block';
            mainNavMob.style.display = 'block';
            methodModalContainer.classList.remove('active');
            if (alertContainer) {
              alertContainer.style.display = 'none';
              containerBtn.style.display = 'block';
            }
            currentPostal.innerHTML = M2T + ": <span>" + localStorage.getItem('postalcode') + "</span>";
            stickHeader();
            break;
          case '3':
            localStorage.setItem("postalcode", "Shipping");
            if (zapierContainer[0]) {
              zapierContainer[0].click();
            }
            shippingNav.style.display = 'block';
            shippingNavMob.style.display = 'block';
            methodModalContainer.classList.remove('active');
            currentPostal.innerHTML = "Delivery Method: <span>Shipping</span>";
            if (alertContainer) {
              alertContainer.style.display = 'block';
              containerBtn.style.display = 'none';  
            }
            else {
              if (containerBtn) {
                containerBtn.style.display = 'block';
              }
            }
            stickHeader();
            break;
        }
      }
    }
    
    if (local_methodContainerDrop) {
      local_methodContainerDrop.onclick = () => {
        local_methodContainerDrop.classList.add('active');
        mail_methodContainerDrop.classList.remove('active');
        pickup_methodContainerDrop.classList.remove('active');
        inputPostalDropdown.style.display = 'block';
        inputPostalDropdown.classList.remove('active');
        document.getElementById('address3').checked = false;
		    document.getElementById('address4').checked = false;
        localStorage.setItem("method", 1);
      }
    }
    
    if (pickup_methodContainerDrop) {
      pickup_methodContainerDrop.onclick = () => {
        local_methodContainerDrop.classList.remove('active');
        mail_methodContainerDrop.classList.remove('active');
        pickup_methodContainerDrop.classList.add('active');
        inputPostalDropdown.classList.add('active');
        document.querySelector('.post_alert_d').style.display = 'none';
        localStorage.setItem("method", 2);
      }
    }
    
    if (mail_methodContainerDrop) {
      mail_methodContainerDrop.onclick = () => {
        local_methodContainerDrop.classList.remove('active');
        pickup_methodContainerDrop.classList.remove('active');
        mail_methodContainerDrop.classList.add('active');
        document.querySelector('.post_alert_d').style.display = 'none';
        inputPostalDropdown.classList.add('active');
        document.getElementById('address3').checked = false;
		    document.getElementById('address4').checked = false;
        localStorage.setItem("method", 3);
      }
    }
    
    if (local_methodContainer) {
      local_methodContainer.onclick = () => {
        local_methodContainer.classList.add('active');
        mail_methodContainer.classList.remove('active');
        pickup_methodContainer.classList.remove('active');
        inputPostalModal.style.display = 'block';
        document.getElementById('address1').checked = false;
		    document.getElementById('address2').checked = false;
        localStorage.setItem("method", 1);
      }
    }
    
    if (pickup_methodContainer) {
      pickup_methodContainer.onclick = () => {
        local_methodContainer.classList.remove('active');
        mail_methodContainer.classList.remove('active');
        pickup_methodContainer.classList.add('active');
        inputPostalModal.style.display = 'none';
        document.querySelector('.post_alert_p').style.display = 'none';
        localStorage.setItem("method", 2);
      }
    }
    
    if (mail_methodContainer) {
      mail_methodContainer.onclick = () => {
        local_methodContainer.classList.remove('active');
        mail_methodContainer.classList.add('active');
        pickup_methodContainer.classList.remove('active');
        inputPostalModal.style.display = 'none';
        document.querySelector('.post_alert_p').style.display = 'none';
        document.getElementById('address1').checked = false;
		    document.getElementById('address2').checked = false;
        localStorage.setItem("method", 3);
      }
    }

	if (document.getElementById('change_code_p')) {
      document.getElementById('change_code_p').onclick = () => {
        openMethodDropdown()
      }
    }
    
    if (document.getElementById('change_postal')) {
      document.getElementById('change_postal').onclick = () => {
        openMethodDropdown()
      }
    }
    
    if (document.querySelector('.close_tip_modal_p')) {
      document.querySelector('.close_tip_modal_p').onclick = () => {
        document.querySelector('.tipModal_container_p').classList.remove('active');
      }
    }
    
    if (document.getElementById('tip_modal_p')) {
      document.getElementById('tip_modal_p').onclick = () => {
        document.querySelector('.tipModal_container_p').classList.add('active');
      }
    }
    
    if (document.querySelector('.close_method_dropdown_p')) {
      document.querySelector('.close_method_dropdown_p').onclick = () => {
        closeMethodDropdown();
      }
    }
    
    if (document.querySelector('.close_method_modal_p')) {
      document.querySelector('.close_method_modal_p').onclick = () => {
        closeMethodModal();
      }
    }    

    function stickHeader() {
      document.querySelector('.header__postal_code_bar_p').classList.add('active');
      if (document.getElementById('template-product') && document.querySelector('.product__page .form__wrapper.is-sticky.with-sticky-header')) {
        document.querySelector('.product__page .form__wrapper.is-sticky.with-sticky-header').style.top = '125px';
      }
      if (document.querySelector('.template-index') == undefined) {
        document.getElementById('MainContent').style.marginTop = '29px';
      }
    }

    function closeMethodDropdown() {
      methodDropdownContainer.classList.remove("active");
    }
    
    function closeMethodModal() {
      document.querySelector(".methodModal_container_p").classList.remove("active");
    }
    
    function openMethodDropdown() {
      switch(localStorage.getItem("method")) {
        case "1":
          local_methodContainerDrop.classList.add('active');
          inputPostalDropdown.classList.remove('active');
          break;
        case "2":
          pickup_methodContainerDrop.classList.add('active');
          if (localStorage.getItem("pickup") == 1) {
            document.getElementById('address3').checked = true;
          }
          else if (localStorage.getItem("pickup") == 2) {
            document.getElementById('address4').checked = true;
          }
          break;
        case "3":
          mail_methodContainerDrop.classList.add('active');
          break;
      }
      methodDropdownContainer.classList.add("active");
    }
 
    function openMethodModal() {
      if (methodModalContainer) {
        methodModalContainer.classList.add("active");
      }
    }
	}
			
})();