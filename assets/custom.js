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
			
})();