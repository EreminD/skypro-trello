const axios = require('axios').default
const { faker } = require('@faker-js/faker');

const baseUrl = 'https://trello.com/1'
const token = '61790ff29348904bc42217da/bEp7IwPtm0HYRzI4qTB7MhMk1jA57uQdr7jxPHHbWeEzkYMJvrEDaO2VjDUqOQPL'

async function getAllBoards(organization){
    const url = baseUrl + `/Organizations/${organization}?boards=open&board_fields=all&fields=boards`

    // TODO: решить вот эту тему с копипастой
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

async function createRandomBoard(useDefaultLists = false){
    return await createBoard(faker.name.findName(), useDefaultLists)
}

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



module.exports = {
    getAllBoards,
    createRandomBoard,
    getAllLists,
    getAllCards,
    createBoard,
    deleteBoardById,
    deleteCardById,
    createCard,
    editCard,
    getCardById,
    getListOfCard,
    clearSpace
}