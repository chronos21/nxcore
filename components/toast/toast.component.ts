import { Component, Input, OnInit, TemplateRef } from '@angular/core';
@Component({
    selector: 'nx-toast',
    templateUrl: './toast.component.html',
})

export class ToastComponent implements OnInit {
    @Input('title') title?: string = ''
    @Input('body') body?: string = ''
    @Input('template') template?: TemplateRef<any>;
    @Input('close') handleClose: Function = () => { }


    show: boolean = false
    ngOnInit(): void {
        setTimeout(() => {
            this.handleShow(true)
        }, 100)
    }

    handleShow(show: boolean = true) {
        this.show = show
    }
}