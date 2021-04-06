var ScrollToModule_1;
import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { ScrollToDirective } from './scroll-to.directive';
import { ScrollToService } from './scroll-to.service';
/** Scroll To Module */
let ScrollToModule = ScrollToModule_1 = class ScrollToModule {
    /**
     * Guaranteed singletons for provided Services across App.
     *
     * @return          An Angular Module with Providers
     */
    static forRoot() {
        return {
            ngModule: ScrollToModule_1,
            providers: [
                ScrollToService
            ]
        };
    }
};
ScrollToModule = ScrollToModule_1 = __decorate([
    NgModule({
        declarations: [
            ScrollToDirective
        ],
        exports: [
            ScrollToDirective
        ]
    })
], ScrollToModule);
export { ScrollToModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXRvLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BwYXVsdm1vcmVhdS9uZ3gtc2Nyb2xsLXRvLyIsInNvdXJjZXMiOlsibGliL3Njcm9sbC10by5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFdEQsdUJBQXVCO0FBU3ZCLElBQWEsY0FBYyxzQkFBM0IsTUFBYSxjQUFjO0lBRXpCOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsT0FBTztRQUNaLE9BQU87WUFDTCxRQUFRLEVBQUUsZ0JBQWM7WUFDeEIsU0FBUyxFQUFFO2dCQUNULGVBQWU7YUFDaEI7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUE7QUFmWSxjQUFjO0lBUjFCLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLGlCQUFpQjtTQUNsQjtRQUNELE9BQU8sRUFBRTtZQUNQLGlCQUFpQjtTQUNsQjtLQUNGLENBQUM7R0FDVyxjQUFjLENBZTFCO1NBZlksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JvbGxUb0RpcmVjdGl2ZSB9IGZyb20gJy4vc2Nyb2xsLXRvLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBTY3JvbGxUb1NlcnZpY2UgfSBmcm9tICcuL3Njcm9sbC10by5zZXJ2aWNlJztcblxuLyoqIFNjcm9sbCBUbyBNb2R1bGUgKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFNjcm9sbFRvRGlyZWN0aXZlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBTY3JvbGxUb0RpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbFRvTW9kdWxlIHtcblxuICAvKipcbiAgICogR3VhcmFudGVlZCBzaW5nbGV0b25zIGZvciBwcm92aWRlZCBTZXJ2aWNlcyBhY3Jvc3MgQXBwLlxuICAgKlxuICAgKiBAcmV0dXJuICAgICAgICAgIEFuIEFuZ3VsYXIgTW9kdWxlIHdpdGggUHJvdmlkZXJzXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFNjcm9sbFRvTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTY3JvbGxUb01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBTY3JvbGxUb1NlcnZpY2VcbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=