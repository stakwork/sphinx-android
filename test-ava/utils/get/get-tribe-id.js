var http = require('ava-http');
var h = require('../helpers')

async function getTribeId(t, node, tribe){
//GET TRIBE ID FROM PERSPECTIVE OF NODE ===>

    //get list of contacts as node
    let con = await http.get(node.ip+'/contacts', h.makeArgs(node));
    //get test tribe id as node
    let findTribe = con.response.chats.find(chat=> chat.uuid === tribe.uuid)
    t.true(typeof findTribe === "object", "tribe object should exist")
    let tribeId = findTribe.id
    t.true(typeof tribeId === "number", "there should be a tribe id")

    return tribeId
}

module.exports = getTribeId