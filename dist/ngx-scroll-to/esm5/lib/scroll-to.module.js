import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { ScrollToDirective } from './scroll-to.directive';
import { ScrollToService } from './scroll-to.service';
/** Scroll To Module */
var ScrollToModule = /** @class */ (function () {
    function ScrollToModule() {
    }
    ScrollToModule_1 = ScrollToModule;
    /**
     * Guaranteed singletons for provided Services across App.
     *
     * @return          An Angular Module with Providers
     */
    ScrollToModule.forRoot = function () {
        return {
            ngModule: ScrollToModule_1,
            providers: [
                ScrollToService
            ]
        };
    };
    var ScrollToModule_1;
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
    return ScrollToModule;
}());
export { ScrollToModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXRvLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BwYXVsdm1vcmVhdS9uZ3gtc2Nyb2xsLXRvLyIsInNvdXJjZXMiOlsibGliL3Njcm9sbC10by5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV0RCx1QkFBdUI7QUFTdkI7SUFBQTtJQWVBLENBQUM7dUJBZlksY0FBYztJQUV6Qjs7OztPQUlHO0lBQ0ksc0JBQU8sR0FBZDtRQUNFLE9BQU87WUFDTCxRQUFRLEVBQUUsZ0JBQWM7WUFDeEIsU0FBUyxFQUFFO2dCQUNULGVBQWU7YUFDaEI7U0FDRixDQUFDO0lBQ0osQ0FBQzs7SUFkVSxjQUFjO1FBUjFCLFFBQVEsQ0FBQztZQUNSLFlBQVksRUFBRTtnQkFDWixpQkFBaUI7YUFDbEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsaUJBQWlCO2FBQ2xCO1NBQ0YsQ0FBQztPQUNXLGNBQWMsQ0FlMUI7SUFBRCxxQkFBQztDQUFBLEFBZkQsSUFlQztTQWZZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2Nyb2xsVG9EaXJlY3RpdmUgfSBmcm9tICcuL3Njcm9sbC10by5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgU2Nyb2xsVG9TZXJ2aWNlIH0gZnJvbSAnLi9zY3JvbGwtdG8uc2VydmljZSc7XG5cbi8qKiBTY3JvbGwgVG8gTW9kdWxlICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBTY3JvbGxUb0RpcmVjdGl2ZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgU2Nyb2xsVG9EaXJlY3RpdmVcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxUb01vZHVsZSB7XG5cbiAgLyoqXG4gICAqIEd1YXJhbnRlZWQgc2luZ2xldG9ucyBmb3IgcHJvdmlkZWQgU2VydmljZXMgYWNyb3NzIEFwcC5cbiAgICpcbiAgICogQHJldHVybiAgICAgICAgICBBbiBBbmd1bGFyIE1vZHVsZSB3aXRoIFByb3ZpZGVyc1xuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTY3JvbGxUb01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU2Nyb2xsVG9Nb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgU2Nyb2xsVG9TZXJ2aWNlXG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19