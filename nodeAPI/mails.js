//var baseAppUrl = "http://angularwords.esy.es"
var baseAppUrl = "http://localhost:4200"

exports.confirmationMailTemplate = function(user){
    var url = baseAppUrl + "/confirmEmail/" + user.verificationToken;
    var html = "<h3> Email confirmation <h3>"
    + "<p> Hello "+ user.name + ", click in following link to confirmate your email adress</p>"
    + "<p><a href='"+url+"'>Confirm account</a></p>";
    return html; 
}