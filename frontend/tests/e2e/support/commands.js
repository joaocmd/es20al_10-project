// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
/// <reference types="Cypress" />

/* ----------------------- */
/* Teacher Commands */

Cypress.Commands.add('createClarificationAnswer', (title, message) => {
  cy.contains(title)
    .parent()
    .should('have.length', 1)
    .find('[data-cy="viewClarification"]')
    .click();
  if (message != null) {
    cy.get('[data-cy="answerClarification"]').type(message);
  }
  cy.get('[data-cy="sendClarificationAnswerButton"]').click();
});

Cypress.Commands.add('makeClarificationAvailable', title => {
  cy.contains(title)
    .parent()
    .should('have.length', 1)
    .find('[data-cy="makeClarificationVisible"]')
    .click();
});
/* ----------------------- */
/* Student Commands */

Cypress.Commands.add('makeAndSolveQuiz', () => {
  cy.get('[data-cy="quizzesButton"]').click();
  cy.contains('Create').click();
  cy.get('[data-cy="createQuizButton"]').click();
  cy.get('[data-cy="endQuizButton"]').click();
  cy.get('[data-cy="endQuizImSureButton"]').click();
});

Cypress.Commands.add('clarificationDashboard', () => {
  cy.get('[data-cy="clarificationsButton"]').click();
  cy.contains('Dashboard').click();
  cy.get('[data-cy="clarificationsButton"]').click();
});

Cypress.Commands.add('clarificationList', () => {
  cy.get('[data-cy="clarificationsButton"]').click();
  cy.get('[data-cy="clarificationListMine"]').click();
  cy.get('[data-cy="clarificationsButton"]').click();
});

Cypress.Commands.add('availableClarificationsList', () => {
  cy.get('[data-cy="clarificationsButton"]').click();
  cy.get('[data-cy="clarificationListAll"]').click();
  cy.get('[data-cy="clarificationsButton"]').click();
});

Cypress.Commands.add('createClarification', clarificationMessage => {
  cy.get('[data-cy="quizzesButton"]').click();
  cy.contains('Solved').click();
  cy.contains('Generated Quiz')
    .parent()
    .children()
    .eq(3)
    .find('i')
    .click();
  cy.get('[data-cy="createClarificationButton"]').click();
  if (clarificationMessage != null)
    cy.get('[data-cy="clarificationText"]').type(clarificationMessage);
  cy.get('[data-cy="sendClarificationButton"]').click();
});

Cypress.Commands.add('checkClarification', title => {
  cy.contains(title)
    .parent()
    .children()
    .should('have.length', 5);
});

Cypress.Commands.add('checkClarificationAnswered', (title, isAnswered) => {
  let icon = isAnswered ? 'answered' : 'notAnswered';
  cy.contains(title)
    .parent()
    .children()
    .should('have.length', 5)
    .find('[data-cy="' + icon + '"]')
    .should('have.length', 1);
});

Cypress.Commands.add('checkForClarificationAnswer', (title, message) => {
  cy.contains(title)
    .parent()
    .should('have.length', 1)
    .find('[data-cy="viewClarification"]')
    .click();
  cy.contains(message);
});

Cypress.Commands.add('openCreditedClarifications', () => {
  cy.get('[data-cy="clarificationCreditedButton"]').click();
});

Cypress.Commands.add('openClarificationList', () => {
  cy.get('[data-cy="clarificationListButton"]').click();
});

