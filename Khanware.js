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
const dropdownMenu = document.createElement('dropDownMenu');
const watermark = document.createElement('watermark');
const statsPanel = document.createElement('statsPanel');
const splashScreen = document.createElement('splashScreen');

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
window.featureConfigs = { autoAnswerDelay:3, customUsername:"", customPfp:"" };
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
async function showSplash(){ 
    splashScreen.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s;font-family:MuseoSans,sans-serif;font-size:30px;color:white;";
    splashScreen.innerHTML='<span style="color:white;">KHAN</span><span style="color:#72ff72;">WARE</span>';
    document.body.appendChild(splashScreen);
    setTimeout(()=>splashScreen.style.opacity='1',10);
}
async function hideSplash(){ splashScreen.style.opacity='0'; setTimeout(()=>splashScreen.remove(),1000); }

/* GUI Inicial KW */
const kwButton = document.createElement('button');
kwButton.innerText = "KW";
kwButton.style.cssText = `
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index:999999;
    padding:25px 45px;
    background-color:#72ff72;
    color:#000;
    font-size:30px;
    font-weight:bold;
    border:none;
    border-radius:12px;
    cursor:pointer;
`;
document.body.appendChild(kwButton);

kwButton.addEventListener('click', () => {
    window.guiOpen = true;
    kwButton.style.display = 'none';
    showGui();
});

/* Função que cria GUI completa */
function showGui(){
    // Container principal
    dropdownMenu.style.cssText = `
        position:fixed;
        bottom:20px;
        left:20px;
        width:300px;
        background:#111;
        color:#fff;
        padding:15px;
        border-radius:12px;
        z-index:999998;
        transform:scale(1.5);
        display:flex;
        flex-direction:column;
        gap:10px;
    `;
    document.body.appendChild(dropdownMenu);

    // Botões de features
    const featureButtons = Object.keys(window.features).map(f => {
        const btn = document.createElement('button');
        btn.innerText = f;
        btn.style.cssText = "padding:6px 12px;border:none;border-radius:6px;background:#222;color:#fff;cursor:pointer;";
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
    offBtn.style.cssText = "padding:6px 12px;border:none;border-radius:6px;background:#ff4444;color:#fff;cursor:pointer;";
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
        kwButton.style.display = window.guiOpen ? "none" : "block";
    }
});

/* Função para executar features somente se estiverem ativadas */
async function runFeatures(){
    while(true){
        if(window.allFeaturesEnabled){
            if(window.features.autoAnswer) { /* Aqui roda autoAnswer */ }
            if(window.features.videoSpoof) { /* Aqui roda videoSpoof */ }
            if(window.features.questionSpoof) { /* Aqui roda questionSpoof */ }
            /* Outras funções automáticas */
        }
        await delay(500);
    }
}
runFeatures();

/* Splash e scripts principais */
showSplash();
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin').then(()=>{
    hideSplash();
    sendToast("🌿 Khanware iniciado com sucesso!");
});
