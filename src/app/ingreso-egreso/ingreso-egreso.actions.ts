import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const unSetItems = createAction('[IngresEgreso] UnSet Items');
export const setItems = createAction('[IngresEgreso] Set Items',
    props<{items: IngresoEgreso[]}>()
);