const {
    expect
} = require('chai')
const {
    afterEach
} = require('mocha')
const {
    getAllBoards,
    getAllLists,
    getAllCards,
    createBoard,
    deleteBoardById,
    deleteCardById,
    createCard,
    editCard,
    getCardById,
    getListOfCard,
    clearSpace,
    createRandomBoard
} = require('../src/api.helper')
const config = require('../config.json')

const orgId = config.orgId

describe('Trello. API. Тесты доски', () => {
    let newBoard;
    afterEach('Удаление новой доски', async () => {
        if (newBoard !== null) {
            await deleteBoardById(newBoard.id)
            newBoard = null
        }
    })

    it('Создание новой доски', async () => {
        // получить список существующих досок -> размер списка = х
        let boards = await getAllBoards(orgId);
        const boardCountBefore = boards.length

        // создать доску
        newBoard = await createBoard('api test')

        // получить список существующих досок -> размер списка = у
        boards = await getAllBoards(orgId);
        const boardCountAfter = boards.length

        // проверить, что у-х === 1
        const diff = boardCountAfter - boardCountBefore
        expect(diff).equals(1)
    })

    it('Удаление существующей доски', async () => {
        //предварительно, создаем доску
        await createBoard('api test')

        // получить список существующих досок -> размер списка = х
        let boards = await getAllBoards(orgId);
        const boardCountBefore = boards.length

        // удалить доску
        const boardId = boards[0].id
        const isDeleted = await deleteBoardById(boardId)

        // получить список существующих досок -> размер списка = у
        boards = await getAllBoards(orgId);
        const boardCountAfter = boards.length

        // проверить, что у-х === 1
        expect(isDeleted).true
        expect(boardCountBefore - boardCountAfter).equals(1)
    })
})

describe('Trello. API. Тесты карточки', () => {

    let tempBoard
    let tempListId
    let tempListIdNew
    let tempCardId

    beforeEach('Создаем доску и списки', async () => {
        tempBoard = await createRandomBoard(true)
        const lists = await getAllLists(tempBoard.id)
        tempListId = lists[0].id
        tempListIdNew = lists[1].id
    })

    afterEach('Удаляем доску и списки', async () => {
        if (tempBoard !== null) {
            await deleteBoardById(tempBoard.id)
            tempBoard = null
        }
    })

    before('Удаляем все доски', async () => {
        await clearSpace(orgId)
    })

    it('Создание новой карточки', async () => {
        // создать карточку
        await createCard(tempBoard.id, tempListId, 'test card api')

        // получить список существующих карточек -> размер списка = у
        const cards = await getAllCards(tempBoard.id);
        const cardCountAfter = cards.length

        // проверить, что количество карточек === 1
        expect(cardCountAfter).equals(1)
    })

    it('Редактирование новой карточки', async () => {
        // 1. создать карточку
        tempCardId = await createCard(tempBoard.id, tempListId, 'test card api')

        // 2. отредактировать карточку
        const newName = 'card edited'
        await editCard(tempCardId, 'name', newName)

        // 3. получить инфо по карточке
        const cardData = await getCardById(tempCardId)

        // 4. проверить, что имя карточки === имени из шага 2 
        expect(cardData.name).equals(newName)
    })

    // - Перемещение карточки в другую колонку
    it('Перетаскивание  карточки', async () => {
        // 1. создать карточку
        tempCardId = await createCard(tempBoard.id, tempListId, 'test card api')

        // 2. отредактировать карточку
        const newList = tempListIdNew
        await editCard(tempCardId, 'idList', newList)

        // 3. получить инфо по карточке
        const list = await getListOfCard(tempCardId)

        // 4. проверить, что имя карточки === имени из шага 2 
        expect(list.id).equals(newList)
    })

    it('Удаление карточки', async () => {
        // создать карточку
        tempCardId = await createCard(tempBoard.id, tempListId, 'test card api')

        // получить список существующих карточек -> размер списка = у
        await deleteCardById(tempCardId);

        const cards = await getAllCards(tempBoard.id);
        const cardCountAfter = cards.length

        // проверить, что количество карточек === 
        expect(cardCountAfter).equals(0)
    })



})