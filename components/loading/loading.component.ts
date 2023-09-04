import { Component, Input } from '@angular/core';
@Component({
    selector: 'nx-loading',
    styleUrls: ['./loading.component.scss'],
    template: `
        <div *ngIf="show" class="nx-loading">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div> 
        </div>
    `
})

export class LoadingComponent {
    @Input('show') show: boolean = false
}