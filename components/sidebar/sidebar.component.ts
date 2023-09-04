import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { environment } from "src/environments/environment";
import { Sidebar } from "../../interface";
import { Access, checkAccess } from "../../directives/access.directive";

@Component({
    selector: 'nx-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, Access]
})

export class SidebarComponent {
    env = environment
    @Input('show') show: boolean = true
    @Input('data') sidebar: Sidebar[] = []
    @Input('active') active: string[] = []
    @Input('handleActive') handleActive: Function = () => {}
    @Input('handleShow') handleShow: Function = () => {}
    @Input('handleRoute') handleRoute: Function = (title: string) => {}

    checkEmpty(arr: Sidebar[] = []): boolean {
        let isEmpty = true;
        for (let item of arr) {
            let childMenuTotal = 0;
            if (checkAccess(item.acl)) {
                isEmpty = false;
            }

            if (!isEmpty && item.children) {
                for (let childItem of item.children) {
                    if (checkAccess(childItem.acl)) {
                        childMenuTotal += 1;
                    }
                }

                if (childMenuTotal > 0) {
                    isEmpty = false;
                } else {
                    isEmpty = true;
                }
            }

        }

        return isEmpty;
    }
}