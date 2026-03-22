(function() 
{
    class StandCard 
    {
        #name; #image; #number;
        #meaning; #standName; #owner; #standType; #specialAbility;
        constructor(name, image, number, meaning, standName, owner, standType, specialAbility = "") 
        {
            this.#name = name.trim();
            this.#image = image;
            this.#number = number;
            this.#meaning = meaning.trim();
            this.#standName = standName.trim();
            this.#owner = owner.trim();
            this.#standType = standType.trim();
            this.#specialAbility = specialAbility?.trim() || "";
        }
        getImage() {return this.#image;}
        getStandName() {return this.#standName;}
        getOwner() {return this.#owner;}
        getMeaning() {return this.#meaning;}
        getNumber() {return this.#number;}
        getName() {return this.#name;}
        getHTML(small = true) 
        {
            let html = 
            `
                <div class="card">
                    <img src="${this.#image}" alt="${this.#name}">
                </div>
            `;
            if (!small) 
            {
                html = html.replace('</div>', 
                `
                    <div class="info">
                        <strong>Стенд:</strong> ${this.#standName}<br>
                        <strong>Юзер:</strong> ${this.#owner}<br>
                        <strong>Тип:</strong> ${this.#standType}<br>
                        <strong>Значение:</strong> ${this.#meaning}
                    </div>
                    ${this.#specialAbility ? 
                    `
                        <div class="info" style="background:tomato;color:#0b0d10;font-weight:bold;">
                            <strong>Способность:</strong> ${this.#specialAbility}
                        </div>
                    ` : ""}
                `);
            }
            return html;
        }
        toJSON() 
        {
            return {
                classType: this.constructor.name,
                name: this.#name,
                image: this.#image,
                number: this.#number,
                meaning: this.#meaning,
                standName: this.#standName,
                owner: this.#owner,
                standType: this.#standType,
                specialAbility: this.#specialAbility
            };
        }
    }

    class CloseStand extends StandCard 
    {
        constructor(name, image, number, meaning, standName, owner) 
        {
            super(name, image, number, meaning, standName, owner, "Ближний", "Oh? You're Approaching Me?");
        }
    }

    class FarStand extends StandCard 
    {
        constructor(name, image, number, meaning, standName, owner) 
        {
            super(name, image, number, meaning, standName, owner, "Дальний", "кидается камнями из кармашка");
        }
    }

    class RemoteStand extends StandCard 
    {
        constructor(name, image, number, meaning, standName, owner) 
        {
            super(name, image, number, meaning, standName, owner, "Дистанционный", "Машинка на радиоуправлении (иногда даже без ведома юзера)");
        }
    }

    class SameTypeOfStand extends StandCard
    {
        constructor(name, image, number, meaning, standName, owner) 
        {
            super(name, image, number, meaning, standName, owner, "Так значит это стенды одного типа...", "ОСТАНОВКА ВРЕМЕНИ");
        }
    }
    let deck = [];
    let isEditMode = false;
    let isFortuneRunning = false;
    const defaultDeckData = 
    [
        {classType:"FarStand", name:"The Fool", image:"https://static.jojowiki.com/images/3/34/latest/20201003160506/0_OVATarot_TheFool.png", number:0, meaning:"Невинность и непосредственность", standName:"The Fool", owner:"Игги"},
        {classType:"CloseStand", name:"The Magician", image:"https://static.jojowiki.com/images/2/28/latest/20201003160511/1_OVATarot_TheMagician.png", number:1, meaning:"Новые начала", standName:"Magicians Red", owner:"Мухаммед Абдул"},
        {classType:"RemoteStand", name:"The High Priestess", image:"https://static.jojowiki.com/images/7/7a/latest/20201003160515/2_OVATarot_TheHighPriestess.png", number:2, meaning:"Интуиция и тайные знания", standName:"High Priestess", owner:"Мидлер"},
        {classType:"CloseStand", name:"The Empress", image:"https://static.jojowiki.com/images/e/ed/latest/20201003160520/3_OVATarot_TheEmpress.png", number:3, meaning:"Рост новой жизни", standName:"Empress", owner:"Нэна"},
        {classType:"FarStand", name:"The Emperor", image:"https://static.jojowiki.com/images/2/26/latest/20201003160526/4_OVATarot_TheEmperor.png", number:4, meaning:"Порядок и контроль", standName:"Emperor", owner:"Хол Хорс"},
        {classType:"RemoteStand", name:"The Hierophant", image:"https://static.jojowiki.com/images/7/7f/latest/20201003160530/5_OVATarot_TheHierophant.png", number:5, meaning:"Традиция и конформизм", standName:"Hierophant Green", owner:"Нориаки Какёин"},
        {classType:"RemoteStand", name:"The Lovers", image:"https://static.jojowiki.com/images/9/92/latest/20201003160534/6_OVATarot_TheLover.png", number:6, meaning:"Сознательные связи и узы", standName:"Lovers", owner:"Стили Дэн"},
        {classType:"CloseStand", name:"The Chariot", image:"https://static.jojowiki.com/images/4/4f/latest/20201003160538/7_OVATarot_TheChariot.png", number:7, meaning:"Вторжение и победа", standName:"Silver Chariot", owner:"Жан-Пьер Польнарефф"},
        {classType:"CloseStand", name:"Strength", image:"https://static.jojowiki.com/images/b/b7/latest/20201003160543/8_OVATarot_Strength.png", number:8, meaning:"Устойчивость, сострадание и уверенность", standName:"Strength", owner:"Форевер"},
        {classType:"FarStand", name:"The Hermit", image:"https://static.jojowiki.com/images/8/8e/latest/20201003160547/9_OVATarot_TheHermit.png", number:9, meaning:"Самоанализ и созерцание", standName:"Hermit Purple", owner:"Джозеф Джостар"},
        {classType:"RemoteStand", name:"Wheel of Fortune", image:"https://static.jojowiki.com/images/0/0e/latest/20201003160552/10_OVATarot_WheelOfFortune.png", number:10, meaning:"Перемены и непредсказуемость", standName:"Wheel of Fortune", owner:"Зи-зи"},
        {classType:"FarStand", name:"Justice", image:"https://static.jojowiki.com/images/a/a5/latest/20201003160557/11_OVATarot_Justice.png", number:11, meaning:"Справедливость и последствия", standName:"Justice", owner:"Старуха Эния"},
        {classType:"FarStand", name:"The Hanged Man", image:"https://static.jojowiki.com/images/3/3d/latest/20201003160601/12_OVATarot_TheHangedMan.png", number:12, meaning:"Разные перспективы", standName:"Hanged Man", owner:"Джей Гайл"},
        {classType:"RemoteStand", name:"Death", image:"https://static.jojowiki.com/images/d/d0/latest/20201003160604/13_OVATarot_Death.png", number:13, meaning:"Самосознание и трансформация", standName:"Death 13", owner:"Мэнниш Бой"},
        {classType:"CloseStand", name:"Temperance", image:"https://static.jojowiki.com/images/a/a2/latest/20201003160609/14_OVATarot_Temperance.png", number:14, meaning:"Баланс и умеренность", standName:"Yellow Temperance", owner:"Раббер Соул"},
        {classType:"CloseStand", name:"The Devil", image:"https://static.jojowiki.com/images/e/ea/latest/20201003160612/15_OVATarot_TheDevil.png", number:15, meaning:"Замешательство и неудача", standName:"Ebony Devil", owner:"Дево Проклятый"},
        {classType:"RemoteStand", name:"The Tower", image:"https://static.jojowiki.com/images/1/10/latest/20201003160615/16_OVATarot_TheTower.png", number:16, meaning:"Неожиданное прерывание путешествия и хаос", standName:"Tower of Gray", owner:"Грэй Флай"},
        {classType:"SameTypeOfStand", name:"The Star", image:"https://static.jojowiki.com/images/0/0c/latest/20201003160619/17_OVATarot_TheStar.png", number:17, meaning:"Оптимизм, проницательность и надежда", standName:"Star Platinum", owner:"Джотаро Куджо"},
        {classType:"FarStand", name:"The Moon", image:"https://static.jojowiki.com/images/7/74/latest/20201003160623/18_OVATarot_TheMoon.png", number:18, meaning:"Проблемы в воде, ложь, предательство, и страх перед неизвестным", standName:"Dark Blue Moon", owner:"Самозванец капитан Тенилл"},
        {classType:"FarStand", name:"The Sun", image:"https://static.jojowiki.com/images/5/57/latest/20201003160628/19_OVATarot_TheSun.png", number:19, meaning:"Изобилие, счастье и веселье", standName:"Sun", owner:"Арабия Фитс"},
        {classType:"RemoteStand", name:"Judgement", image:"https://static.jojowiki.com/images/7/77/latest/20201003160631/20_OVATarot_Judgement.png", number:20, meaning:"Перерождение и саморефлексия", standName:"Judgement", owner:"Камео"},
        {classType:"SameTypeOfStand", name:"The World", image:"https://static.jojowiki.com/images/f/fd/latest/20201003160635/21_OVATarot_TheWorld.png", number:21, meaning:"Достижение и пауза в жизни перед следующим циклом", standName:"The World", owner:"Дио Брандо"}
    ];

    function createCardFromData(data) 
    {
        switch (data.classType) 
        {
            case "SameTypeOfStand": return new SameTypeOfStand(data.name, data.image, data.number, data.meaning, data.standName, data.owner);
            case "CloseStand": return new CloseStand(data.name, data.image, data.number, data.meaning, data.standName, data.owner);
            case "FarStand": return new FarStand(data.name, data.image, data.number, data.meaning, data.standName, data.owner);
            case "RemoteStand": return new RemoteStand(data.name, data.image, data.number, data.meaning, data.standName, data.owner);
            default: return new StandCard(data.name, data.image, data.number, data.meaning, data.standName, data.owner, data.standType, data.specialAbility);
        }
    }

    function loadDeck() 
    {
        const saved = StorageManager.get('standDeck');
        deck = saved && Array.isArray(saved) ? saved.map(createCardFromData) : defaultDeckData.map(createCardFromData);
        renderDeck();
    }

    function saveDeck() 
    {
        StorageManager.set('standDeck', deck.map(card => card.toJSON()));
    }

    function buildSite() 
    {
        document.body.innerHTML = 
        `
            <header>
                <h1>РАСКЛАД ТАРО ОНЛАЙН</h1>
                <button class="im-feeling-lucky-btn" id="lucky">Личный расклад</button>
                <button class="backintime-btn" onclick="resetDeck()">Кнопка Пуччи</button>
                <button id="editToggle" class="edit-toggle">✎</button>
            </header>
            <main class="main-content">
                <div class="deck-container" id="deckContainer"></div>
                <button class="addcard-btn" id="addCardBtn"> + НОВАЯ КАРТА (сломать канон)</button>
            </main>
            <div id="fortuneResult">
                <div class="fortune-title">ТВОЯ СУДЬБА ПРЕДРЕШЕНА!!!</div>
                <img id="fortuneTeller" src="https://static.wikia.nocookie.net/jojo/images/7/7b/Enya_Infobox_Manga.png/revision/latest?cb=20210528182751&path-prefix=ru" alt="старуха эния" style="display:none;">
                <div class="prediction-container" id="predictionCards"></div>
            </div>
            <div class="popup-overlay" id="viewPopup">
                <div class="popup-card">
                    <button class="close-btn" onclick="hidePopup()">✕</button>
                    <div id="popupContent" class="popup-content"></div>
                </div>
            </div>
        `;
        document.getElementById("editToggle").addEventListener("click", toggleEditMode);
        document.getElementById("addCardBtn").addEventListener("click", addNewCard);
        document.getElementById("lucky").addEventListener("click", startFortune);
        loadDeck();
    }

    function startFortune() 
    {
        if (isFortuneRunning)
        {
            alert("уже гадаем");
            return;
        }
        else if(deck.length < 3)
        {
            alert("мало карт")
            return;
        }
        isFortuneRunning = true;
        const btn = document.getElementById("lucky");
        btn.disabled = true;
        const resultDiv = document.getElementById("fortuneResult");
        resultDiv.classList.add("active");
        const tellerImg = document.getElementById("fortuneTeller");
        tellerImg.style.display = "block";
        const tempDeck = [...deck];
        const selected = [];
        for (let i = 0; i < 3; i++) 
        {
            const randIndex = Math.floor(Math.random() * tempDeck.length);
            selected.push(tempDeck[randIndex]);
            tempDeck.splice(randIndex, 1);
        }
        const labels = ["ПРОШЛОЕ", "НАСТОЯЩЕЕ", "БУДУЩЕЕ"];
        const container = document.getElementById("predictionCards");
        container.innerHTML = "";
        selected.forEach((card, i) => 
        {
            const div = document.createElement("div");
            div.className = "prediction-card visible";
            div.innerHTML = 
            `
                <img src="${card.getImage()}">
                <div class="prediction-label">${labels[i]}</div>
                <strong>${card.getName()}</strong><br>
                <em>${card.getMeaning()}</em>
            `;
            container.appendChild(div);
            btn.disabled = false;
            btn.textContent = "РАСКЛАД ТАРО";
            isFortuneRunning = false;
        });
        window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
    }

    window.resetDeck = function() 
    {
        if (!confirm("Перезапустить всленную?")) return;
        localStorage.removeItem('standDeck');
        location.reload();
    };

    function renderDeck() 
    {
        const container = document.getElementById("deckContainer");
        container.innerHTML = '';
        deck.forEach((card, index) => 
        {
            const div = document.createElement("div");
            div.innerHTML = card.getHTML(true);
            const cardElement = div.firstElementChild;
            cardElement.onclick = () => 
            {
                if (!isEditMode) showCardPopup(card);
            };
            if (isEditMode) 
            {
                const controls = document.createElement("div");
                controls.className = "card-controls";
                controls.innerHTML = 
                `
                    <button onclick="editCard(${index}); event.stopImmediatePropagation();">✎</button>
                    <button onclick="deleteCard(${index}); event.stopImmediatePropagation();">✕</button>
                `;
                cardElement.appendChild(controls);
            }
            container.appendChild(cardElement);
        });
    }

    window.showCardPopup = function(card) 
    {
        const popup = document.getElementById("viewPopup");
        const content = document.getElementById("popupContent");
        content.innerHTML = card.getHTML(false);
        popup.classList.add("active");
    };

    window.hidePopup = function() 
    {
        document.getElementById("viewPopup").classList.remove("active");
    };

    function toggleEditMode() 
    {
        isEditMode = !isEditMode;
        const btn = document.getElementById("editToggle");
        btn.textContent = isEditMode ? "✓" : "✎";
        document.getElementById("addCardBtn").style.display = isEditMode ? "block" : "none";
        renderDeck();
    }

    function validateInput(promptText, defaultInput = "", validator = (input) => input.trim() !== "") 
    {
        let input;
        do 
        {
            input = prompt(promptText, defaultInput);
            if (input === null) return null;
            input = input.trim();
            if (!validator(input)) 
            {
                alert("Да не то ввёл");
            }
        } while (!validator(input));
        return input;
    }

    function validateStandType(promptText, defaultInput = "") 
    {
        const validTypes = 
        {
            "close": "Close",
            "ближний": "Close",
            "far": "Far",
            "дальний": "Far",
            "remote": "Remote",
            "дистанционный": "Remote"
        };
        let input;
        do 
        {
            input = prompt(promptText, defaultInput);
            if (input === null) return null;
            input = input.trim().toLowerCase();
            if (validTypes[input]) 
            {
                return validTypes[input];
            }
            alert("НЕТ ТАКОГО. Выбирай Close/Far/Remote или Ближний/Дальний/Дистанционный");
        } 
        while (true);
    }

    window.editCard = function(index) 
    {
        const card = deck[index];
        const currentData = card.toJSON();
        const newName = validateInput("имя карты?", currentData.name);
        if (newName === null) return;
        const newImage = validateInput("ссылка на картинку?", currentData.image, (input) => input.startsWith("http") || input.startsWith("/"));
        if (newImage === null) return;
        const newStandName = validateInput("название стенда?", currentData.standName);
        if (newStandName === null) return;
        const newOwner = validateInput("стенд юзер?", currentData.owner);
        if (newOwner === null) return;
        const newMeaning = validateInput("значение?", currentData.meaning);
        if (newMeaning === null) return;
        const type = validateStandType("тип стенда (Close/Far/Remote)?", currentData.standType);
        if (type === null) return;
        let newCard;
        switch (type) 
        {
            case "Close":
                newCard = new CloseStand(newName, newImage, currentData.number, newMeaning, newStandName, newOwner);
                break;
            case "Far":
                newCard = new FarStand(newName, newImage, currentData.number, newMeaning, newStandName, newOwner);
                break;
            case "Remote":
                newCard = new RemoteStand(newName, newImage, currentData.number, newMeaning, newStandName, newOwner);
                break;
            default:
                if (currentData.classType === "SameTypeOfStand") 
                {
                    newCard = new SameTypeOfStand(newName, newImage, currentData.number, newMeaning, newStandName, newOwner);
                } 
                else 
                {
                    newCard = new StandCard(newName, newImage, currentData.number, newMeaning, newStandName, newOwner, type, "");
                }
        }

        deck[index] = newCard;
        saveDeck();
        renderDeck();
        alert("ну всё сломал канон");
    };

    window.deleteCard = function(index) 
    {
        if (!confirm("удалить карту?")) return;
        deck.splice(index, 1);
        saveDeck();
        renderDeck();
        alert("ты снова сломал канон")
    };

    function addNewCard() 
    {
        const name = validateInput("имя карты?");
        if (name === null) return;
        const image = validateInput("ссылка на картинку?", "", (s) => s && (s.startsWith("http") || s.startsWith("/")));
        if (image === null) return;
        const standName = validateInput("название стенда?");
        if (standName === null) return;
        const owner = validateInput("стенд юзер?");
        if (owner === null) return;
        const meaning = validateInput("значение таро?");
        if (meaning === null) return;
        const type = validateStandType("тип стенда (Close/Far/Remote)?");
        if (type === null) return;
        let newCard;
        switch (type) 
        {
            case "Close": 
                newCard = new CloseStand(name, image, deck.length, meaning, standName, owner); 
                break;
            case "Far": 
                newCard = new FarStand(name, image, deck.length, meaning, standName, owner); 
                break;
            case "Remote": 
                newCard = new RemoteStand(name, image, deck.length, meaning, standName, owner); 
                break;
        }
        deck.unshift(newCard);
        saveDeck();
        renderDeck();
        alert("всё, ты сломал канон");
    }
    buildSite();
})();