Cypress.Commands.add('createTournament', (name, start, end) => {
  cy.get('[data-cy="createButton"]').click();

  cy.get('label')
    .contains('Starting Date')
    .parent()
    .children('input')
    .click();
  cy.get('.v-date-picker-header')
    .eq(0)
    .children()
    .eq(2)
    .click();
  cy.get('button:contains(' + start + ')')
    .eq(1)
    .click();
  cy.get('button:contains("OK")')
    .eq(0)
    .click();

  cy.get('label')
    .contains('Conclusion Date')
    .parent()
    .children('input')
    .click();
  cy.get('.v-date-picker-header')
    .eq(1)
    .children()
    .eq(2)
    .click();
  cy.get('button:contains(' + end + ')')
    .eq(2)
    .click();
  cy.get('button:contains("OK")')
    .eq(1)
    .click();

  cy.get('[data-cy="Topics"]').click();
  cy.get('[role="listbox"]')
    .children()
    .eq(0)
    .click();
  cy.get('[role="listbox"]')
    .children()
    .eq(1)
    .click();
  if (name) {
    cy.get('[data-cy="Title"]').type(name);
  }

  cy.get('[data-cy="saveButton"]').click();
});

Cypress.Commands.add('cancelTournament', name => {
  cy.contains(name)
    .parent()
    .should('have.length', 1)
    .children()
    .should('have.length', 7)
    .find('[data-cy="cancel"]')
    .click();

  cy.get('[data-cy="executeCancelButton"]').click();
});

Cypress.Commands.add('signUpForTournament', name => {
  cy.contains(name)
    .parent()
    .should('have.length', 1)
    .children()
    .should('have.length', 7)
    .find('[data-cy="signUp"]')
    .click();

  cy.get('[data-cy="executeSignUpButton"]').click();
});

Cypress.Commands.add('seeSignedUpTournaments', () => {
  cy.get('[data-cy="filter"]').click();
  cy.contains('Signed Up Tournaments').click();
});

Cypress.Commands.add('seeRunningTournaments', () => {
  cy.get('[data-cy="filter"]').click();
  cy.contains('Running Tournaments').click();
});

Cypress.Commands.add('seeMyTournaments', () => {
  cy.get('[data-cy="filter"]').click();
  cy.contains('My Tournaments').click();
});

/* ----------------------- */
/* ADMIN Commands */

Cypress.Commands.add('createCourseExecution', (name, acronym, academicTerm) => {
  cy.get('[data-cy="createButton"]').click();
  cy.get('[data-cy="courseExecutionNameInput"]').type(name);
  cy.get('[data-cy="courseExecutionAcronymInput"]').type(acronym);
  cy.get('[data-cy="courseExecutionAcademicTermInput"]').type(academicTerm);
  cy.get('[data-cy="saveButton"]').click();
});

Cypress.Commands.add(
  'createFromCourseExecution',
  (name, acronym, academicTerm) => {
    cy.contains(name)
      .parent()
      .should('have.length', 1)
      .children()
      .should('have.length', 7)
      .find('[data-cy="createFromCourse"]')
      .click();
    cy.get('[data-cy="courseExecutionAcronymInput"]').type(acronym);
    cy.get('[data-cy="courseExecutionAcademicTermInput"]').type(academicTerm);
    cy.get('[data-cy="saveButton"]').click();
  }
);

Cypress.Commands.add('deleteCourseExecution', acronym => {
  cy.contains(acronym)
    .parent()
    .should('have.length', 1)
    .children()
    .should('have.length', 7)
    .find('[data-cy="deleteCourse"]')
    .click();
});
/* ----------------------- */
/* Universal Commands */

Cypress.Commands.add('closeErrorMessage', () => {
  cy.contains('Error')
    .parent()
    .find('button')
    .click();
});

Cypress.Commands.add('closeSuccessMessage', successMessage => {
  cy.contains(successMessage)
    .parent()
    .find('button')
    .click();
});

/* ----------------------- */

Cypress.Commands.add('addClarificationToDB', content => {
  let pg_name = Cypress.env('db_name');
  let pg_user = Cypress.env('db_username');
  let pg_password = Cypress.env('db_password');

  let questionId = '1786';
  let studentKey = '678';

  cy.exec(
    'psql -c "INSERT INTO clarifications(content, question_id, user_id, is_answered) ' +
      `VALUES ('${content}', ${questionId}, ${studentKey}, FALSE);" ` +
      `postgres://${pg_user}:${pg_password}@localhost:5432/${pg_name}`
  );
});

/* ----------------------- */
