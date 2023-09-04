import { Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
@Component({
    selector: 'nx-modal',
    templateUrl: './modal.component.html',
})

export class ModalComponent implements OnInit {
    @Input('confirmLabel') confirmLabel?: string = 'Yes'
    @Input('title') title?: string = ''
    @Input('body') body?: string = ''
    @Input('useConfirmButton') useConfirmButton: boolean = true
    @Input('useCancelButton') useCancelButton: boolean = true
    @Input('cancelLabel') cancelLabel?: string = ''
    @Input('cancel') handleCancel: Function = () => this.handleShow(false)
    @Input('confirm') handleConfirm: Function = () => { }
    @Input('template') template?: TemplateRef<any>;

    show: boolean = false

    @HostListener('document:click', ['$event'])
    clickOutside(e: Event) {
        const target = e.target as HTMLInputElement
        if (target.className.includes('show')) {
            this.handleCancel()
        }
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.handleShow(true)
        }, 100)
    }

    handleShow(show: boolean = true) {
        this.show = show
    }
}