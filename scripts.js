document.addEventListener('DOMContentLoaded', function() {
    // Load the Google API client library
    gapi.load('auth2', function() {
        // Initialize the Google Auth2 library
        gapi.auth2.init({
            client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
        }).then(function(auth2) {
            // Attach the click handler to the sign-in button
            document.getElementById('google-signin-button').addEventListener('click', function() {
                auth2.signIn().then(function(googleUser) {
                    // Handle the sign-in response
                    var profile = googleUser.getBasicProfile();
                    console.log('ID: ' + profile.getId());
                    console.log('Name: ' + profile.getName());
                    console.log('Image URL: ' + profile.getImageUrl());
                    console.log('Email: ' + profile.getEmail());
                }, function(error) {
                    console.error('Sign-in error', error);
                });
            });
        });
    });
});