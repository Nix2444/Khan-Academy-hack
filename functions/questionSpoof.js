const phrases = [ 
            "🔥 Segue ai pra [ajudar](https://www.instagram.com/pietrizinho_bah) ❤",
            "☄️ By [Pietro/Snow](https://discord.com/users/1379674492053229610)",
            "Desenvolvedor Pietro, faz melhor ai o otario e tenta derrubar quero ver😂, Bjs do pietrao vagabundo(a)",
            "🌟 Projeto Sempre em Atualizaçoes!!",
            "😈 pietro fez a boa!!!",
];

const originalFetch = window.fetch;

window.fetch = async function (input, init) {
    let body;
    if (input instanceof Request) body = await input.clone().text();
    else if (init && init.body) body = init.body;

    const originalResponse = await originalFetch.apply(this, arguments);
    const clonedResponse = originalResponse.clone();

    try {
        const responseBody = await clonedResponse.text();
        let responseObj = JSON.parse(responseBody);
        if (features.questionSpoof && responseObj?.data?.assessmentItem?.item?.itemData) {
            let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
            if(itemData.question.content[0] === itemData.question.content[0].toUpperCase()){
                itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false }
                itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                itemData.question.widgets = { "radio 1": { type: "radio",  options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
                responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                sendToast("🔓 Questão exploitada.", 1000);
                return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
            }
        }
    } catch (e) { debug(`🚨 Error @ questionSpoof.js\n${e}`); }
    return originalResponse;
};
