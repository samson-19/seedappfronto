import { FORGOT_PASSWORD, GET_USER,  LOGIN_USER, REGISTER_USER, RESET_PASSWORD } from "../actions/types"




export function userRdcr(state={}, action) {
    switch(action.type) {
        case LOGIN_USER:
            return {...state, authenticated: true}

        case GET_USER:
            return{...state, user: action.payload} 
            
            
        case REGISTER_USER:
            return {...state, mssg: action.payload} 
            
            
        case FORGOT_PASSWORD:
            return{...state, authenticated: false }
            
        case RESET_PASSWORD:
            return{...state, mssg: action.payload}    
        
            
        default:
            return state

    }
}