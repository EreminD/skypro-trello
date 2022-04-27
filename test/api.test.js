const { expect } = require('chai')
const { afterEach } = require('mocha')
const axios = require('axios').default

const baseUrl = 'https://trello.com/1'
const token = '61790ff29348904bc42217da/bEp7IwPtm0HYRzI4qTB7MhMk1jA57uQdr7jxPHHbWeEzkYMJvrEDaO2VjDUqOQPL'
const orgId = '617910020c566f69cac8e33d'

describe('Trello. API. Тесты доски', () => {
    let newBoardId;

    afterEach('Удаление новой доски', async () => {
        if(newBoardId !== null){
            await deleteBoardById(newBoardId)
            newBoardId = null
        }
    })

    it('Создание новой доски', async () => {
        // получить список существующих досок -> размер списка = х
        let boards = await getAllBoards(orgId);
        const boardCountBefore = boards.length

        // создать доску
        newBoardId = await createBoard('api test')

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
        expect(boardCountBefore-boardCountAfter).equals(1)
    })
})

describe('Trello. API. Тесты карточки', () => {

    let tempBoardId
    let tempListId
    let tempListIdNew
    let tempCardId

    beforeEach('Создаем доску и списки', async () => {
        tempBoardId = await createBoard('temp board for card tests', true)
        const lists = await getAllLists(tempBoardId)
        tempListId = lists[0].id
        tempListIdNew = lists[1].id
    })

    afterEach('Удаляем доску и списки', async () => {
        if(tempBoardId !== null){
            await deleteBoardById(tempBoardId)
            tempBoardId = null
        }
    })

    before('Удаляем все доски', async () => {
        await clearSpace(orgId)
    })

    it('Создание новой карточки', async () => {  
        // создать карточку
        await createCard(tempBoardId, tempListId, 'test card api')

        // получить список существующих карточек -> размер списка = у
        const cards = await getAllCards(tempBoardId);
        const cardCountAfter = cards.length

        // проверить, что количество карточек === 1
        expect(cardCountAfter).equals(1)
    })
    
    it('Редактирование новой карточки', async () => {  
        // 1. создать карточку
        tempCardId = await createCard(tempBoardId, tempListId, 'test card api')

        // 2. отредактировать карточку
        const newName = 'card edited'
        await editCard(tempCardId, 'name', newName)

        // 3. получить инфо по карточке
        const cardData = await getCardById(tempCardId) 

        // 4. проверить, что имя карточки === имени из шага 2 
        expect(cardData.name).equals(newName)
    })
    it('Перетаскивание  карточки', async () => {  
        // 1. создать карточку
        tempCardId = await createCard(tempBoardId, tempListId, 'test card api')

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
        tempCardId = await createCard(tempBoardId, tempListId, 'test card api')
    
        // получить список существующих карточек -> размер списка = у
        await deleteCardById(tempCardId);
        
        const cards = await getAllCards(tempBoardId);
        const cardCountAfter = cards.length

        // проверить, что количество карточек === 
        expect(cardCountAfter).equals(0)
    })

    // - Перемещение карточки в другую колонку
    
})

async function getAllBoards(organization){
    const url = baseUrl + `/Organizations/${organization}?boards=open&board_fields=all&fields=boards`

    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const response = await axios.get(url, reqConfig)
    return response.data.boards
}

async function getAllLists(boardId){
    const url = `${baseUrl}/boards/${boardId}/lists`
    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const response = await axios.get(url, reqConfig)
    return response.data
}

async function getAllCards(boardId){
    const url = `${baseUrl}/boards/${boardId}/cards`
    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const response = await axios.get(url, reqConfig)
    return response.data
}

// TODO: name generator
async function createBoard(boardName, useDefaultLists = false){
    const url = baseUrl + '/boards/'

    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const reqBody = {
        "defaultLists": useDefaultLists,
        "name": boardName,
        "token": token
    }
    
    const response = await axios.post(url, reqBody, reqConfig)
    console.log('Новая доска: ', response.data.id)
    return response.data.id
}

async function deleteBoardById(boardId) {
    const url = `${baseUrl}/boards/${boardId}`

    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    reqConfig.data = {
        "token": token
    }
    console.log('Удаляем доску: ', boardId);

    const response = await axios.delete(url, reqConfig)
    
    return response.status === 200
}

async function deleteCardById(id){
    const url = `${baseUrl}/cards/${id}`

    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    reqConfig.data = {
        "token": token
    }
    console.log('Удаляем карточку: ', id);

    const response = await axios.delete(url, reqConfig)
    
    return response.status === 200
}

async function createCard(boardId, listId, cardName){
    const url = `${baseUrl}/cards/`

    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const reqBody = {
        "name": cardName,
        "idBoard": boardId,
        "idList": listId,
        "token": token
    }

    const response = await axios.post(url, reqBody, reqConfig)
    console.log('Новая карточка: ', response.data.id)
    return response.data.id
}

async function editCard(cardId, propertyName, propertyValue){
    const url = `${baseUrl}/cards/${cardId}`
   
    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const reqBody = {}
    reqBody.token =  token
    reqBody[propertyName] = propertyValue
    
    const response = await axios.put(url, reqBody, reqConfig)
    console.log('Новая карточка: ', response.data.id)
    return response.data.id
}

async function getCardById(id){
    const url = `${baseUrl}/cards/${id}?fields=idBoard,name,desc,labels`
    
    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const response = await axios.get(url, reqConfig)
    return response.data
}

async function getListOfCard(id){
    const url = `${baseUrl}/cards/${id}/list`
    
    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const response = await axios.get(url, reqConfig)
    return response.data
}

async function clearSpace(orgId){
    const boards = await getAllBoards(orgId);

    for (let i = 0; i < boards.length; i++){
        const boardId = boards[i].id 
        await deleteBoardById(boardId)
    }
}



