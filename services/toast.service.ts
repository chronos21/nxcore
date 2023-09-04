import { Injectable } from "@angular/core";
import { ComponentInjector } from "./component-injector.service";
import { ToastConfig } from "../interface";
import { ToastComponent } from "../components/toast/toast.component";

@Injectable()
export class Toast extends ComponentInjector {
    st: any;

    public show(toast: ToastConfig) {
        this.destroy(() => clearTimeout(this.st))
        this.create(ToastComponent, { key: '.toast' })
        Object.keys(toast).forEach(key => {
            this.ref.instance[key] = toast[key as keyof ToastConfig]
        })
        
        this.ref.instance.handleClose = () => {
            this.destroy()
        }

        let timeout = toast.timeout ?? 4000
        this.st = setTimeout(() => {
            this.destroy()
        }, timeout)
    }
}