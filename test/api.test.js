const { expect } = require('chai')
const axios = require('axios').default

const baseUrl = 'https://trello.com/1'
const token = '61790ff29348904bc42217da/bEp7IwPtm0HYRzI4qTB7MhMk1jA57uQdr7jxPHHbWeEzkYMJvrEDaO2VjDUqOQPL'

describe('Trello. API. Тесты доски', () => {
    const orgId = '617910020c566f69cac8e33d'

    it('Создание новой доски', async () => {
        // получить список существующих досок -> размер списка = х
        let boards = await getAllBoards(orgId);
        const boardCountBefore = boards.length

        // создать доску
        const newBoardId = await createBoard('api test')
        console.log('New board: ', newBoardId)

        // получить список существующих досок -> размер списка = у
        boards = await getAllBoards(orgId);
        const boardCountAfter = boards.length

        // проверить, что у-х === 1
        const diff = boardCountAfter - boardCountBefore
        expect(diff).equals(1)
    })
    
    it('Удаление существующей доски', async () => {
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
    const url = baseUrl + '/cards/' // TODO: check url
    /*
    - Добавление карточки на доску
    - Редактирование карточки
    - Удаление карточки
    - Перемещение карточки в другую колонку
    */
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

// TODO: name generator
async function createBoard(boardName){
    const url = baseUrl + '/boards/'

    const reqConfig = {
        headers : {
            'Cookie':`token=${token}`
        }
    }

    const reqBody = {
        "name": boardName,
        "token": token
    }

    const response = await axios.post(url, reqBody, reqConfig)
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
    
    const response = await axios.delete(url, reqConfig)
    
    return response.status === 200
}

