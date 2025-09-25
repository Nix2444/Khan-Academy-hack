const ver = "V3.1.2";
let isDev = false;
const repoPath = `https://raw.githubusercontent.com/Nix2444/Khan-Academy-hack/refs/heads/${isDev ? "dev/" : "main/"}`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

/* User */
let user = { username:"Username", nickname:"Nickname", UID:0 };
let loadedPlugins = [];

/* Elements */
const dropdownMenu = document.createElement('div');
dropdownMenu.id = "khanwareGui";

/* Features */
window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: true,
    autoAnswer: true,
    customBanner: true,
    nextRecomendation: true,
    repeatQuestion: true,
    minuteFarmer: true,
    rgbLogo: true
};
window.allFeaturesEnabled = true;
window.guiOpen = false;

/* Misc */
document.addEventListener('contextmenu', e => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', e => { 
    if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','C','J'].includes(e.key)))) e.preventDefault(); 
});

/* Helper */
const delay = ms => new Promise(r=>setTimeout(r,ms));
const sendToast = (text,duration=5000) => { Toastify({ text, duration, gravity:"bottom", position:"center", stopOnFocus:true, style:{background:"#000"} }).showToast(); };

/* Splash Screen */
async function showSplashScreen(){ 
    const splashScreen = document.createElement('div');
    splashScreen.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s;font-family:MuseoSans,sans-serif;font-size:30px;color:white;";
    splashScreen.innerHTML='<span style="color:white;">KHAN</span><span style="color:#72ff72;">WARE</span>';
    document.body.appendChild(splashScreen);
    setTimeout(()=>splashScreen.style.opacity='1',10);
    return new Promise(resolve=>setTimeout(()=>{splashScreen.style.opacity='0'; setTimeout(()=>{splashScreen.remove(); resolve(); },500);},1000));
}

/* Função que cria GUI completa */
function setupGui(){
    dropdownMenu.style.cssText = `
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:400px;
        background:#111;
        color:#fff;
        padding:20px;
        border-radius:12px;
        z-index:999999;
        display:flex;
        flex-direction:column;
        gap:10px;
        display:none;
    `;
    document.body.appendChild(dropdownMenu);

    // Botões de features
    const featureButtons = Object.keys(window.features).map(f => {
        const btn = document.createElement('button');
        btn.innerText = f;
        btn.style.cssText = "padding:10px;border:none;border-radius:6px;background:#222;color:#fff;cursor:pointer;";
        btn.addEventListener('click',()=> {
            window.features[f] = !window.features[f];
            btn.style.background = window.features[f] ? "#72ff72" : "#222";
        });
        dropdownMenu.appendChild(btn);
        return btn;
    });

    // Botão OFF
    const offBtn = document.createElement('button');
    offBtn.innerText = "OFF";
    offBtn.style.cssText = "padding:10px;border:none;border-radius:6px;background:#ff4444;color:#fff;cursor:pointer;";
    offBtn.addEventListener('click',()=>{
        window.allFeaturesEnabled = !window.allFeaturesEnabled;
        Object.keys(window.features).forEach(f => window.features[f] = window.allFeaturesEnabled);
        offBtn.innerText = window.allFeaturesEnabled ? "OFF" : "ON";
        featureButtons.forEach((btn,i)=> btn.style.background = window.features[Object.keys(window.features)[i]] ? "#72ff72" : "#222");
        sendToast(window.allFeaturesEnabled ? "✅ Todas as opções ativadas" : "⛔ Todas as opções desativadas",2000,"top");
    });
    dropdownMenu.appendChild(offBtn);
}

/* F4 abre/fecha GUI */
document.addEventListener('keydown',(e)=>{
    if(e.key === "F4"){
        window.guiOpen = !window.guiOpen;
        dropdownMenu.style.display = window.guiOpen ? "flex" : "none";
    }
});

/* Função para executar features somente se estiverem ativadas */
async function runFeatures(){
    while(true){
        if(window.allFeaturesEnabled){
            if(window.features.autoAnswer) { /* AutoAnswer */ }
            if(window.features.videoSpoof) { /* VideoSpoof */ }
            if(window.features.questionSpoof) { /* QuestionSpoof */ }
        }
        await delay(500);
    }
}
runFeatures();

/* Inicialização */
(async()=>{
    await showSplashScreen();
    setupGui();
    sendToast("🌿 Khanware iniciado com sucesso!");

    // ======= Adicionando trecho final que você pediu =======
    loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs').then(() => { 
        onekoEl = document.getElementById('oneko'); 
        onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')"; 
        onekoEl.style.display = "none"; 
    });
    loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{
        DarkReader.setFetchMethod(window.fetch); 
        DarkReader.enable(); 
    });
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    .then(async () => {
        fetch("https://pt.khanacademy.org/api/internal/graphql/getFullUserProfile",{referrer:"https://pt.khanacademy.org/profile/me",body:'{"operationName":"getFullUserProfile","query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    nickname\\n    __typename\\n  }\\n}"}',method:"POST",mode:"cors",credentials:"include"})
        .then(async response => { 
            let data = await response.json(); 
            user = { nickname: data.data.user.nickname, username: data.data.user.username, UID: data.data.user.id.slice(-5) }; 
        });

        sendToast("🌿 Khanware injetado com sucesso!");
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
        await delay(500);
        sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
        if(device.apple) { await delay(500); sendToast(`🪽 Que tal comprar um Samsung?`); }
        loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top') );
        console.clear();
    });
})();
