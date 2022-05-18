const axios = require('axios').default
const { faker } = require('@faker-js/faker');
const config = require('../config.json')

const baseUrl = config.urlApi
const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'


async function getAllBoards(organization){
    const url = baseUrl + `/Organizations/${organization}?boards=open&board_fields=all&fields=boards`
    const response = await send(GET, url)
    return response.data.boards
}

async function getAllLists(boardId){
    const url = `${baseUrl}/boards/${boardId}/lists`
    const response = await send(GET, url)
    return response.data
}

async function getAllCards(boardId){
    const url = `${baseUrl}/boards/${boardId}/cards`
    const response = await send(GET, url)
    return response.data
}

async function createRandomBoard(useDefaultLists = false){
    return await createBoard(faker.name.findName(), useDefaultLists)
}

async function createBoard(boardName, useDefaultLists = false){
    const url = baseUrl + '/boards/'

    const reqBody = {
        "defaultLists": useDefaultLists,
        "name": boardName
    }

    const response = await send(POST, url, reqBody)
    console.log('Новая доска: ', response.data.id)
    return response.data
}

async function deleteBoardById(boardId) {
    const url = `${baseUrl}/boards/${boardId}`    

    console.log('Удаляем доску: ', boardId);
    const response = await send(DELETE, url)
    return response.status === 200
}

async function deleteCardById(id){
    const url = `${baseUrl}/cards/${id}`

    console.log('Удаляем карточку: ', id);

    const response = await send(DELETE, url)
    
    return response.status === 200
}

async function createCard(boardId, listId, cardName){
    const url = `${baseUrl}/cards/`

    const reqBody = {
        "name": cardName,
        "idBoard": boardId,
        "idList": listId
    }

    const response = await send(POST, url, reqBody)
    console.log('Новая карточка: ', response.data.id)
    return response.data.id
}

async function editCard(cardId, propertyName, propertyValue){
    const url = `${baseUrl}/cards/${cardId}`
   
    const reqBody = {}
    reqBody[propertyName] = propertyValue
    
    const response = await send(PUT, url, reqBody)
    console.log('Новая карточка: ', response.data.id)
    return response.data.id
}

async function getCardById(id){
    const url = `${baseUrl}/cards/${id}?fields=idBoard,name,desc,labels`
    const response = await send(GET, url)
    return response.data
}

async function getListOfCard(id){
    const url = `${baseUrl}/cards/${id}/list`
    const response = await send(GET, url)
    return response.data
}

async function clearSpace(orgId){
    const boards = await getAllBoards(orgId);

    for (let i = 0; i < boards.length; i++){
        const boardId = boards[i].id 
        await deleteBoardById(boardId)
    }
}

const token = config.access_token
const cookie = {'Cookie':`token=${token}`}
async function send(method, url, data = {}, headers = cookie){
    data.token = token
    const config = { method, url, data, headers}
    return await axios(config)
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