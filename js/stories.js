"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = !!currentUser;

  // <i class="far fa-star"></i>

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getDeleteBtnHTML() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>
  `
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function getStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>
  `
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(e){
  e.preventDefault();

  let title = $("#create-title").val();
  // URL MUST HAVE HTTPS:// BEFORE OR GIVES 400 ERROR
  let url = $("#create-url").val();
  let author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = {title, url, author, username};
  // storyList is an instance of StoryList, so it has addStory method (which is not static)
  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $submitForm.toggle('.hidden');
}

async function toggleFavorite(e) {
  const $tgt = $(e.target);
  const $closestLi = $tgt.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  } else {
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

function putFavsListOnPg(){
  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append('<h3>No favorites yet!</h3>')
  }
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoritedStories.append($story);
  }

  $favoritedStories.show();
}

async function deleteStory(e) {
  const $closestLi = $(e.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPg();
}

function putUserStoriesOnPg() {
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append('<h3>No stories added by you yet!</h3>');
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

async function deleteStory(e){
  const $closestLi = $(e.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPg();
}

$ownStories.on('click', '.trash-can', deleteStory);

$submitForm.on('submit', submitNewStory);
$allStoriesList.on('click', '.star', toggleFavorite);
$favoritedStories.on('click', '.star', toggleFavorite);
