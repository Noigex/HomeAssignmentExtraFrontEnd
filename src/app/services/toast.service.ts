import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) {}

  showError(detail: string) {
    this.messageService.add({severity:'error', summary: 'Error', detail:detail});
  }


  showSucess(detail: string) {
    this.messageService.add({severity:'success', summary:'Success', detail:detail});
  }
}
