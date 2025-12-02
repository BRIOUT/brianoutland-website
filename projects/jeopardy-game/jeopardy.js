

const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const API_URL = "https://rithm-jeopardy.herokuapp.com/api";

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  // Fetch a large number of categories to choose from
  let response = await axios.get(`${API_URL}/categories`, {
    params: { count: 100 }
  });

  // Use lodash to sample NUM_CATEGORIES random categories
  let categoryIds = _.sampleSize(response.data, NUM_CATEGORIES).map(cat => cat.id);

  return categoryIds;
}


async function getCategory(catId) {
  let response = await axios.get(`${API_URL}/category`, {
    params: { id: catId }
  });

  let category = response.data;

  // Randomly pick NUM_QUESTIONS_PER_CAT clues from the category
  let allClues = category.clues;
  let randomClues = _.sampleSize(allClues, NUM_QUESTIONS_PER_CAT);

  // Format the clues
  let clues = randomClues.map(clue => ({
    question: clue.question,
    answer: clue.answer,
    showing: null
  }));

  return {
    title: category.title,
    clues: clues
  };
}


async function fillTable() {
  // Clear any existing content
  $("#jeopardy thead").empty();
  $("#jeopardy tbody").empty();

  // Create header row with category titles
  let $thead = $("<tr>");
  for (let category of categories) {
    $thead.append($("<th>").text(category.title));
  }
  $("#jeopardy thead").append($thead);

  // Create rows for questions
  for (let clueIdx = 0; clueIdx < NUM_QUESTIONS_PER_CAT; clueIdx++) {
    let $tr = $("<tr>");
    for (let catIdx = 0; catIdx < NUM_CATEGORIES; catIdx++) {
      $tr.append($("<td>")
        .attr("id", `${catIdx}-${clueIdx}`)
        .text("?"));
    }
    $("#jeopardy tbody").append($tr);
  }
}



function handleClick(evt) {
  let $tgt = $(evt.target);
  let id = $tgt.attr("id");

  // If no ID, it's not a clue cell
  if (!id) return;

  let [catIdx, clueIdx] = id.split("-");
  let clue = categories[catIdx].clues[clueIdx];

  let msg;

  if (!clue.showing) {
    // First click: show question
    msg = clue.question;
    clue.showing = "question";
    $tgt.html(msg);
    $tgt.addClass("showing-question");
  } else if (clue.showing === "question") {
    // Second click: show answer
    msg = clue.answer;
    clue.showing = "answer";
    $tgt.html(msg);
    $tgt.removeClass("showing-question");
    $tgt.addClass("showing-answer");
  } else {
    // Already showing answer, ignore click
    return;
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
  // Hide the table
  $("#jeopardy").hide();

  // Show the loading spinner
  $("#spin-container").show();

  // Update button text
  $("#start").text("Loading...");
  $("#start").prop("disabled", true);
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  // Hide the loading spinner
  $("#spin-container").hide();

  // Show the table
  $("#jeopardy").show();

  // Update button text
  $("#start").text("Restart!");
  $("#start").prop("disabled", false);
}


async function setupAndStart() {
  showLoadingView();

  // Get random category IDs
  let categoryIds = await getCategoryIds();

  // Reset categories array
  categories = [];

  // Get data for each category
  for (let catId of categoryIds) {
    let category = await getCategory(catId);
    categories.push(category);
  }

  // Fill the table with categories and clues
  fillTable();

  hideLoadingView();
}

/** On click of start / restart button, set up game. */

$("#start").on("click", setupAndStart);

/** On page load, add event handler for clicking clues */

$(document).ready(function() {
  $("#jeopardy").on("click", "td", handleClick);
});