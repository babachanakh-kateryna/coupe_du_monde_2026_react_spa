import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { AuthService } from '../../api/services/AuthService';
import { TicketService } from '../../api/services/TicketService';

type User = {
    firstname: string;
    lastname: string;
    email: string;
};

type State = {
    isAuthenticated: boolean;
    user: User | null;
    cartCount: number;
};

type Action =
            | { type: 'SET_AUTH'; payload: { isAuthenticated: boolean; user: User | null } }
            | { type: 'UPDATE_CART'; payload: number }
            | { type: 'LOGOUT' };


const initialState: State = {
    isAuthenticated: false,
    user: null,
    cartCount: 0,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_AUTH':
            return { ...state, isAuthenticated: action.payload.isAuthenticated, user: action.payload.user };
        case 'UPDATE_CART':
            return { ...state, cartCount: action.payload };
        case 'LOGOUT':
            return { ...initialState };
        default:
            return state;
    }
}

type AppContextType = {
    state: State;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    refreshCart: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

    export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const login = async () => {
        try {
            const user = await AuthService.me();
            dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: true, user } });
            await refreshCart();
        } catch {
            dispatch({ type: 'LOGOUT' });
        }
    };

    const logout = async () => {
        await AuthService.signout();
        dispatch({ type: 'LOGOUT' });
    };

    const refreshCart = async () => {
        try {
            const cart = await TicketService.getPendingTickets();
            dispatch({ type: 'UPDATE_CART', payload: cart.tickets.length });
        } catch {
            dispatch({ type: 'UPDATE_CART', payload: 0 });
        }
    };

    useEffect(() => {
        login();
    }, []);

    return (
        <AppContext.Provider value={{ state, login, logout, refreshCart }}>{children}</AppContext.Provider>
    );
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};