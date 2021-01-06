import { createReducer, on } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { setItems, unSetItems } from './ingreso-egreso.actions';
import { AppState } from 'src/app/app.reducer';

export interface State {
    items: IngresoEgreso[]; 
}

//Nuevo state que extiende del appstate principal, para agregarle el state del reducer ingresosEgresos cargado con lazyload
export interface AppStateWithIngresoEgreso extends AppState {
    ingresosEgresos: State
}

export const initialState: State = {
   items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,

    on(setItems, (state, {items}) => ({ ...state, items: [...items]  })),
    on(unSetItems, state => ({ ...state, items:[] })),

);

export function ingresoEgresoReducer(state, action) {
    return _ingresoEgresoReducer(state, action);
}