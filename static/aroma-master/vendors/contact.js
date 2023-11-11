$(document).ready(function(){
    
    (function($) {
        "use strict";

    
    jQuery.validator.addMethod('answercheck', function (value, element) {
        return this.optional(element) || /^\bcat\b$/.test(value)
    }, "type the correct answer -_-");

    // validate contactForm form
    $(function() {
        $('#contactForm').validate({
            rules: {
                title: {
                    required: true,
                    minlength: 2
                },
                release_year: {
                    required: true,
                    minlength: 4
                },
                movie_length: {
                    required: true,
                    minlength: 2
                },
                genre: {
                    required: true,
                    minlength: 2
                },
                language: {
                    required: true,
                    minlength: 2
                },
                imdb_url: {
                    required: true,
                    minlength: 4
                }
            },
            messages: {
                title: {
                    required: "Write Title",
                    minlength: "Title must consist of at least 2 characters"
                },
                release_year: {
                    required: "Write Release year",
                    minlength: "Movie's release_year must consist of at least 4 characters"
                },
                movie_length: {
                    required: "Write Length",
                    minlength: "Length must consist of at least 2 characters"
                },
                genre: {
                    required: "Write Genre",
                    minlength: "Movie's title must consist of at least 2 characters"
                },
                language: {
                    required: "Write Language",
                    minlength: "Language must consist of at least 2 characters"
                },
                imdb_url: {
                    required: "Write IMDB url",
                    minlength: "IMDB url must consist of at least 4 characters"
                },
            },
            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    type:"POST",
                    data: $(form).serialize(),
                    url:"contact_process.php",
                    success: function() {
                        $('#contactForm :input').attr('disabled', 'disabled');
                        $('#contactForm').fadeTo( "slow", 1, function() {
                            $(this).find(':input').attr('disabled', 'disabled');
                            $(this).find('label').css('cursor','default');
                            $('#success').fadeIn()
                            $('.modal').modal('hide');
		                	$('#success').modal('show');
                        })
                    },
                    error: function() {
                        $('#contactForm').fadeTo( "slow", 1, function() {
                            $('#error').fadeIn()
                            $('.modal').modal('hide');
		                	$('#error').modal('show');
                        })
                    }
                })
            }
        })
    })
        
 })(jQuery)
})