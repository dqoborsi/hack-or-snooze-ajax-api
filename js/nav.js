"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// called when user clicks submit in navbar. runs the addStory function we made in models.js, then appends it to the top of the stories HTML list (UI)

function navSubmitStoryClick() {
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

function navFavsClick(){
  hidePageComponents();
  putFavsListOnPg();
}

function navToMyStories(){
  hidePageComponents();
  putUserStoriesOnPg();
  $ownStories.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);
$navFavorites.on("click", navFavsClick);
$navStories.on('click', navToMyStories);