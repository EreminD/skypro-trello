const {By} = require('selenium-webdriver');

const locators = {
    createBoardMenu: By.css('[data-test-id="header-create-menu-button"]'),
    createBoardButton: By.css('[data-test-id="header-create-board-button"]'),
    createBoardTitle: By.css('[data-test-id="create-board-title-input"]'),
    createBoardSubmit: By.css('[data-test-id="create-board-submit-button"]'),
    boardNameLabel: By.css('h1.js-board-editing-target.board-header-btn-text'),
    boardsOnSpace: By.css('li.boards-page-board-section-list-item'),
    boardMenu: By.css('a.mod-show-menu'),
    menuMoreItem: By.css('span.icon-overflow-menu-horizontal.board-menu-navigation-item-link-icon'),
    closeBoard: By.css('a.js-close-board'),
    closeBoardSubmit: By.css('input[value="Закрыть"]'),
    deleteBoard: By.css('[data-test-id="close-board-delete-board-button"]'),
    deleteBoardSubmit: By.css('[data-test-id="close-board-delete-board-confirm-button"]'),
    addACard: By.css('.js-add-a-card'),
    addACardButton: By.css('input[value="Добавить карточку"]'),
    card: By.css('.list-card-details.js-card-details'),
    archiveCard: By.css('[title="Архивация"]'),
    deleteCard: By.css('[title="Удалить"]'),
    deleteCardSubmit: By.css('.js-confirm[value="Удалить"]'),
    lists: By.css('.list.js-list-content'),
}

module.exports = {locators}
