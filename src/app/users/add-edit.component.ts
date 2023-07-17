import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UsuariosService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private usuariosService: UsuariosService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        
        this.form = this.formBuilder.group({
            nome: ['', Validators.required],
            sobrenome: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            permissao: ['', Validators.required],
            senha: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]],
            confirmarSenha: ['', [...(!this.id ? [Validators.required] : [])]]
        }, {
            validators: MustMatch('senha', 'confirmarSenha')
        });

        this.title = 'Adicionar Usuário';
        if (this.id) {
            // edit mode
            this.title = 'Editar Usuário';
            this.loading = true;
            this.usuariosService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    console.log(x);
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.salvarUsuario()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Usuário Salvo', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/usuarios');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private salvarUsuario() {
        return this.id
            ? this.usuariosService.update(this.id!, this.form.value)
            : this.usuariosService.create(this.form.value);
    }
}