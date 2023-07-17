import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UsuariosService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    usuarios?: any[];

    constructor(private usuariosService: UsuariosService) {}

    ngOnInit() {
        this.usuariosService.getAll()
            .pipe(first())
            .subscribe(usuarios => this.usuarios = usuarios);
    }

    deletarUsuarios(id: string) {
        const user = this.usuarios!.find(x => x.id === id);
        user.isDeleting = true;
        this.usuariosService.delete(id)
            .pipe(first())
            .subscribe(() => this.usuarios = this.usuarios!.filter(x => x.id !== id));
    }
}