import { Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { StdObject } from "../../interface";
import { Modal } from "../../services/modal.service";

@Component({
    selector: 'nx-import',
    templateUrl: './import.component.html',
})

export class ImportComponent {
    constructor(
        private modal: Modal
    ) {}

    @Output('submit') submit = new EventEmitter()
    @Input('accept') accept: string = ''
    @Input('disabled') disabled = false
    @Input('template') template: string = ''

    file?: StdObject | string

    handleModal(template: TemplateRef<any>) {
        this.modal.show({
            template,
            confirmLabel: 'Submit',
            onConfirm: () => {
                if (!this.file) {
                    return
                }
                this.submit.emit(this.file)
            },
            onCancel: () => {
                this.file = undefined
            }
        })
    }

    handleFileChange(e: Event) {
        this.file = (e.target as HTMLInputElement).files![0]
    }

    get getTemplateName(){
        return this.template.split('/').pop()
    }
}
