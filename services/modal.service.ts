import { Injectable } from "@angular/core"
import { ModalConfig } from "../interface"
import { ComponentInjector } from "./component-injector.service"
import { ModalComponent } from "../components/modal/modal.component"

@Injectable()
export class Modal extends ComponentInjector {
    public show(modal: ModalConfig) {
        this.create(ModalComponent, { key: '.modal' })

        Object.keys(modal).forEach(key => {
            this.ref.instance[key] = modal[key as keyof ModalConfig]
        })

        this.ref.instance.handleCancel = () => {
            this.destroy()
            if (modal.onCancel) {
                modal.onCancel()
            }
        }

        this.ref.instance.handleConfirm = () => {
            if (modal.onConfirm) {
                modal.onConfirm()
                this.destroy()
            }
        }
    }
}