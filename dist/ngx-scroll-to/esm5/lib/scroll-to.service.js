import { __assign, __decorate, __param } from "tslib";
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ScrollToAnimation } from './scroll-to-animation';
import { DEFAULTS, isElementRef, isNativeElement, isNumber, isString, isWindow, stripHash } from './scroll-to-helpers';
import { ReplaySubject, throwError } from 'rxjs';
/**
 * The Scroll To Service handles starting, interrupting
 * and ending the actual Scroll Animation. It provides
 * some utilities to find the proper HTML Element on a
 * given page to setup Event Listeners and calculate
 * distances for the Animation.
 */
var ScrollToService = /** @class */ (function () {
    /**
     * Construct and setup required paratemeters.
     *
     * @param document         A Reference to the Document
     * @param platformId       Angular Platform ID
     */
    function ScrollToService(document, platformId) {
        this.document = document;
        this.platformId = platformId;
        this.interruptiveEvents = ['mousewheel', 'DOMMouseScroll', 'touchstart'];
    }
    /**
     * Target an Element to scroll to. Notice that the `TimeOut` decorator
     * ensures the executing to take place in the next Angular lifecycle.
     * This allows for scrolling to elements that are e.g. initially hidden
     * by means of `*ngIf`, but ought to be scrolled to eventually.
     *
     * @todo type 'any' in Observable should become custom type like 'ScrollToEvent' (base class), see issue comment:
     *  - https://github.com/nicky-lenaers/ngx-scroll-to/issues/10#issuecomment-317198481
     *
     * @param options         Configuration Object
     * @returns               Observable
     */
    ScrollToService.prototype.scrollTo = function (options) {
        if (!isPlatformBrowser(this.platformId)) {
            return new ReplaySubject().asObservable();
        }
        return this.start(options);
    };
    /**
     * Start a new Animation.
     *
     * @todo Emit proper events from subscription
     *
     * @param options         Configuration Object
     * @returns               Observable
     */
    ScrollToService.prototype.start = function (options) {
        var _this = this;
        // Merge config with default values
        var mergedConfigOptions = __assign(__assign({}, DEFAULTS), options);
        if (this.animation) {
            this.animation.stop();
        }
        var targetNode = this.getNode(mergedConfigOptions.target);
        if (mergedConfigOptions.target && !targetNode) {
            return throwError('Unable to find Target Element');
        }
        var container = this.getContainer(mergedConfigOptions, targetNode);
        if (mergedConfigOptions.container && !container) {
            return throwError('Unable to find Container Element');
        }
        var listenerTarget = this.getListenerTarget(container) || window;
        var to = container ? container.getBoundingClientRect().top : 0;
        if (targetNode) {
            to = isWindow(listenerTarget) ?
                window.scrollY + targetNode.getBoundingClientRect().top :
                targetNode.getBoundingClientRect().top;
        }
        // Create Animation
        this.animation = new ScrollToAnimation(container, listenerTarget, isWindow(listenerTarget), to, mergedConfigOptions, isPlatformBrowser(this.platformId));
        var onInterrupt = function () { return _this.animation.stop(); };
        this.addInterruptiveEventListeners(listenerTarget, onInterrupt);
        // Start Animation
        var animation$ = this.animation.start();
        this.subscribeToAnimation(animation$, listenerTarget, onInterrupt);
        return animation$;
    };
    /**
     * Subscribe to the events emitted from the Scrolling
     * Animation. Events might be used for e.g. unsubscribing
     * once finished.
     *
     * @param animation$              The Animation Observable
     * @param listenerTarget          The Listener Target for events
     * @param onInterrupt             The handler for Interruptive Events
     * @returns                       Void
     */
    ScrollToService.prototype.subscribeToAnimation = function (animation$, listenerTarget, onInterrupt) {
        var _this = this;
        var subscription = animation$
            .subscribe(function () {
        }, function () {
        }, function () {
            _this.removeInterruptiveEventListeners(_this.interruptiveEvents, listenerTarget, onInterrupt);
            subscription.unsubscribe();
        });
    };
    /**
     * Get the container HTML Element in which
     * the scrolling should happen.
     *
     * @param options         The Merged Configuration Object
     * @param targetNode    the targeted HTMLElement
     */
    ScrollToService.prototype.getContainer = function (options, targetNode) {
        var container = null;
        if (options.container) {
            container = this.getNode(options.container, true);
        }
        else if (targetNode) {
            container = this.getFirstScrollableParent(targetNode);
        }
        return container;
    };
    /**
     * Add listeners for the Animation Interruptive Events
     * to the Listener Target.
     *
     * @param events            List of events to listen to
     * @param listenerTarget    Target to attach the listener on
     * @param handler           Handler for when the listener fires
     * @returns                 Void
     */
    ScrollToService.prototype.addInterruptiveEventListeners = function (listenerTarget, handler) {
        var _this = this;
        if (!listenerTarget) {
            listenerTarget = window;
        }
        this.interruptiveEvents
            .forEach(function (event) { return listenerTarget
            .addEventListener(event, handler, _this.supportPassive() ? { passive: true } : false); });
    };
    /**
     * Feature-detect support for passive event listeners.
     *
     * @returns       Whether or not passive event listeners are supported
     */
    ScrollToService.prototype.supportPassive = function () {
        var supportsPassive = false;
        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        }
        catch (e) {
        }
        return supportsPassive;
    };
    /**
     * Remove listeners for the Animation Interrupt Event from
     * the Listener Target. Specifying the correct handler prevents
     * memory leaks and makes the allocated memory available for
     * Garbage Collection.
     *
     * @param events            List of Interruptive Events to remove
     * @param listenerTarget    Target to attach the listener on
     * @param handler           Handler for when the listener fires
     * @returns                 Void
     */
    ScrollToService.prototype.removeInterruptiveEventListeners = function (events, listenerTarget, handler) {
        if (!listenerTarget) {
            listenerTarget = window;
        }
        events.forEach(function (event) { return listenerTarget.removeEventListener(event, handler); });
    };
    /**
     * Find the first scrollable parent Node of a given
     * Element. The DOM Tree gets searched upwards
     * to find this first scrollable parent. Parents might
     * be ignored by CSS styles applied to the HTML Element.
     *
     * @param nativeElement     The Element to search the DOM Tree upwards from
     * @returns                 The first scrollable parent HTML Element
     */
    ScrollToService.prototype.getFirstScrollableParent = function (nativeElement) {
        var style = window.getComputedStyle(nativeElement);
        var overflowRegex = /(auto|scroll|overlay)/;
        if (style.position === 'fixed') {
            return null;
        }
        var parent = nativeElement;
        while (parent.parentElement) {
            parent = parent.parentElement;
            style = window.getComputedStyle(parent);
            if (style.position === 'absolute'
                || style.overflow === 'hidden'
                || style.overflowY === 'hidden') {
                continue;
            }
            if (overflowRegex.test(style.overflow + style.overflowY)
                || parent.tagName === 'BODY') {
                return parent;
            }
        }
        return null;
    };
    /**
     * Get the Target Node to scroll to.
     *
     * @param id              The given ID of the node, either a string or
     *                        an element reference
     * @param allowBodyTag    Indicate whether or not the Document Body is
     *                        considered a valid Target Node
     * @returns               The Target Node to scroll to
     */
    ScrollToService.prototype.getNode = function (id, allowBodyTag) {
        if (allowBodyTag === void 0) { allowBodyTag = false; }
        var targetNode;
        if (isString(id)) {
            if (allowBodyTag && (id === 'body' || id === 'BODY')) {
                targetNode = this.document.body;
            }
            else {
                targetNode = this.document.getElementById(stripHash(id));
            }
        }
        else if (isNumber(id)) {
            targetNode = this.document.getElementById(String(id));
        }
        else if (isElementRef(id)) {
            targetNode = id.nativeElement;
        }
        else if (isNativeElement(id)) {
            targetNode = id;
        }
        return targetNode;
    };
    /**
     * Retrieve the Listener target. This Listener Target is used
     * to attach Event Listeners on. In case of the target being
     * the Document Body, we need the actual `window` to listen
     * for events.
     *
     * @param container           The HTML Container element
     * @returns                   The Listener Target to attach events on
     */
    ScrollToService.prototype.getListenerTarget = function (container) {
        if (!container) {
            return null;
        }
        return this.isDocumentBody(container) ? window : container;
    };
    /**
     * Test if a given HTML Element is the Document Body.
     *
     * @param element             The given HTML Element
     * @returns                   Whether or not the Element is the
     *                            Document Body Element
     */
    ScrollToService.prototype.isDocumentBody = function (element) {
        return element.tagName.toUpperCase() === 'BODY';
    };
    ScrollToService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
    ScrollToService = __decorate([
        Injectable(),
        __param(0, Inject(DOCUMENT)),
        __param(1, Inject(PLATFORM_ID))
    ], ScrollToService);
    return ScrollToService;
}());
export { ScrollToService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXRvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcGF1bHZtb3JlYXUvbmd4LXNjcm9sbC10by8iLCJzb3VyY2VzIjpbImxpYi9zY3JvbGwtdG8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUc5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkgsT0FBTyxFQUFjLGFBQWEsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFN0Q7Ozs7OztHQU1HO0FBRUg7SUFpQkU7Ozs7O09BS0c7SUFDSCx5QkFDNEIsUUFBYSxFQUNWLFVBQWU7UUFEbEIsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUNWLGVBQVUsR0FBVixVQUFVLENBQUs7UUFFNUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILGtDQUFRLEdBQVIsVUFBUyxPQUE4QjtRQUVyQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sSUFBSSxhQUFhLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUMzQztRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNLLCtCQUFLLEdB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QUFDLFFBQVE7Z0RBQ2YsTUFBTSxTQUFDLFdBQVc7O0lBekJWLGVBQWU7UUFEM0IsVUFBVSxFQUFFO1FBeUJSLFdBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ2hCLFdBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BekJYLGVBQWUsQ0FnVTNCO0lBQUQsc0JBQUM7Q0FBQSxBQWhVRCxJQWdVQztTQWhVWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgU2Nyb2xsVG9Db25maWdPcHRpb25zLCBTY3JvbGxUb0NvbmZpZ09wdGlvbnNUYXJnZXQsIFNjcm9sbFRvTGlzdGVuZXJUYXJnZXQsIFNjcm9sbFRvVGFyZ2V0IH0gZnJvbSAnLi9zY3JvbGwtdG8tY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgeyBTY3JvbGxUb0FuaW1hdGlvbiB9IGZyb20gJy4vc2Nyb2xsLXRvLWFuaW1hdGlvbic7XG5pbXBvcnQgeyBERUZBVUxUUywgaXNFbGVtZW50UmVmLCBpc05hdGl2ZUVsZW1lbnQsIGlzTnVtYmVyLCBpc1N0cmluZywgaXNXaW5kb3csIHN0cmlwSGFzaCB9IGZyb20gJy4vc2Nyb2xsLXRvLWhlbHBlcnMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgUmVwbGF5U3ViamVjdCwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIFRoZSBTY3JvbGwgVG8gU2VydmljZSBoYW5kbGVzIHN0YXJ0aW5nLCBpbnRlcnJ1cHRpbmdcbiAqIGFuZCBlbmRpbmcgdGhlIGFjdHVhbCBTY3JvbGwgQW5pbWF0aW9uLiBJdCBwcm92aWRlc1xuICogc29tZSB1dGlsaXRpZXMgdG8gZmluZCB0aGUgcHJvcGVyIEhUTUwgRWxlbWVudCBvbiBhXG4gKiBnaXZlbiBwYWdlIHRvIHNldHVwIEV2ZW50IExpc3RlbmVycyBhbmQgY2FsY3VsYXRlXG4gKiBkaXN0YW5jZXMgZm9yIHRoZSBBbmltYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTY3JvbGxUb1NlcnZpY2Uge1xuXG4gIC8qKlxuICAgKiBUaGUgYW5pbWF0aW9uIHRoYXQgcHJvdmlkZXMgdGhlIHNjcm9sbGluZ1xuICAgKiB0byBoYXBwZW4gc21vb3RobHkgb3ZlciB0aW1lLiBEZWZpbmluZyBpdCBoZXJlXG4gICAqIGFsbG93cyBmb3IgdXNhZ2Ugb2YgZS5nLiBgc3RhcnRgIGFuZCBgc3RvcGBcbiAgICogbWV0aG9kcyB3aXRoaW4gdGhpcyBBbmd1bGFyIFNlcnZpY2UuXG4gICAqL1xuICBwcml2YXRlIGFuaW1hdGlvbjogU2Nyb2xsVG9BbmltYXRpb247XG5cbiAgLyoqXG4gICAqIEludGVycnVwdGl2ZSBFdmVudHMgYWxsb3cgdG8gc2Nyb2xsaW5nIGFuaW1hdGlvblxuICAgKiB0byBiZSBpbnRlcnJ1cHRlZCBiZWZvcmUgaXQgaXMgZmluaXNoZWQuIFRoZSBsaXN0XG4gICAqIG9mIEludGVycnVwdGl2ZSBFdmVudHMgcmVwcmVzZW50cyB0aG9zZS5cbiAgICovXG4gIHByaXZhdGUgaW50ZXJydXB0aXZlRXZlbnRzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGFuZCBzZXR1cCByZXF1aXJlZCBwYXJhdGVtZXRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSBkb2N1bWVudCAgICAgICAgIEEgUmVmZXJlbmNlIHRvIHRoZSBEb2N1bWVudFxuICAgKiBAcGFyYW0gcGxhdGZvcm1JZCAgICAgICBBbmd1bGFyIFBsYXRmb3JtIElEXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnksXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnlcbiAgKSB7XG4gICAgdGhpcy5pbnRlcnJ1cHRpdmVFdmVudHMgPSBbJ21vdXNld2hlZWwnLCAnRE9NTW91c2VTY3JvbGwnLCAndG91Y2hzdGFydCddO1xuICB9XG5cbiAgLyoqXG4gICAqIFRhcmdldCBhbiBFbGVtZW50IHRvIHNjcm9sbCB0by4gTm90aWNlIHRoYXQgdGhlIGBUaW1lT3V0YCBkZWNvcmF0b3JcbiAgICogZW5zdXJlcyB0aGUgZXhlY3V0aW5nIHRvIHRha2UgcGxhY2UgaW4gdGhlIG5leHQgQW5ndWxhciBsaWZlY3ljbGUuXG4gICAqIFRoaXMgYWxsb3dzIGZvciBzY3JvbGxpbmcgdG8gZWxlbWVudHMgdGhhdCBhcmUgZS5nLiBpbml0aWFsbHkgaGlkZGVuXG4gICAqIGJ5IG1lYW5zIG9mIGAqbmdJZmAsIGJ1dCBvdWdodCB0byBiZSBzY3JvbGxlZCB0byBldmVudHVhbGx5LlxuICAgKlxuICAgKiBAdG9kbyB0eXBlICdhbnknIGluIE9ic2VydmFibGUgc2hvdWxkIGJlY29tZSBjdXN0b20gdHlwZSBsaWtlICdTY3JvbGxUb0V2ZW50JyAoYmFzZSBjbGFzcyksIHNlZSBpc3N1ZSBjb21tZW50OlxuICAgKiAgLSBodHRwczovL2dpdGh1Yi5jb20vbmlja3ktbGVuYWVycy9uZ3gtc2Nyb2xsLXRvL2lzc3Vlcy8xMCNpc3N1ZWNvbW1lbnQtMzE3MTk4NDgxXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zICAgICAgICAgQ29uZmlndXJhdGlvbiBPYmplY3RcbiAgICogQHJldHVybnMgICAgICAgICAgICAgICBPYnNlcnZhYmxlXG4gICAqL1xuICBzY3JvbGxUbyhvcHRpb25zOiBTY3JvbGxUb0NvbmZpZ09wdGlvbnMpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgaWYgKCFpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGxheVN1YmplY3QoKS5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFydChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhIG5ldyBBbmltYXRpb24uXG4gICAqXG4gICAqIEB0b2RvIEVtaXQgcHJvcGVyIGV2ZW50cyBmcm9tIHN1YnNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAgICAgICAgIENvbmZpZ3VyYXRpb24gT2JqZWN0XG4gICAqIEByZXR1cm5zICAgICAgICAgICAgICAgT2JzZXJ2YWJsZVxuICAgKi9cbiAgcHJpdmF0ZSBzdGFydChvcHRpb25zOiBTY3JvbGxUb0NvbmZpZ09wdGlvbnMpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuXG4gICAgLy8gTWVyZ2UgY29uZmlnIHdpdGggZGVmYXVsdCB2YWx1ZXNcbiAgICBjb25zdCBtZXJnZWRDb25maWdPcHRpb25zID0ge1xuICAgICAgLi4uREVGQVVMVFMgYXMgU2Nyb2xsVG9Db25maWdPcHRpb25zLFxuICAgICAgLi4ub3B0aW9uc1xuICAgIH0gYXMgU2Nyb2xsVG9Db25maWdPcHRpb25zVGFyZ2V0O1xuXG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uKSB7XG4gICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IHRoaXMuZ2V0Tm9kZShtZXJnZWRDb25maWdPcHRpb25zLnRhcmdldCk7XG4gICAgaWYgKG1lcmdlZENvbmZpZ09wdGlvbnMudGFyZ2V0ICYmICF0YXJnZXROb2RlKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignVW5hYmxlIHRvIGZpbmQgVGFyZ2V0IEVsZW1lbnQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXI6IEhUTUxFbGVtZW50ID0gdGhpcy5nZXRDb250YWluZXIobWVyZ2VkQ29uZmlnT3B0aW9ucywgdGFyZ2V0Tm9kZSk7XG4gICAgaWYgKG1lcmdlZENvbmZpZ09wdGlvbnMuY29udGFpbmVyICYmICFjb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdVbmFibGUgdG8gZmluZCBDb250YWluZXIgRWxlbWVudCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3RlbmVyVGFyZ2V0ID0gdGhpcy5nZXRMaXN0ZW5lclRhcmdldChjb250YWluZXIpIHx8IHdpbmRvdztcblxuICAgIGxldCB0byA9IGNvbnRhaW5lciA/IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgOiAwO1xuXG4gICAgaWYgKHRhcmdldE5vZGUpIHtcbiAgICAgIHRvID0gaXNXaW5kb3cobGlzdGVuZXJUYXJnZXQpID9cbiAgICAgICAgd2luZG93LnNjcm9sbFkgKyB0YXJnZXROb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCA6XG4gICAgICAgIHRhcmdldE5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBBbmltYXRpb25cbiAgICB0aGlzLmFuaW1hdGlvbiA9IG5ldyBTY3JvbGxUb0FuaW1hdGlvbihcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIGxpc3RlbmVyVGFyZ2V0LFxuICAgICAgaXNXaW5kb3cobGlzdGVuZXJUYXJnZXQpLFxuICAgICAgdG8sXG4gICAgICBtZXJnZWRDb25maWdPcHRpb25zLFxuICAgICAgaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKVxuICAgICk7XG4gICAgY29uc3Qgb25JbnRlcnJ1cHQgPSAoKSA9PiB0aGlzLmFuaW1hdGlvbi5zdG9wKCk7XG4gICAgdGhpcy5hZGRJbnRlcnJ1cHRpdmVFdmVudExpc3RlbmVycyhsaXN0ZW5lclRhcmdldCwgb25JbnRlcnJ1cHQpO1xuXG4gICAgLy8gU3RhcnQgQW5pbWF0aW9uXG4gICAgY29uc3QgYW5pbWF0aW9uJCA9IHRoaXMuYW5pbWF0aW9uLnN0YXJ0KCk7XG4gICAgdGhpcy5zdWJzY3JpYmVUb0FuaW1hdGlvbihhbmltYXRpb24kLCBsaXN0ZW5lclRhcmdldCwgb25JbnRlcnJ1cHQpO1xuXG4gICAgcmV0dXJuIGFuaW1hdGlvbiQ7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIHRvIHRoZSBldmVudHMgZW1pdHRlZCBmcm9tIHRoZSBTY3JvbGxpbmdcbiAgICogQW5pbWF0aW9uLiBFdmVudHMgbWlnaHQgYmUgdXNlZCBmb3IgZS5nLiB1bnN1YnNjcmliaW5nXG4gICAqIG9uY2UgZmluaXNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSBhbmltYXRpb24kICAgICAgICAgICAgICBUaGUgQW5pbWF0aW9uIE9ic2VydmFibGVcbiAgICogQHBhcmFtIGxpc3RlbmVyVGFyZ2V0ICAgICAgICAgIFRoZSBMaXN0ZW5lciBUYXJnZXQgZm9yIGV2ZW50c1xuICAgKiBAcGFyYW0gb25JbnRlcnJ1cHQgICAgICAgICAgICAgVGhlIGhhbmRsZXIgZm9yIEludGVycnVwdGl2ZSBFdmVudHNcbiAgICogQHJldHVybnMgICAgICAgICAgICAgICAgICAgICAgIFZvaWRcbiAgICovXG4gIHByaXZhdGUgc3Vic2NyaWJlVG9BbmltYXRpb24oXG4gICAgYW5pbWF0aW9uJDogT2JzZXJ2YWJsZTxhbnk+LFxuICAgIGxpc3RlbmVyVGFyZ2V0OiBTY3JvbGxUb0xpc3RlbmVyVGFyZ2V0LFxuICAgIG9uSW50ZXJydXB0OiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0XG4gICkge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGFuaW1hdGlvbiRcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVJbnRlcnJ1cHRpdmVFdmVudExpc3RlbmVycyh0aGlzLmludGVycnVwdGl2ZUV2ZW50cywgbGlzdGVuZXJUYXJnZXQsIG9uSW50ZXJydXB0KTtcbiAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvbnRhaW5lciBIVE1MIEVsZW1lbnQgaW4gd2hpY2hcbiAgICogdGhlIHNjcm9sbGluZyBzaG91bGQgaGFwcGVuLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAgICAgICAgIFRoZSBNZXJnZWQgQ29uZmlndXJhdGlvbiBPYmplY3RcbiAgICogQHBhcmFtIHRhcmdldE5vZGUgICAgdGhlIHRhcmdldGVkIEhUTUxFbGVtZW50XG4gICAqL1xuICBwcml2YXRlIGdldENvbnRhaW5lcihvcHRpb25zOiBTY3JvbGxUb0NvbmZpZ09wdGlvbnMsIHRhcmdldE5vZGU6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQgfCBudWxsIHtcblxuICAgIGxldCBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgICBpZiAob3B0aW9ucy5jb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lciA9IHRoaXMuZ2V0Tm9kZShvcHRpb25zLmNvbnRhaW5lciwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXROb2RlKSB7XG4gICAgICBjb250YWluZXIgPSB0aGlzLmdldEZpcnN0U2Nyb2xsYWJsZVBhcmVudCh0YXJnZXROb2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBsaXN0ZW5lcnMgZm9yIHRoZSBBbmltYXRpb24gSW50ZXJydXB0aXZlIEV2ZW50c1xuICAgKiB0byB0aGUgTGlzdGVuZXIgVGFyZ2V0LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnRzICAgICAgICAgICAgTGlzdCBvZiBldmVudHMgdG8gbGlzdGVuIHRvXG4gICAqIEBwYXJhbSBsaXN0ZW5lclRhcmdldCAgICBUYXJnZXQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lciBvblxuICAgKiBAcGFyYW0gaGFuZGxlciAgICAgICAgICAgSGFuZGxlciBmb3Igd2hlbiB0aGUgbGlzdGVuZXIgZmlyZXNcbiAgICogQHJldHVybnMgICAgICAgICAgICAgICAgIFZvaWRcbiAgICovXG4gIHByaXZhdGUgYWRkSW50ZXJydXB0aXZlRXZlbnRMaXN0ZW5lcnMoXG4gICAgbGlzdGVuZXJUYXJnZXQ6IFNjcm9sbFRvTGlzdGVuZXJUYXJnZXQsXG4gICAgaGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCk6IHZvaWQge1xuXG4gICAgaWYgKCFsaXN0ZW5lclRhcmdldCkge1xuICAgICAgbGlzdGVuZXJUYXJnZXQgPSB3aW5kb3c7XG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnJ1cHRpdmVFdmVudHNcbiAgICAgIC5mb3JFYWNoKGV2ZW50ID0+IGxpc3RlbmVyVGFyZ2V0XG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCB0aGlzLnN1cHBvcnRQYXNzaXZlKCkgPyB7cGFzc2l2ZTogdHJ1ZX0gOiBmYWxzZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZlYXR1cmUtZGV0ZWN0IHN1cHBvcnQgZm9yIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBAcmV0dXJucyAgICAgICBXaGV0aGVyIG9yIG5vdCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycyBhcmUgc3VwcG9ydGVkXG4gICAqL1xuICBwcml2YXRlIHN1cHBvcnRQYXNzaXZlKCk6IGJvb2xlYW4ge1xuXG4gICAgbGV0IHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0UGFzc2l2ZScsIG51bGwsIG9wdHMpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Rlc3RQYXNzaXZlJywgbnVsbCwgb3B0cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cblxuICAgIHJldHVybiBzdXBwb3J0c1Bhc3NpdmU7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVycyBmb3IgdGhlIEFuaW1hdGlvbiBJbnRlcnJ1cHQgRXZlbnQgZnJvbVxuICAgKiB0aGUgTGlzdGVuZXIgVGFyZ2V0LiBTcGVjaWZ5aW5nIHRoZSBjb3JyZWN0IGhhbmRsZXIgcHJldmVudHNcbiAgICogbWVtb3J5IGxlYWtzIGFuZCBtYWtlcyB0aGUgYWxsb2NhdGVkIG1lbW9yeSBhdmFpbGFibGUgZm9yXG4gICAqIEdhcmJhZ2UgQ29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50cyAgICAgICAgICAgIExpc3Qgb2YgSW50ZXJydXB0aXZlIEV2ZW50cyB0byByZW1vdmVcbiAgICogQHBhcmFtIGxpc3RlbmVyVGFyZ2V0ICAgIFRhcmdldCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIG9uXG4gICAqIEBwYXJhbSBoYW5kbGVyICAgICAgICAgICBIYW5kbGVyIGZvciB3aGVuIHRoZSBsaXN0ZW5lciBmaXJlc1xuICAgKiBAcmV0dXJucyAgICAgICAgICAgICAgICAgVm9pZFxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVJbnRlcnJ1cHRpdmVFdmVudExpc3RlbmVycyhcbiAgICBldmVudHM6IHN0cmluZ1tdLFxuICAgIGxpc3RlbmVyVGFyZ2V0OiBTY3JvbGxUb0xpc3RlbmVyVGFyZ2V0LFxuICAgIGhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3QpOiB2b2lkIHtcblxuICAgIGlmICghbGlzdGVuZXJUYXJnZXQpIHtcbiAgICAgIGxpc3RlbmVyVGFyZ2V0ID0gd2luZG93O1xuICAgIH1cbiAgICBldmVudHMuZm9yRWFjaChldmVudCA9PiBsaXN0ZW5lclRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKSk7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgZmlyc3Qgc2Nyb2xsYWJsZSBwYXJlbnQgTm9kZSBvZiBhIGdpdmVuXG4gICAqIEVsZW1lbnQuIFRoZSBET00gVHJlZSBnZXRzIHNlYXJjaGVkIHVwd2FyZHNcbiAgICogdG8gZmluZCB0aGlzIGZpcnN0IHNjcm9sbGFibGUgcGFyZW50LiBQYXJlbnRzIG1pZ2h0XG4gICAqIGJlIGlnbm9yZWQgYnkgQ1NTIHN0eWxlcyBhcHBsaWVkIHRvIHRoZSBIVE1MIEVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBuYXRpdmVFbGVtZW50ICAgICBUaGUgRWxlbWVudCB0byBzZWFyY2ggdGhlIERPTSBUcmVlIHVwd2FyZHMgZnJvbVxuICAgKiBAcmV0dXJucyAgICAgICAgICAgICAgICAgVGhlIGZpcnN0IHNjcm9sbGFibGUgcGFyZW50IEhUTUwgRWxlbWVudFxuICAgKi9cbiAgcHJpdmF0ZSBnZXRGaXJzdFNjcm9sbGFibGVQYXJlbnQobmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG5cbiAgICBsZXQgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXRpdmVFbGVtZW50KTtcblxuICAgIGNvbnN0IG92ZXJmbG93UmVnZXg6IFJlZ0V4cCA9IC8oYXV0b3xzY3JvbGx8b3ZlcmxheSkvO1xuXG4gICAgaWYgKHN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgcGFyZW50ID0gbmF0aXZlRWxlbWVudDtcbiAgICB3aGlsZSAocGFyZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwYXJlbnQpO1xuXG4gICAgICBpZiAoc3R5bGUucG9zaXRpb24gPT09ICdhYnNvbHV0ZSdcbiAgICAgICAgfHwgc3R5bGUub3ZlcmZsb3cgPT09ICdoaWRkZW4nXG4gICAgICAgIHx8IHN0eWxlLm92ZXJmbG93WSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvdmVyZmxvd1JlZ2V4LnRlc3Qoc3R5bGUub3ZlcmZsb3cgKyBzdHlsZS5vdmVyZmxvd1kpXG4gICAgICAgIHx8IHBhcmVudC50YWdOYW1lID09PSAnQk9EWScpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIFRhcmdldCBOb2RlIHRvIHNjcm9sbCB0by5cbiAgICpcbiAgICogQHBhcmFtIGlkICAgICAgICAgICAgICBUaGUgZ2l2ZW4gSUQgb2YgdGhlIG5vZGUsIGVpdGhlciBhIHN0cmluZyBvclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgIGFuIGVsZW1lbnQgcmVmZXJlbmNlXG4gICAqIEBwYXJhbSBhbGxvd0JvZHlUYWcgICAgSW5kaWNhdGUgd2hldGhlciBvciBub3QgdGhlIERvY3VtZW50IEJvZHkgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICBjb25zaWRlcmVkIGEgdmFsaWQgVGFyZ2V0IE5vZGVcbiAgICogQHJldHVybnMgICAgICAgICAgICAgICBUaGUgVGFyZ2V0IE5vZGUgdG8gc2Nyb2xsIHRvXG4gICAqL1xuICBwcml2YXRlIGdldE5vZGUoaWQ6IFNjcm9sbFRvVGFyZ2V0LCBhbGxvd0JvZHlUYWc6IGJvb2xlYW4gPSBmYWxzZSk6IEhUTUxFbGVtZW50IHtcblxuICAgIGxldCB0YXJnZXROb2RlOiBIVE1MRWxlbWVudDtcblxuICAgIGlmIChpc1N0cmluZyhpZCkpIHtcbiAgICAgIGlmIChhbGxvd0JvZHlUYWcgJiYgKGlkID09PSAnYm9keScgfHwgaWQgPT09ICdCT0RZJykpIHtcbiAgICAgICAgdGFyZ2V0Tm9kZSA9IHRoaXMuZG9jdW1lbnQuYm9keTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldE5vZGUgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0cmlwSGFzaChpZCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoaWQpKSB7XG4gICAgICB0YXJnZXROb2RlID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChTdHJpbmcoaWQpKTtcbiAgICB9IGVsc2UgaWYgKGlzRWxlbWVudFJlZihpZCkpIHtcbiAgICAgIHRhcmdldE5vZGUgPSBpZC5uYXRpdmVFbGVtZW50O1xuICAgIH0gZWxzZSBpZiAoaXNOYXRpdmVFbGVtZW50KGlkKSkge1xuICAgICAgdGFyZ2V0Tm9kZSA9IGlkO1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXROb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBMaXN0ZW5lciB0YXJnZXQuIFRoaXMgTGlzdGVuZXIgVGFyZ2V0IGlzIHVzZWRcbiAgICogdG8gYXR0YWNoIEV2ZW50IExpc3RlbmVycyBvbi4gSW4gY2FzZSBvZiB0aGUgdGFyZ2V0IGJlaW5nXG4gICAqIHRoZSBEb2N1bWVudCBCb2R5LCB3ZSBuZWVkIHRoZSBhY3R1YWwgYHdpbmRvd2AgdG8gbGlzdGVuXG4gICAqIGZvciBldmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBjb250YWluZXIgICAgICAgICAgIFRoZSBIVE1MIENvbnRhaW5lciBlbGVtZW50XG4gICAqIEByZXR1cm5zICAgICAgICAgICAgICAgICAgIFRoZSBMaXN0ZW5lciBUYXJnZXQgdG8gYXR0YWNoIGV2ZW50cyBvblxuICAgKi9cbiAgcHJpdmF0ZSBnZXRMaXN0ZW5lclRhcmdldChjb250YWluZXI6IEhUTUxFbGVtZW50KTogU2Nyb2xsVG9MaXN0ZW5lclRhcmdldCB7XG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pc0RvY3VtZW50Qm9keShjb250YWluZXIpID8gd2luZG93IDogY29udGFpbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlc3QgaWYgYSBnaXZlbiBIVE1MIEVsZW1lbnQgaXMgdGhlIERvY3VtZW50IEJvZHkuXG4gICAqXG4gICAqIEBwYXJhbSBlbGVtZW50ICAgICAgICAgICAgIFRoZSBnaXZlbiBIVE1MIEVsZW1lbnRcbiAgICogQHJldHVybnMgICAgICAgICAgICAgICAgICAgV2hldGhlciBvciBub3QgdGhlIEVsZW1lbnQgaXMgdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvY3VtZW50IEJvZHkgRWxlbWVudFxuICAgKi9cbiAgcHJpdmF0ZSBpc0RvY3VtZW50Qm9keShlbGVtZW50OiBIVE1MRWxlbWVudCk6IGVsZW1lbnQgaXMgSFRNTEJvZHlFbGVtZW50IHtcbiAgICByZXR1cm4gZWxlbWVudC50YWdOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdCT0RZJztcbiAgfVxufVxuIl19