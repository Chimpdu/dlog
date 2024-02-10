import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';

import Error from './Error';

function Register() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const { t, i18n } = useTranslation();
    const { language } = useContext(LanguageContext);
    // Initialize userData with empty strings for username and password
    const [userData, setUserData] = useState({ username: '', password: '' });

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language, i18n]);

    function submitForm(event) {
        event.preventDefault();
        fetch("http://localhost:5000/users/register", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData),
            mode: "cors"
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
            } else {
                setErrors([]);
                navigate('/login');
            }
        })
        .catch(error => {
            // Handle network errors or issues with the fetch request
            setErrors([{ msg: error.message }]);
        })
        .finally(() => {
            // Clear the form fields by setting userData state to empty strings for each field
            setUserData({ username: '', password: '' });
        });
    }

    function handleChange(event) {
        setUserData({...userData, [event.target.name]: event.target.value});
    }

    return (
        <>
            {errors.length > 0 && errors.map((error, index) => (
                <Error key={index} error={typeof error === 'string' ? error : error.msg || "Unknown error"} />
            ))}

            <div className="valign-wrapper login-box">
                <div className="reg-login-card card hoverable">
                    <div className="card-content">
                        <span className="card-title"><strong>{t("Register")}</strong></span>
                        <div className="row">
                            <form className="col s12" onSubmit={submitForm}>
                                <div className="row">
                                    <div className="input-field col s12 m8 offset-m2 l6 offset-l3">
                                        <input id="username" type="text" name="username" className="validate" onChange={handleChange} value={userData.username || ''}/>
                                        <label htmlFor="username">{t('Username')}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12 m8 offset-m2 l6 offset-l3">
                                        <input id="password" type="password" name="password" className="validate" onChange={handleChange} value={userData.password || ''}/>
                                        <label htmlFor="password">{t('Password')}</label>
                                    </div>
                                </div>
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

export default Register;
