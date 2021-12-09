function isEmpty(value){
    return !value || value.trim() === '';
}

function isUserCredentialsValid(email, password){
    return email && email.includes('@') && password && password.trim().length >= 6;
}

function isUserDetailValid(email, password, name, address, zipcode, city){
    return ( isUserCredentialsValid(email, password) && !isEmpty(name) && !isEmpty(address) && !isEmpty(zipcode) && !isEmpty(city));
}

function emailIsConfirmed(email, confirmEmail){
    return email === confirmEmail;
}

module.exports = {
    isUserDetailValid: isUserDetailValid,
    emailIsConfirmed: emailIsConfirmed   
}