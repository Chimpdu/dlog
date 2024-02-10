import React, { useState } from 'react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

import Error from './Error';
function Login() {
    const { checkAuthStatus } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState("");
    const { t, i18n } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [userData, setUserData] = useState({});
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language, i18n]);

    function submitForm(event) {
        event.preventDefault();
        fetch("http://localhost:5000/users/login", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData),
            mode: "cors",
            credentials: "include"
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(obj => {
            if (obj.status !== 200) {
                // Handle validation errors or other HTTP errors
                if (obj.body.errors) {
                    setErrors(obj.body.errors);
                } else {
                    // Handle other types of errors (e.g., server issues)
                    setErrors([{ msg: 'An unexpected error occurred' }]);
                }
                // Clear the form fields by setting userData state to empty strings for each field
                setUserData({ username: '', password: '' });
            } else {
                setErrors([]);
                checkAuthStatus();
                navigate('/');
            }
        })
        .catch(error => {
            // Handle network errors or issues with the fetch request
            setErrors([{ msg: error.message }]);
            // Clear the form fields by setting userData state to empty strings for each field
            setUserData({ username: '', password: '' });
        });
    }
    
    function handleChange(event) {
        setUserData({...userData, [event.target.name]: event.target.value});
    }

    return (
        <>
            {
                errors && errors.length > 0 && errors.map((error, index) => {
                    // Check if error is a string directly or if it's an object with a 'msg' property
                    const errorMessage = typeof error === 'string' ? error : error.msg ? error.msg.toString() : "Unknown error";
                    return <Error key={index} error={errorMessage} />;
                    })
            }

            <div className="valign-wrapper login-box">
                <div className="reg-login-card card hoverable">
                    <div className="card-content">
                        <span className="card-title"><strong>{t("Log in")}</strong></span>
                        <div className="row">
                            <form className="col s12" onSubmit={submitForm}>
                                <div className="row">
                                    <div className="input-field col s12 m8 offset-m2 l6 offset-l3">
                                        <input id="username" type="text" name="username" className="validate" onChange={(event)=>{handleChange(event)}} value={userData.username || ''}/>
                                        <label htmlFor="username">{t('Username')}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12 m8 offset-m2 l6 offset-l3">
                                        <input id="password" type="password" name="password" className="validate" onChange={(event)=>{handleChange(event)}} value={userData.password || ''}/>
                                        <label htmlFor="password">{t('Password')}</label>
                                    </div>
                                </div>
                                {/* Add a submit button */}
                                <div className="row">
                                    <div className="col s12 center-align">
                                        <button type="submit" className="btn">{t('Submit')}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
