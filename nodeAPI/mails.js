
exports.confirmationMailTemplate = function(user){
    var html = "<h3> Email confirmation <h3>"
    + "<p> Hello "+ user.name + ", click in following link to confirmate your email adress</p>"
    + "<p><a href='http://localhost:4200/confirmEmail/"+user.verificationToken+"'>Confirm account</a></p>";
    return html; 
}