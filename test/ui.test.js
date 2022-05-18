const { expect } = require('chai');
const {Capabilities, Builder, By, until, WebElementCondition, Key} = require('selenium-webdriver');
const { faker } = require('@faker-js/faker');
const { clearSpace, createRandomBoard } = require('../src/api.helper');
const config = require('../config.json')
const {locators} = require('./locators')

const orgId = config.orgId
const token = config.access_token
const url = config.urlUi
const timer = config.timer

let driver

describe('Trello. UI. Тесты доски', () => {
    beforeEach('Открываем Trello', async () => {
        await clearSpace(orgId)

        const browserName = Capabilities.safari()
        driver = await new Builder().withCapabilities(browserName).build();
        driver.manage().setTimeouts({implicit: 4000})
        driver.manage().window().maximize()
        await driver.get(url)
        await driver.manage().addCookie({name:'token', value: token })
        await driver.navigate().refresh()
    
    })

    afterEach('Тушим драйвер', async () => {
        await driver.quit()
    })

    it('Создание новой доски', async () => {
        // нажать кнопку Создать
        await driver.findElement(locators.createBoardMenu).click()
        await driver.findElement(locators.createBoardButton).click()

        // заполнить форму
        const boardName = faker.name.findName()
        await driver.findElement(locators.createBoardTitle).sendKeys(boardName)
        await driver.wait(cssValueToBe(locators.createBoardSubmit, 'background-color', 'rgb(0, 121, 191)'), timer).click()
        
        // проверить, что отображается лэйбл и именем доски
        const text = await driver.findElement(locators.boardNameLabel).getText()
        expect(text).equals(boardName)
    })
    
    it('Удаление существующей доски', async () => {
        const board = await createRandomBoard(true)
        const boardName = board.name

        // собрать список досок. Нажать на доску с именем boardName 
        let boards = await driver.findElements(locators.boardsOnSpace)
        for(let i = 0; i < boards.length; i++){
            const text = await boards[i].getText()
            if(text === boardName){
                boards[i].click()
            }
        }

        // удалили доску
        await driver.findElement(locators.boardMenu).click()
        await driver.findElement(locators.menuMoreItem).click()
        await driver.findElement(locators.closeBoard).click()
        await driver.findElement(locators.closeBoardSubmit).click()
        await driver.findElement(locators.deleteBoard).click()
        await driver.findElement(locators.deleteBoardSubmit).click()

        // проверяем, что нет доски с именем boardName 
        boards = await driver.findElements(locators.boardsOnSpace)
        for(let i = 0; i < boards.length; i++){
            const text = await boards[i].getText()
            if(text === boardName){
                expect.fail(`Нашли доску с именем ${boardName}`)
            }
        }
    })
})

describe('Trello. UI. Тесты карточки', () => {

    beforeEach('Открываем Trello', async () => {
        await clearSpace(orgId)

        const browserName = Capabilities.safari()
        driver = await new Builder().withCapabilities(browserName).build();
        driver.manage().setTimeouts({implicit: 4000})
        driver.manage().window().maximize()
        await driver.get(url)
        await driver.manage().addCookie({name:'token', value: token })
        await driver.navigate().refresh()

        const board = await createRandomBoard(true)
        await driver.get(board.url)
    })

    afterEach('Тушим драйвер', async () => {
        await driver.quit()
    })

    it('Создание карточки', async () => {
        await createCard()
        // проверить, что на доске одна карточка
        const cards = await driver.findElements(locators.card)
        expect(cards.length).equals(1) 
    })

    it('Удаление карточки', async () => {
        // создать карточку через API
        await createCard('card to be deleted')

        // клик на карточку
        await driver.findElement(locators.card).click()

        // клик на архивация
        await driver.findElement(By.css('body')).sendKeys(Key.ARROW_DOWN)
        await driver.findElement(By.css('body')).sendKeys(Key.ARROW_DOWN)
        await driver.findElement(By.css('body')).sendKeys(Key.ARROW_DOWN)
        await driver.findElement(locators.archiveCard).click()
        
        // клик на -удалить
        
        const deleteButton = await driver.findElement(locators.deleteCard)
        await driver.executeScript("arguments[0].scrollIntoView()", deleteButton)
        await deleteButton.click()

        await driver.findElement(locators.deleteCardSubmit).click()

        const cards = await driver.findElements(locators.card)
        expect(cards.length).equals(0) 
    })

    it('Перетаскивание карточки', async () => {
        // создать карточку через API
        await createCard('card to be deleted')

        // собрать все колонки
        let lists = await driver.findElements(locators.lists)

        const card = await driver.findElement(locators.card)
        const targetList = lists[2]

        // перетащить карточку
        const actions = driver.actions({async: true});
        await actions.dragAndDrop(card, targetList).perform();

        // проверить, что в 1й колонке нет карточек
        const cardsToDo = await lists[0].findElements(locators.card)
        expect(cardsToDo.length).equals(0)

        // проверить, что в 3й колонке лежит одна карточка
        const cardsDone = await lists[2].findElements(locators.card)
        expect(cardsDone.length).equals(1) 
    })

})



function cssValueToBe(locator, cssProperty, valueToBe) {
    return new WebElementCondition('CSS value check', async (driver) => {
        const property = await driver.findElement(locator).getCssValue(cssProperty) 
        if (property === valueToBe) {
            return await driver.findElement(locator)
        }
    })
}

async function createCard(cardText){
    if (cardText === undefined){
        cardText = faker.animal.cat()
    }

    // клик на добавить карточку
    await driver.findElement(locators.addACard).click()

    // ввести имя
    await driver.wait(until.elementLocated(locators.addACardButton), timer)
    await driver.findElement(By.css('body')).sendKeys(cardText)
    
    // сохранить карточку
    await driver.findElement(locators.addACardButton).click()

}