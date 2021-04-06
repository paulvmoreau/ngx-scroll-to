import { __decorate } from "tslib";
import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DEFAULTS, EVENTS } from './scroll-to-helpers';
import { ScrollToService } from './scroll-to.service';
let ScrollToDirective = class ScrollToDirective {
    constructor(elementRef, scrollToService, renderer2) {
        this.elementRef = elementRef;
        this.scrollToService = scrollToService;
        this.renderer2 = renderer2;
        this.ngxScrollTo = DEFAULTS.target;
        this.ngxScrollToEvent = DEFAULTS.action;
        this.ngxScrollToDuration = DEFAULTS.duration;
        this.ngxScrollToEasing = DEFAULTS.easing;
        this.ngxScrollToOffset = DEFAULTS.offset;
        this.ngxScrollToOffsetMap = DEFAULTS.offsetMap;
    }
    /**
     * Angular Lifecycle Hook - After View Init
     *
     * @todo Implement Subscription for Events
     *
     * @returns void
     */
    ngAfterViewInit() {
        // Test Event Support
        if (EVENTS.indexOf(this.ngxScrollToEvent) === -1) {
            throw new Error(`Unsupported Event '${this.ngxScrollToEvent}'`);
        }
        // Listen for the trigger...
        this.renderer2.listen(this.elementRef.nativeElement, this.ngxScrollToEvent, (event) => {
            this.options = {
                target: this.ngxScrollTo,
                duration: this.ngxScrollToDuration,
                easing: this.ngxScrollToEasing,
                offset: this.ngxScrollToOffset,
                offsetMap: this.ngxScrollToOffsetMap
            };
            this.scrollToService.scrollTo(this.options);
        });
    }
};
ScrollToDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ScrollToService },
    { type: Renderer2 }
];
__decorate([
    Input()
], ScrollToDirective.prototype, "ngxScrollTo", void 0);
__decorate([
    Input()
], ScrollToDirective.prototype, "ngxScrollToEvent", void 0);
__decorate([
    Input()
], ScrollToDirective.prototype, "ngxScrollToDuration", void 0);
__decorate([
    Input()
], ScrollToDirective.prototype, "ngxScrollToEasing", void 0);
__decorate([
    Input()
], ScrollToDirective.prototype, "ngxScrollToOffset", void 0);
__decorate([
    Input()
], ScrollToDirective.prototype, "ngxScrollToOffsetMap", void 0);
ScrollToDirective = __decorate([
    Directive({
        selector: '[ngxScrollTo]'
    })
], ScrollToDirective);
export { ScrollToDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXRvLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BwYXVsdm1vcmVhdS9uZ3gtc2Nyb2xsLXRvLyIsInNvdXJjZXMiOlsibGliL3Njcm9sbC10by5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFJdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBS3RELElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO0lBc0I1QixZQUNVLFVBQXNCLEVBQ3RCLGVBQWdDLEVBQ2hDLFNBQW9CO1FBRnBCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLGNBQVMsR0FBVCxTQUFTLENBQVc7UUF0QjlCLGdCQUFXLEdBQW1CLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFHOUMscUJBQWdCLEdBQWtCLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFHbEQsd0JBQW1CLEdBQVcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUdoRCxzQkFBaUIsR0FBNEIsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUc3RCxzQkFBaUIsR0FBVyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBRzVDLHlCQUFvQixHQUFzQixRQUFRLENBQUMsU0FBUyxDQUFDO0lBUTdELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxlQUFlO1FBRWIscUJBQXFCO1FBQ3JCLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNoRCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFDeEUsQ0FBQyxLQUFZLEVBQUUsRUFBRTtZQUVmLElBQUksQ0FBQyxPQUFPLEdBQUc7Z0JBQ2IsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUN4QixRQUFRLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjtnQkFDbEMsTUFBTSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7Z0JBQzlCLE1BQU0sRUFBRSxJQUFJLENBQUMsaUJBQWlCO2dCQUM5QixTQUFTLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjthQUNyQyxDQUFDO1lBRUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNGLENBQUE7O1lBbEN1QixVQUFVO1lBQ0wsZUFBZTtZQUNyQixTQUFTOztBQXRCOUI7SUFEQyxLQUFLLEVBQUU7c0RBQ3NDO0FBRzlDO0lBREMsS0FBSyxFQUFFOzJEQUMwQztBQUdsRDtJQURDLEtBQUssRUFBRTs4REFDd0M7QUFHaEQ7SUFEQyxLQUFLLEVBQUU7NERBQ3FEO0FBRzdEO0lBREMsS0FBSyxFQUFFOzREQUNvQztBQUc1QztJQURDLEtBQUssRUFBRTsrREFDcUQ7QUFsQmxELGlCQUFpQjtJQUg3QixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsZUFBZTtLQUMxQixDQUFDO0dBQ1csaUJBQWlCLENBeUQ3QjtTQXpEWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgREVGQVVMVFMsIEVWRU5UUyB9IGZyb20gJy4vc2Nyb2xsLXRvLWhlbHBlcnMnO1xuaW1wb3J0IHsgU2Nyb2xsVG9Db25maWdPcHRpb25zLCBTY3JvbGxUb09mZnNldE1hcCwgU2Nyb2xsVG9UYXJnZXQgfSBmcm9tICcuL3Njcm9sbC10by1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IFNjcm9sbFRvQW5pbWF0aW9uRWFzaW5nIH0gZnJvbSAnLi9zY3JvbGwtdG8tZWFzaW5nLmludGVyZmFjZSc7XG5pbXBvcnQgeyBTY3JvbGxUb0V2ZW50IH0gZnJvbSAnLi9zY3JvbGwtdG8tZXZlbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFNjcm9sbFRvU2VydmljZSB9IGZyb20gJy4vc2Nyb2xsLXRvLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmd4U2Nyb2xsVG9dJ1xufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxUb0RpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpXG4gIG5neFNjcm9sbFRvOiBTY3JvbGxUb1RhcmdldCA9IERFRkFVTFRTLnRhcmdldDtcblxuICBASW5wdXQoKVxuICBuZ3hTY3JvbGxUb0V2ZW50OiBTY3JvbGxUb0V2ZW50ID0gREVGQVVMVFMuYWN0aW9uO1xuXG4gIEBJbnB1dCgpXG4gIG5neFNjcm9sbFRvRHVyYXRpb246IG51bWJlciA9IERFRkFVTFRTLmR1cmF0aW9uO1xuXG4gIEBJbnB1dCgpXG4gIG5neFNjcm9sbFRvRWFzaW5nOiBTY3JvbGxUb0FuaW1hdGlvbkVhc2luZyA9IERFRkFVTFRTLmVhc2luZztcblxuICBASW5wdXQoKVxuICBuZ3hTY3JvbGxUb09mZnNldDogbnVtYmVyID0gREVGQVVMVFMub2Zmc2V0O1xuXG4gIEBJbnB1dCgpXG4gIG5neFNjcm9sbFRvT2Zmc2V0TWFwOiBTY3JvbGxUb09mZnNldE1hcCA9IERFRkFVTFRTLm9mZnNldE1hcDtcblxuICBwcml2YXRlIG9wdGlvbnM6IFNjcm9sbFRvQ29uZmlnT3B0aW9ucztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBzY3JvbGxUb1NlcnZpY2U6IFNjcm9sbFRvU2VydmljZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyMjogUmVuZGVyZXIyKSB7XG4gIH1cblxuICAvKipcbiAgICogQW5ndWxhciBMaWZlY3ljbGUgSG9vayAtIEFmdGVyIFZpZXcgSW5pdFxuICAgKlxuICAgKiBAdG9kbyBJbXBsZW1lbnQgU3Vic2NyaXB0aW9uIGZvciBFdmVudHNcbiAgICpcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuXG4gICAgLy8gVGVzdCBFdmVudCBTdXBwb3J0XG4gICAgaWYgKEVWRU5UUy5pbmRleE9mKHRoaXMubmd4U2Nyb2xsVG9FdmVudCkgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIEV2ZW50ICcke3RoaXMubmd4U2Nyb2xsVG9FdmVudH0nYCk7XG4gICAgfVxuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgdHJpZ2dlci4uLlxuICAgIHRoaXMucmVuZGVyZXIyLmxpc3Rlbih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5uZ3hTY3JvbGxUb0V2ZW50LFxuICAgICAgKGV2ZW50OiBFdmVudCkgPT4ge1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICB0YXJnZXQ6IHRoaXMubmd4U2Nyb2xsVG8sXG4gICAgICAgICAgZHVyYXRpb246IHRoaXMubmd4U2Nyb2xsVG9EdXJhdGlvbixcbiAgICAgICAgICBlYXNpbmc6IHRoaXMubmd4U2Nyb2xsVG9FYXNpbmcsXG4gICAgICAgICAgb2Zmc2V0OiB0aGlzLm5neFNjcm9sbFRvT2Zmc2V0LFxuICAgICAgICAgIG9mZnNldE1hcDogdGhpcy5uZ3hTY3JvbGxUb09mZnNldE1hcFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9TZXJ2aWNlLnNjcm9sbFRvKHRoaXMub3B0aW9ucyk7XG4gICAgICB9KTtcbiAgfVxufVxuIl19