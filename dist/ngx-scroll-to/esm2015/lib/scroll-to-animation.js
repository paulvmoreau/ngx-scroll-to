import { ReplaySubject } from 'rxjs';
import { EASING } from './scroll-to-helpers';
/** Scroll To Animation */
export class ScrollToAnimation {
    /**
     * Class Constructor.
     *
     * @param container            The Container
     * @param listenerTarget       The Element that listens for DOM Events
     * @param isWindow             Whether or not the listener is the Window
     * @param to                   Position to scroll to
     * @param options              Additional options for scrolling
     * @param isBrowser            Whether or not execution runs in the browser
     *                              (as opposed to the server)
     */
    constructor(container, listenerTarget, isWindow, to, options, isBrowser) {
        this.container = container;
        this.listenerTarget = listenerTarget;
        this.isWindow = isWindow;
        this.to = to;
        this.options = options;
        this.isBrowser = isBrowser;
        /** Recursively loop over the Scroll Animation */
        this.loop = () => {
            this.timeLapsed += this.tick;
            this.percentage = (this.timeLapsed / this.options.duration);
            this.percentage = (this.percentage > 1) ? 1 : this.percentage;
            // Position Update
            this.position = this.startPosition +
                ((this.startPosition - this.to <= 0 ? 1 : -1) *
                    this.distance *
                    EASING[this.options.easing](this.percentage));
            if (this.lastPosition !== null && this.position === this.lastPosition) {
                this.stop();
            }
            else {
                this.source$.next(this.position);
                this.isWindow
                    ? this.listenerTarget.scrollTo(0, Math.floor(this.position))
                    : this.container.scrollTop = Math.floor(this.position);
                this.lastPosition = this.position;
            }
        };
        this.tick = 16;
        this.interval = null;
        this.lastPosition = null;
        this.timeLapsed = 0;
        this.windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (!this.container) {
            this.startPosition = this.windowScrollTop;
        }
        else {
            this.startPosition = this.isWindow ? this.windowScrollTop : this.container.scrollTop;
        }
        // Correction for Starting Position of nested HTML Elements
        if (this.container && !this.isWindow) {
            this.to = this.to - this.container.getBoundingClientRect().top + this.startPosition;
        }
        // Set Distance
        const directionalDistance = this.startPosition - this.to;
        this.distance = this.container ? Math.abs(this.startPosition - this.to) : this.to;
        this.mappedOffset = this.options.offset;
        // Set offset from Offset Map
        if (this.isBrowser) {
            this.options
                .offsetMap
                .forEach((value, key) => this.mappedOffset = window.innerWidth > key ? value : this.mappedOffset);
        }
        this.distance += this.mappedOffset * (directionalDistance <= 0 ? 1 : -1);
        this.source$ = new ReplaySubject();
    }
    /**
     * Start the new Scroll Animation.
     *
     * @returns         Observable containing a number
     */
    start() {
        clearInterval(this.interval);
        this.interval = setInterval(this.loop, this.tick);
        return this.source$.asObservable();
    }
    /**
     * Stop the current Scroll Animation Loop.
     *
     * @param force          Force to stop the Animation Loop
     * @returns               Void
     */
    stop() {
        clearInterval(this.interval);
        this.interval = null;
        this.source$.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXRvLWFuaW1hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BwYXVsdm1vcmVhdS9uZ3gtc2Nyb2xsLXRvLyIsInNvdXJjZXMiOlsibGliL3Njcm9sbC10by1hbmltYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVqRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHN0MsMEJBQTBCO0FBQzFCLE1BQU0sT0FBTyxpQkFBaUI7SUFtQzVCOzs7Ozs7Ozs7O09BVUc7SUFDSCxZQUNVLFNBQXNCLEVBQ3RCLGNBQXNDLEVBQzdCLFFBQWlCLEVBQ2pCLEVBQVUsRUFDVixPQUE4QixFQUN2QyxTQUFrQjtRQUxsQixjQUFTLEdBQVQsU0FBUyxDQUFhO1FBQ3RCLG1CQUFjLEdBQWQsY0FBYyxDQUF3QjtRQUM3QixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLE9BQUUsR0FBRixFQUFFLENBQVE7UUFDVixZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQUN2QyxjQUFTLEdBQVQsU0FBUyxDQUFTO1FBNEQ1QixpREFBaUQ7UUFDekMsU0FBSSxHQUFHLEdBQVMsRUFBRTtZQUV4QixJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBRTlELGtCQUFrQjtZQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhO2dCQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFB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SUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3JHO1FBRUQsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsbUJBQW1CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSztRQUNILGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUk7UUFDRixhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDMUIsQ0FBQztDQXlCRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUsIFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRUFTSU5HIH0gZnJvbSAnLi9zY3JvbGwtdG8taGVscGVycyc7XG5pbXBvcnQgeyBTY3JvbGxUb0NvbmZpZ09wdGlvbnMsIFNjcm9sbFRvTGlzdGVuZXJUYXJnZXQgfSBmcm9tICcuL3Njcm9sbC10by1jb25maWcuaW50ZXJmYWNlJztcblxuLyoqIFNjcm9sbCBUbyBBbmltYXRpb24gKi9cbmV4cG9ydCBjbGFzcyBTY3JvbGxUb0FuaW1hdGlvbiB7XG5cbiAgLyoqIE51bWJlciBvZiBtaWxsaXNlY29uZHMgZm9yIGVhY2ggVGljayAqL1xuICBwcml2YXRlIHRpY2s6IG51bWJlcjtcblxuICAvKiogSW50ZXJ2YWwgKi9cbiAgcHJpdmF0ZSBpbnRlcnZhbDogYW55O1xuXG4gIC8qKiBUaW1lIExhcHNlZCBpbiBtaWxsaXNlY29uZHMgKi9cbiAgcHJpdmF0ZSB0aW1lTGFwc2VkOiBudW1iZXI7XG5cbiAgLyoqIFBlcmNlbnRhZ2Ugb2YgdGltZSBsYXBzZWQgKi9cbiAgcHJpdmF0ZSBwZXJjZW50YWdlOiBudW1iZXI7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBFbGVtZW50ICovXG4gIHByaXZhdGUgcG9zaXRpb246IG51bWJlcjtcblxuICAvKiogTGFzdCBFbGVtZW50IFBvc2l0aW9uICovXG4gIHByaXZhdGUgbGFzdFBvc2l0aW9uOiBudW1iZXI7XG5cbiAgLyoqIFN0YXJ0IFBvc2l0aW9uIG9mIHRoZSBFbGVtZW50ICovXG4gIHByaXZhdGUgc3RhcnRQb3NpdGlvbjogbnVtYmVyO1xuXG4gIC8qKiBUaGUgRGlzdGFuY2UgdG8gc2Nyb2xsICovXG4gIHByaXZhdGUgZGlzdGFuY2U6IG51bWJlcjtcblxuICAvKiogT2JzZXJ2YWJsZSBTb3VyY2UgKi9cbiAgcHJpdmF0ZSBzb3VyY2UkOiBSZXBsYXlTdWJqZWN0PG51bWJlcj47XG5cbiAgLyoqIFNjcm9sbCBUb3Agb2YgdGhlIFdpbmRvdyAqL1xuICBwcml2YXRlIHdpbmRvd1Njcm9sbFRvcDogbnVtYmVyO1xuXG4gIC8qKiBNYXBwZWQgT2Zmc2V0IHRha2VuIGZyb20gdGhlIGFjdGl2ZSBPZmZzZXQgTWFwICovXG4gIHByaXZhdGUgbWFwcGVkT2Zmc2V0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENsYXNzIENvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gY29udGFpbmVyICAgICAgICAgICAgVGhlIENvbnRhaW5lclxuICAgKiBAcGFyYW0gbGlzdGVuZXJUYXJnZXQgICAgICAgVGhlIEVsZW1lbnQgdGhhdCBsaXN0ZW5zIGZvciBET00gRXZlbnRzXG4gICAqIEBwYXJhbSBpc1dpbmRvdyAgICAgICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgbGlzdGVuZXIgaXMgdGhlIFdpbmRvd1xuICAgKiBAcGFyYW0gdG8gICAgICAgICAgICAgICAgICAgUG9zaXRpb24gdG8gc2Nyb2xsIHRvXG4gICAqIEBwYXJhbSBvcHRpb25zICAgICAgICAgICAgICBBZGRpdGlvbmFsIG9wdGlvbnMgZm9yIHNjcm9sbGluZ1xuICAgKiBAcGFyYW0gaXNCcm93c2VyICAgICAgICAgICAgV2hldGhlciBvciBub3QgZXhlY3V0aW9uIHJ1bnMgaW4gdGhlIGJyb3dzZXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYXMgb3Bwb3NlZCB0byB0aGUgc2VydmVyKVxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50LFxuICAgIHByaXZhdGUgbGlzdGVuZXJUYXJnZXQ6IFNjcm9sbFRvTGlzdGVuZXJUYXJnZXQsXG4gICAgcHJpdmF0ZSByZWFkb25seSBpc1dpbmRvdzogYm9vbGVhbixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRvOiBudW1iZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBTY3JvbGxUb0NvbmZpZ09wdGlvbnMsXG4gICAgcHJpdmF0ZSBpc0Jyb3dzZXI6IGJvb2xlYW5cbiAgKSB7XG4gICAgdGhpcy50aWNrID0gMTY7XG4gICAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSBudWxsO1xuICAgIHRoaXMudGltZUxhcHNlZCA9IDA7XG5cbiAgICB0aGlzLndpbmRvd1Njcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IDA7XG5cbiAgICBpZiAoIXRoaXMuY29udGFpbmVyKSB7XG4gICAgICB0aGlzLnN0YXJ0UG9zaXRpb24gPSB0aGlzLndpbmRvd1Njcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFydFBvc2l0aW9uID0gdGhpcy5pc1dpbmRvdyA/IHRoaXMud2luZG93U2Nyb2xsVG9wIDogdGhpcy5jb250YWluZXIuc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIENvcnJlY3Rpb24gZm9yIFN0YXJ0aW5nIFBvc2l0aW9uIG9mIG5lc3RlZCBIVE1MIEVsZW1lbnRzXG4gICAgaWYgKHRoaXMuY29udGFpbmVyICYmICF0aGlzLmlzV2luZG93KSB7XG4gICAgICB0aGlzLnRvID0gdGhpcy50byAtIHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHRoaXMuc3RhcnRQb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvLyBTZXQgRGlzdGFuY2VcbiAgICBjb25zdCBkaXJlY3Rpb25hbERpc3RhbmNlID0gdGhpcy5zdGFydFBvc2l0aW9uIC0gdGhpcy50bztcbiAgICB0aGlzLmRpc3RhbmNlID0gdGhpcy5jb250YWluZXIgPyBNYXRoLmFicyh0aGlzLnN0YXJ0UG9zaXRpb24gLSB0aGlzLnRvKSA6IHRoaXMudG87XG5cbiAgICB0aGlzLm1hcHBlZE9mZnNldCA9IHRoaXMub3B0aW9ucy5vZmZzZXQ7XG5cbiAgICAvLyBTZXQgb2Zmc2V0IGZyb20gT2Zmc2V0IE1hcFxuICAgIGlmICh0aGlzLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5vcHRpb25zXG4gICAgICAgIC5vZmZzZXRNYXBcbiAgICAgICAgLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHRoaXMubWFwcGVkT2Zmc2V0ID0gd2luZG93LmlubmVyV2lkdGggPiBrZXkgPyB2YWx1ZSA6IHRoaXMubWFwcGVkT2Zmc2V0KTtcbiAgICB9XG5cbiAgICB0aGlzLmRpc3RhbmNlICs9IHRoaXMubWFwcGVkT2Zmc2V0ICogKGRpcmVjdGlvbmFsRGlzdGFuY2UgPD0gMCA/IDEgOiAtMSk7XG4gICAgdGhpcy5zb3VyY2UkID0gbmV3IFJlcGxheVN1YmplY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbmV3IFNjcm9sbCBBbmltYXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zICAgICAgICAgT2JzZXJ2YWJsZSBjb250YWluaW5nIGEgbnVtYmVyXG4gICAqL1xuICBzdGFydCgpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMubG9vcCwgdGhpcy50aWNrKTtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIGN1cnJlbnQgU2Nyb2xsIEFuaW1hdGlvbiBMb29wLlxuICAgKlxuICAgKiBAcGFyYW0gZm9yY2UgICAgICAgICAgRm9yY2UgdG8gc3RvcCB0aGUgQW5pbWF0aW9uIExvb3BcbiAgICogQHJldHVybnMgICAgICAgICAgICAgICBWb2lkXG4gICAqL1xuICBzdG9wKCk6IHZvaWQge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG4gICAgdGhpcy5zb3VyY2UkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogUmVjdXJzaXZlbHkgbG9vcCBvdmVyIHRoZSBTY3JvbGwgQW5pbWF0aW9uICovXG4gIHByaXZhdGUgbG9vcCA9ICgpOiB2b2lkID0+IHtcblxuICAgIHRoaXMudGltZUxhcHNlZCArPSB0aGlzLnRpY2s7XG4gICAgdGhpcy5wZXJjZW50YWdlID0gKHRoaXMudGltZUxhcHNlZCAvIHRoaXMub3B0aW9ucy5kdXJhdGlvbik7XG4gICAgdGhpcy5wZXJjZW50YWdlID0gKHRoaXMucGVyY2VudGFnZSA+IDEpID8gMSA6IHRoaXMucGVyY2VudGFnZTtcblxuICAgIC8vIFBvc2l0aW9uIFVwZGF0ZVxuICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnN0YXJ0UG9zaXRpb24gK1xuICAgICAgKCh0aGlzLnN0YXJ0UG9zaXRpb24gLSB0aGlzLnRvIDw9IDAgPyAxIDogLTEpICpcbiAgICAgICAgdGhpcy5kaXN0YW5jZSAqXG4gICAgICAgIEVBU0lOR1t0aGlzLm9wdGlvbnMuZWFzaW5nXSh0aGlzLnBlcmNlbnRhZ2UpKTtcblxuICAgIGlmICh0aGlzLmxhc3RQb3NpdGlvbiAhPT0gbnVsbCAmJiB0aGlzLnBvc2l0aW9uID09PSB0aGlzLmxhc3RQb3NpdGlvbikge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc291cmNlJC5uZXh0KHRoaXMucG9zaXRpb24pO1xuICAgICAgdGhpcy5pc1dpbmRvd1xuICAgICAgICA/IHRoaXMubGlzdGVuZXJUYXJnZXQuc2Nyb2xsVG8oMCwgTWF0aC5mbG9vcih0aGlzLnBvc2l0aW9uKSlcbiAgICAgICAgOiB0aGlzLmNvbnRhaW5lci5zY3JvbGxUb3AgPSBNYXRoLmZsb29yKHRoaXMucG9zaXRpb24pO1xuICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIH1cbiAgfVxufVxuIl19