/**
 * Opens and closes accordion items.
 */
import { getContext, getElement, store } from '@wordpress/interactivity';

/**
 * Dispatches a bubbling `accordion:item:open` or `accordion:item:close` event
 * from the toggle button of an item, or from the given element when the
 * button is missing.
 *
 * @param {Object}      context  Item context.
 * @param {Element}     fallback Element that dispatches the event without a button.
 * @param {string|null} [button] ID of the toggle button.
 */
function dispatchItemEvent( context, fallback, button = null ) {
	const target =
		( button && window.document.getElementById( button ) ) || fallback;

	target.dispatchEvent(
		new window.CustomEvent(
			context.isOpen ? 'accordion:item:open' : 'accordion:item:close',
			{ bubbles: true, detail: { id: context.id } }
		)
	);
}

/**
 * Opens the item of the current context, unless it is already open.
 *
 * @param {Element} fallback Element that dispatches the event without a button.
 * @return {boolean} Whether the item changed from closed to open.
 */
function open( fallback ) {
	const context = getContext();

	if ( context.isOpen ) {
		return false;
	}

	context.isOpen = true;
	dispatchItemEvent( context, fallback, `${ context.id }-button` );

	return true;
}

store( 'outstand/accordion', {
	state: {
		/**
		 * Hides the panel of a closed item with `until-found`, so find-in-page
		 * and fragment links reach its content.
		 *
		 * @return {string|null} `until-found` for a closed item, `null` for an open one.
		 */
		get isHidden() {
			return getContext().isOpen ? null : 'until-found';
		},
	},
	actions: {
		/**
		 * Opens or closes the item of the clicked header, then dispatches
		 * `accordion:item:open` or `accordion:item:close` from the button.
		 */
		toggle() {
			const context = getContext();
			const { ref } = getElement();

			context.isOpen = ! context.isOpen;
			dispatchItemEvent( context, ref );
		},

		/**
		 * Opens the item when the browser reveals its hidden panel, such as
		 * after find-in-page matches text inside it.
		 */
		openItem() {
			const { ref } = getElement();

			open( ref );
		},
	},
	callbacks: {
		/**
		 * Opens the item when the URL hash targets an element inside its panel,
		 * then scrolls to that element.
		 */
		openByHash() {
			const { id } = getContext();
			const hash = window.location.hash.slice( 1 );

			if ( ! hash || ! id ) {
				return;
			}

			let targetId = hash;

			try {
				targetId = decodeURIComponent( hash );
			} catch {
				// Keep the raw hash when it is not valid percent-encoding.
			}

			const target = window.document.getElementById( targetId );
			const panel = window.document.getElementById( `${ id }-panel` );

			if ( ! target || ! panel || ! panel.contains( target ) ) {
				return;
			}

			const { ref } = getElement();

			if ( open( ref ) ) {
				window.setTimeout( () => target.scrollIntoView(), 0 );
			}
		},
	},
} );
