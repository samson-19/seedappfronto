import axios from "axios"
import { ApiUrl } from "../../helpers/ApiUrl"
import { getSupertoken } from "../../helpers/AccessToken"
import { AUTHENTICATION_ERROR, GET_USER, LOGIN_USER, REGISTER_USER, AUTH_USER_ERROR, RESET_PASSWORD } from "./types"



export function userRegister(data) {


    return async function(dispatch) {

        try {

            const response = await axios.post(`${ApiUrl}/user_register`, data)

            const mssg = response.data.msg

            dispatch({type: REGISTER_USER, payload: mssg})

            
        } catch (error) {

            console.log("there was an issue while user logged in", error)
     dispatch({type: AUTHENTICATION_ERROR})

            
        }
        
    }
}


export function userLogin(data) {
   return async function (dispatch) {
   try {

    const response = await axios.post(`${ApiUrl}/user_login`, data)

    if(response.data.msg) {
        alert(response.data.msg)

    } else {
        localStorage.setItem("usertoken", response.data.usertoken)
         window.location.href = "/"
            
    }

    dispatch({type: LOGIN_USER})




    
   } catch (error
   ) {
     console.log("there was an issue while user logged in", error)
     dispatch({type: AUTHENTICATION_ERROR})

    
   }

    }
}



export function userGet() {
    return async function(dispatch) {
        try {

            const usertoken = getSupertoken()

            if(!usertoken || usertoken === null || usertoken === undefined) {
                return ""
            }

            const response = await axios.get(`${ApiUrl}/user_user`, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })


            

            const user = response.data.user

            

            dispatch({type: GET_USER, payload: user})
            
        } catch (error) {
            console.error(error)
            dispatch({type: AUTH_USER_ERROR})
            throw error
        }
    }
}


export function userForgotPassword(data) {

    return async function(dispatch) {

try {

    const response = await axios.post(`${ApiUrl}/user_forgot_password`, data)

    const accessToken = response.data.accessToken
    
    if(response.data.accessToken) {
        window.location.href = `/auth/reset/${accessToken}`
    } else{
        alert(response.data.msg)
    }

    
    
} catch (error) {

            console.error(error)
            dispatch({type: AUTHENTICATION_ERROR})
            throw error
    
}

    }


}



export function userResetPassword(data, usertoken) {

    return async function(dispatch) {

        try {

            const response = await axios.put(`${ApiUrl}/user_reset_password`, data, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })

            const mssg = response.data.msg

            dispatch({type: RESET_PASSWORD, payload: mssg})


            
        } catch (error) {

            console.error(error)
            dispatch({type: AUTHENTICATION_ERROR})
            throw error
    
            
        }

    }
}