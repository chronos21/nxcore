import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthGuard, LoginGuard } from './services/guard.service';
import { Access } from './directives/access.directive';
import { Validator } from './services/validator.service';
import { Request } from './services/request.service';
import { InputUploadComponent } from './components/inputs/upload/upload.component';
import { InputNumberComponent } from './components/inputs/number/number.component';
import { InputNumberRangeComponent } from './components/inputs/numberrange/numberrange.component';
import { TableComponent } from './components/table/table.component';
import { SelectComponent } from './components/inputs/select/select.component';
import { Modal } from './services/modal.service';
import { FilterComponent } from './components/filter/filter.component';
import { FormComponent } from './components/form/form.component';
import { LoadingComponent } from './components/loading/loading.component';
import { InputDateRangeComponent } from './components/inputs/daterange/daterange.component';
import { ImportComponent } from './components/import/import.component';
import { DetailComponent } from './components/detail/detail.component';
import { ListComponent } from './components/list/list.component';
import { Toast } from './services/toast.service';
import { Helper } from './services/helper.service';
import { InputSortableListComponent } from './components/sortable-list/sortable-list.component';
import { InputCalendarComponent } from './components/inputs/calendar/calendar.component';
import { InputDateComponent } from './components/inputs/date/date.component';
import { RouterModule } from '@angular/router';
import { ComponentInjector } from './services/component-injector.service';
import { ModalComponent } from './components/modal/modal.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
	declarations: [
		InputUploadComponent,
		InputNumberComponent,
		InputNumberRangeComponent,
		TableComponent,
		SelectComponent,
		ModalComponent,
		FilterComponent,
		FormComponent,
		LoadingComponent,
		InputDateRangeComponent,
		ImportComponent,
		DetailComponent,
		ListComponent,
		ToastComponent,
		InputSortableListComponent,
		InputCalendarComponent,
		InputDateComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		Access
	],
	exports: [
		InputUploadComponent,
		InputNumberComponent,
		InputNumberRangeComponent,
		TableComponent,
		SelectComponent,
		ModalComponent,
		FilterComponent,
		FormComponent,
		LoadingComponent,
		InputDateRangeComponent,
		ImportComponent,
		DetailComponent,
		ListComponent,
		ToastComponent,
		InputSortableListComponent,
		InputCalendarComponent,
		InputDateComponent,
		Access
	],
	providers: [
		Modal,
		Toast,
		Request,
		Validator,
		LoginGuard,
		AuthGuard,
		Helper,
		ComponentInjector
	]
})
export class NxCoreModule { }
