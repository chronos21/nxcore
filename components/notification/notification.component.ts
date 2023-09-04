import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NotificationLinkConfig, StdObject } from "../../interface";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'nx-notif',
    templateUrl: './notification.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})

export class NotificationComponent {
    @Input('list') list: StdObject[] = []
    @Input('mute') mute: boolean = true
    @Input('handleMute') handleMute: Function = () => {}
    @Input('cancel') handleCancel: Function = () => {}
    @Input('read') handleRead: Function = () => {}
    @Input('show') show: boolean = false
    @Output() event = new EventEmitter

    handleClose(){
        this.event.emit(false)
    }

    getUrl(link: string | NotificationLinkConfig | undefined){
        if(!link) return null
        if(typeof link === 'string' ){
            return link
        } else if(link.path){
            return link.path
        } 

        return null
    }

    
    getUrlQueryParams(link: string | NotificationLinkConfig | undefined): StdObject | null{
        if(!link) return null
        if(typeof link !== 'string' ){
            return link.queryParams

        } 
        return null
    }
}