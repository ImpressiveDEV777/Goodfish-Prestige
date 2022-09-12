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
				
		let initialosition = parseFloat(header_settings['stickyPosition']);
		
		if (initialosition > 0 ) {
			
			if ( header_settings['stickyPositionHome'] == false || b.classList.contains('template-index') ) {
			
				//add a couple classes to the body so we can alter how section heights are calculated if needed
				b.classList.add('header-initial-position-changed');
				
				if (!Shopify.designMode) { //Only fire if we're not in the editor, messes with the editor's UI, need to fix TODO (see commented code below)
					mainEl.childNodes[ initialosition ].after(sticky_header_wrapper);
				}
				
			}
		}
		
		
	}
	
	// d.addEventListener('shopify:section:load', function(ev) {
    // 	console.log(1)
	// });
	
	//const first_section = d.getElementById('shopify-section-template--15268170924228__163952370021aefa00');

	// Method stuff goes below
	var perishableZones = document.querySelector('.Method__Data').dataset.localDeliveryZones.split(',');

  var currentPostal = document.getElementById('Current__Postal');
  var containerBtn = document.querySelector('.ProductForm__BuyButtons .ProductForm__AddToCart');
  var alertContainer = document.querySelector('.DeliveryAlert__Container');
  var methodModalContainer = document.querySelector(".MethodModal__Container");
  var methodDropdownContainer = document.querySelector("#MethodDropdown");
  var local_methodContainer = document.querySelector("#MethodModal .Method__Selector .Method__Local");
  var pickup_methodContainer = document.querySelector("#MethodModal .Method__Selector .Method__Pickup");
  var mail_methodContainer = document.querySelector("#MethodModal .Method__Selector .Method__Mail");
  var local_methodContainerDrop = document.querySelector("#MethodDropdown .Method__Selector .Method__Local");
  var pickup_methodContainerDrop = document.querySelector("#MethodDropdown .Method__Selector .Method__Pickup");
  var mail_methodContainerDrop = document.querySelector("#MethodDropdown .Method__Selector .Method__Mail");
	var alertMethod = document.querySelector('#MethodDropdown .PostAlert__d');
  var inputPostalModal = document.getElementById('Postalcode');
  var inputPostalDropdown = document.getElementById('Postalcode__Drop');
	var dataContainer = document.querySelector('.Method__Data');
  var checkoutBtn = document.querySelector('.Cart__Checkout');
  var cartItems = document.querySelector('.Cart__ItemList .CartItem');
  var M1T = dataContainer.dataset.m1t;
  var M2T = dataContainer.dataset.m2t;
  var MSA = dataContainer.dataset.msa;

	methodDropdownContainer.querySelector('h2').innerHTML = dataContainer.dataset.mt;
	local_methodContainerDrop.querySelector('h4').innerHTML = M1T;
	local_methodContainerDrop.querySelector('span').innerHTML = '(' + dataContainer.dataset.m1d + ')';
	alertMethod.innerHTML = dataContainer.dataset.m1em;
	pickup_methodContainerDrop.querySelector('h4').innerHTML = M2T;
	pickup_methodContainerDrop.querySelector('[data-m2d1]').innerHTML = '(' + dataContainer.dataset.m2d1 + ')';
	pickup_methodContainerDrop.querySelector('[data-m2d2]').innerHTML = '(' + dataContainer.dataset.m2d2 + ')';
	mail_methodContainerDrop.querySelector('h4').innerHTML = dataContainer.dataset.m3t;
	// mail_methodContainerDrop.querySelector('span').innerText = dataContainer.dataset.m3d;
	if (alertContainer) {
		alertContainer.querySelector('.Alert__Message').innerHTML = dataContainer.dataset.se;
	}
  
  // window.onresize = () => {
  //   if (localStorage.getItem('method')) {
  //     document.getElementById('MainContent').style.marginTop = '0';
  //   }
  // }
  
  window.onload = function() {
    var mthod = localStorage.getItem("method");
    
    if (mthod == '' || mthod == null) {
      openMethodModal();
    }
    else {
      if (document.querySelector('.template-product')) {
        if (alertContainer && mthod == '3') {
          alertContainer.style.display = 'block';
          containerBtn.style.display = 'none';
        }
      }
      // document.querySelectorAll('[data-quick-add-label]').forEach((el) => {
      //   el.querySelector('small:first-child').innerText = "quick add";
      // });
      var method, data;
      switch (localStorage.getItem("method")) {
        case '1':
          method = M1T;
          data = localStorage.getItem("postalcode");
          inputPostalDropdown.value = data;
          inputPostalDropdown.classList.add('active');
          inputPostalDropdown.style.display = 'block';
          break;
        case '2':
          method = "Delivery Method";
          data = M2T;
          break;
        case '3':
          method = "Delivery Method";
          data = 'Shipping';
          if (checkoutBtn) {
            cartItems.forEach((el) => {
              if (el.dataset.shipping != 1) {
                checkoutBtn.style.display = 'none';
              }
            });
          }
          break;
      }
      currentPostal.innerHTML = method + ": <span>" + data + "</span>";
      stickHeader();
    }

    if (document.getElementById('MethodDropdown__Confirm')) {
      document.getElementById('MethodDropdown__Confirm').onclick = () => {        
        var mthd = localStorage.getItem("method"), dtad;
        
        if (mthd == '' || mthd == null) {
          alert(MSA);
          return;
        }
        
        // document.querySelectorAll('[data-quick-add-label]').forEach( el => {
        //   el.querySelector('small:first-child').innerText = "quick add";
        // });
        
        switch (mthd) {
          case '1':
            dtad = inputPostalDropdown.value;
            var zip = dtad.slice(0, 3);
            if (perishableZones.join(',').toLowerCase().split(',').indexOf(zip.toLowerCase()) == -1){
              alertMethod.style.display = 'block';
              return;
            }
            localStorage.setItem('postalcode', dtad);
            alertMethod.style.display = 'none';
            currentPostal.innerHTML = M1T + ": <span>" + dtad + "</span>";
            if (alertContainer) {
              alertContainer.style.display = 'none';
              containerBtn.style.display = 'block';
            }
            stickHeader();
            methodDropdownContainer.classList.remove('active');
            if (checkoutBtn) {
              checkoutBtn.style.display = 'block';
            }
            break;
          case '2':
						localStorage.setItem("postalcode", M2T);
            methodDropdownContainer.classList.remove('active');
            if (alertContainer) {
              alertContainer.style.display = 'none';
              containerBtn.style.display = 'block';
            }
            currentPostal.innerHTML = "Delivery Method: <span>" + M2T + "</span>";
            stickHeader();
            if (checkoutBtn) {
              checkoutBtn.style.display = 'block';
            }
            break;
          case '3':
            localStorage.setItem("postalcode", "Shipping");
            // document.querySelectorAll('[data-quick-add-label]').forEach( el => {
            //   if (el.dataset.tag != "Shipping") {
            //     el.querySelector('small:first-child').innerText = QAE;
            //   }
            // });
            methodDropdownContainer.classList.remove('active');
            currentPostal.innerHTML = "Delivery Method: <span>Shipping</span>";
            if (alertContainer) {
              alertContainer.style.display = 'block';
              containerBtn.style.display = 'none';  
            }
            stickHeader();
            if (checkoutBtn) {
              cartItems.forEach((el) => {
                if (el.dataset.shipping != 1) {
                  checkoutBtn.style.display = 'none';
                }
              });
            }
            break;
        }
      }
    }
    
    if (document.getElementById('Method__Confirm')) {
      document.getElementById('Method__Confirm').onclick = () => {
        var mth = localStorage.getItem("method");
        if (mth == '' || mth == null) {
          alert(MSA);
          return;
        }
        switch (mth) {
          case '1':
            var dta = document.querySelector('#MethodModal #Postalcode').value;
            localStorage.setItem('postalcode', dta);
            var zip = dta.slice(0, 3);
            if (perishableZones.join(',').toLowerCase().split(',').indexOf(zip.toLowerCase()) == -1){
              document.querySelector('.PostAlert').style.display = 'block';
              return;
            }
            document.querySelector('.PostAlert').style.display = 'none';
            currentPostal.innerHTML = M1T + ": <span>" + dta + "</span>";
            if (alertContainer) {
              alertContainer.style.display = 'none';
              containerBtn.style.block = 'block';
            }
            inputPostalDropdown.value = document.querySelector('#MethodModal #Postalcode').value;
            inputPostalDropdown.classList.add('active');
            inputPostalDropdown.style.display = 'block';
            stickHeader();
            methodModalContainer.classList.remove('active');
            break;
          case '2':
            methodModalContainer.classList.remove('active');
            if (alertContainer) {
              alertContainer.style.display = 'none';
              containerBtn.style.display = 'block';
            }
            currentPostal.innerHTML = "Delivery Method: <span>" + M2T + "</span>";
            stickHeader();
            break;
          case '3':
            localStorage.setItem("postalcode", "Shipping");
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
        localStorage.setItem("method", 1);
      }
    }
    
    if (pickup_methodContainerDrop) {
      pickup_methodContainerDrop.onclick = () => {
        local_methodContainerDrop.classList.remove('active');
        mail_methodContainerDrop.classList.remove('active');
        pickup_methodContainerDrop.classList.add('active');
        inputPostalDropdown.classList.add('active');
        alertMethod.style.display = 'none';
        localStorage.setItem("method", 2);
      }
    }
    
    if (mail_methodContainerDrop) {
      mail_methodContainerDrop.onclick = () => {
        local_methodContainerDrop.classList.remove('active');
        pickup_methodContainerDrop.classList.remove('active');
        mail_methodContainerDrop.classList.add('active');
        alertMethod.style.display = 'none';
        inputPostalDropdown.classList.add('active');
        localStorage.setItem("method", 3);
      }
    }
    
    if (local_methodContainer) {
      local_methodContainer.onclick = () => {
        local_methodContainer.classList.add('active');
        mail_methodContainer.classList.remove('active');
        pickup_methodContainer.classList.remove('active');
        inputPostalModal.style.display = 'block';
        localStorage.setItem("method", 1);
      }
    }
    
    if (pickup_methodContainer) {
      pickup_methodContainer.onclick = () => {
        local_methodContainer.classList.remove('active');
        mail_methodContainer.classList.remove('active');
        pickup_methodContainer.classList.add('active');
        inputPostalModal.style.display = 'none';
        document.querySelector('.PostAlert').style.display = 'none';
        localStorage.setItem("method", 2);
      }
    }
    
    if (mail_methodContainer) {
      mail_methodContainer.onclick = () => {
        local_methodContainer.classList.remove('active');
        mail_methodContainer.classList.add('active');
        pickup_methodContainer.classList.remove('active');
        inputPostalModal.style.display = 'none';
        document.querySelector('.PostAlert').style.display = 'none';
        localStorage.setItem("method", 3);
      }
    }

	if (document.getElementById('Change__Code')) {
      document.getElementById('Change__Code').onclick = () => {
        openMethodDropdown()
      }
    }
    
    if (document.getElementById('Change__Postal')) {
      document.getElementById('Change__Postal').onclick = () => {
        openMethodDropdown()
      }
    }
    
    // if (document.querySelector('.close_tip_modal')) {
    //   document.querySelector('.close_tip_modal').onclick = () => {
    //     document.querySelector('.tipModal_container').classList.remove('active');
    //   }
    // }
    
    // if (document.getElementById('tip_modal')) {
    //   document.getElementById('tip_modal').onclick = () => {
    //     document.querySelector('.tipModal_container').classList.add('active');
    //   }
    // }
    
    if (document.querySelector('.MethodDropdown__Close')) {
      document.querySelector('.MethodDropdown__Close').onclick = () => {
        closeMethodDropdown();
      }
    }
    
    if (document.querySelector('.MethodModal__Close')) {
      document.querySelector('.MethodModal__Close').onclick = () => {
        closeMethodModal();
      }
    }    

    function stickHeader() {
      document.querySelector('.Postalcode__Bar').classList.add('active');
      // if (document.getElementById('template-product') && document.querySelector('.product_age .form__wrapper.is-sticky.with-sticky-header')) {
      //   document.querySelector('.product_age .form__wrapper.is-sticky.with-sticky-header').style.top = '125px';
      // }
      // if (document.querySelector('.template-index') == undefined) {
      //   document.getElementById('MainContent').style.marginTop = '29px';
      // }
    }

    function closeMethodDropdown() {
      methodDropdownContainer.classList.remove("active");
    }
    
    function closeMethodModal() {
      methodModalContainer.classList.remove("active");
    }
    
    function openMethodDropdown() {
      switch(localStorage.getItem("method")) {
        case "1":
          local_methodContainerDrop.classList.add('active');
          inputPostalDropdown.classList.remove('active');
          break;
        case "2":
          pickup_methodContainerDrop.classList.add('active');
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