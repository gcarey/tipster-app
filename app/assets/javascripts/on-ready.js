$(document).ready(function(){
	// Site-wide
  setTimeout(function(){
    $('.alert').fadeOut(500, function() { $(this).remove(); });
  }, 3000);

	  // Find Friends
	  function popupCenter(url, width, height, name) {
	    var left = (screen.width/2)-(width/2);
	    var top = (screen.height/2)-(height/2);
	    return window.open(url, name, "menubar=no,toolbar=no,status=no,width="+width+",height="+height+",toolbar=no,left="+left+",top="+top);
	  }

	  $("a.popup").click(function(e) {
	    popupCenter($(this).attr("href")+"?popup=true", $(this).attr("data-width"), $(this).attr("data-height"), "authPopup");
	    e.stopPropagation(); return false;
	  });

	  // Settings
	  Dropzone.autoDiscover = false;
})


// Profile
$(".users.show").ready(function(){
  if ( $(window).width() > 768) {     
	  var $profile = $('.profile-page')
		$('.counts').on( 'click', '.filter', function() {
		  var filterValue = $(this).attr('data-filter');
		  $profile.isotope({ filter: filterValue });
		  $('.filter').toggleClass("active");
		});
	}
	console.dir("is profile")
})


// Inbox
$(".pages.inbox").ready(function(){
  if ( $(window).width() > 768) { 
	  var $inbox = $('.inbox-page')
		$('.filters').on( 'click', 'label', function() {
		  var filterValue = $(this).attr('data-filter');
		  $inbox.isotope({ filter: filterValue });
		  $('.active').removeClass("active");
		  $(this).toggleClass("active");
		});
	}

	$('.tip').on( 'click', 'h3, img', function() {
	  location.reload();
	});
})


// Mobile Settings
$(".pages.mobile_settings").ready(function(){

	var uploadPhoto = new Dropzone(".dropzone", {
			maxFilesize: 10,
			paramName: "user[avatar]",
			maxFiles: 1,
			thumbnailWidth: 190,
			thumbnailHeight: 190,
	});

	uploadPhoto.on("success", function(file) {
		$(".dropzone").prepend("<div class='success-msg'><h3>Looking Good!</h3></div>");
		$(".dropzone").append("<div class='success-msg'><p>Here's your new profile photo.<br>Happy with it?</p><a href='http://www.tipster.to' class='btn btn-primary'>Return to Profile</a><p>Want to try again?</p><a id='retry' class='btn btn-default'>Upload Another</a>");


		$(".dropzone").on( 'click', '#retry', function() {
			$('.success-msg').remove();
		 	uploadPhoto.enable();
			uploadPhoto.removeAllFiles();
		});
  });

  $(".m-notification-toggle").on( 'click', 'a', function() {
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
	});
})


// Omni
$(".popups.failure").ready(function(){
  $( '.closer' ).click(function() {
		window.close()
  });
});
