(function()
{
    window.showPopup = function(popupId) 
    {
        const popup = document.getElementById(popupId);
        if (popup) 
        {
            popup.classList.add('active');
            setTimeout(() => 
            {
                const pos = getRandomPosition(popup);
                popup.style.top = pos.top;
                popup.style.left = pos.left;
            }, 10);
        }
    };

    window.addEventListener('load', () =>
    {
        const popups = document.querySelectorAll('.popup-overlay');
        popups.forEach((p, i) => p.style.zIndex = (100 + i).toString());
        setTimeout(() => showPopup('popup1'), 2000);
        setTimeout(() => showPopup('popup2'), 4000);
        setTimeout(() => showPopup('popup3'), 6000);
        setTimeout(() => showPopup('popup4'), 8000);
        setTimeout(() => showPopup('popup5'), 10000);
        setTimeout(() => showPopup('popup6'), 12000);
        setTimeout(() => showPopup('popup7'), 14000);
        setInterval(changeZIndex, 2000);
        initReviews();
    });

    window.hidePopup = function(popupId)
    {
        const popup = document.getElementById(popupId);
        if (popup) popup.classList.remove('active');
    };

    function getRandomPosition(popup) 
    {
        const card = popup.querySelector('.popup-card');
        if (!card) return { top: '10px', left: '10px' };
        const width = card.offsetWidth;
        const height = card.offsetHeight;
        const maxX = Math.max(0, window.innerWidth - width - 20);
        const maxY = Math.max(0, window.innerHeight - height - 20);
        const x = Math.floor(Math.random() * (maxX + 1));
        const y = Math.floor(Math.random() * (maxY + 1));
        return {top: y + 'px', left: x + 'px'};
    }

    function changeZIndex()
    {
        const popups = document.querySelectorAll('.popup-overlay.active');
        if (popups.length < 2) return;
        let maxZ = -1;
        let maxPopup = null;
        popups.forEach(p =>
        {
            const z = parseInt(p.style.zIndex) || 100;
            if (z > maxZ)
            {
                maxZ = z;
                maxPopup = p;
            }
        });
        if (maxPopup)
        {
            maxPopup.style.zIndex = '99';
            popups.forEach(p =>
            {
                if (p !== maxPopup)
                {
                    const z = parseInt(p.style.zIndex) || 100;
                    p.style.zIndex = (z + 1).toString();
                }
            });
        }
    }

    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn)
    {
        toggleBtn.addEventListener("click", () =>
        {
            document.body.classList.toggle("bright");
            toggleBtn.textContent = document.body.classList.contains("bright") ? "☽" : "☼";
        });
    }

    const defaultReviews =
    [
        {
            name: "[BFG_BECCA]",
            text: "ПРОСТО ОТПАД!!! РАНЬШЕ НЕ ДОСТАВАЛА ДАЖЕ ДО ВЕРХНЕЙ ПОЛКЕ В МАГАЗИНЕ. ТЕПЕРЬ СТАЛА НОЧНЫМ КОШМАРОМ ВСЕХ, КТО РАНЬШЕ МЕНЯ ОБИЖАЛ. короче всё чётко",
            image: "https://i.ibb.co/N2V2sGkr/image.png"
        },
        {
            name: "[MrLightningBolt]",
            text: "До имплантов меня мог избить любой реактивный бразилец. Теперь даже челюсть атомы режет. Короче хромируйтесь, не пожалеете",
            image: "https://i.ibb.co/YBwfkTnB/image.jpg"
        }
    ];

    function renderReviews(userReviews)
    {
        const container = document.getElementById('reviewsContainer');
        if (!container) return;
        container.innerHTML = '';
        userReviews.forEach(review =>
        {
            const item = document.createElement('article');
            item.className = 'review-item';
            let html = 
            `
                <div class="review-name">${review.name}</div>
                <p class="review-text">${review.text}</p>
            `;
            if (review.image)
            {
                html += `<img src="${review.image}" alt="Фото отзыва" class="review-image">`;
            }
            item.innerHTML = html;
            container.appendChild(item);
        });

        defaultReviews.forEach(review =>
        {
            const item = document.createElement('article');
            item.className = 'review-item';
            let html = 
            `
                <div class="review-name">${review.name}</div>
                <p class="review-text">${review.text}</p>
            `;
            if (review.image)
            {
                html += `<img src="${review.image}" alt="Фото отзыва" class="review-image">`;
            }
            item.innerHTML = html;
            container.appendChild(item);
        });
    }

    function getUserReviews()
    {
        if (!window.CookieManager) return [];
        let saved = window.CookieManager.loadReviews();
        if (!saved || !Array.isArray(saved)) return [];
        return saved;
    }

    function saveUserReviews(reviews)
    {
        if (window.CookieManager)
        {
            window.CookieManager.saveReviews(reviews);
        }
    }

    function fileToBase64(file)
    {
        return new Promise((resolve, reject) =>
        {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
        });
    }

    function validate(name, text, file)
    {
        name = (name || "").trim();
        text = (text || "").trim();
        if (!name) return "Напиши имя";
        if (name.length > 32) return "Имя до 32 символов";
        if (!text) return "Напиши текст";
        if (file)
        {
            if (file.size > 1500000) return "Картинка до ~1.5 МБ";
            if (!file.type.startsWith("image/")) return "Только изображения";
        }
        return "";
    }

    async function initReviews()
    {
        let userReviews = getUserReviews();
        
        renderReviews(userReviews);
        const form = document.getElementById("reviewForm");
        if (!form) return;

        const nameInput  = document.getElementById("reviewName");
        const textInput  = document.getElementById("reviewText");
        const imageInput = document.getElementById("reviewImage");
        const errorDiv   = document.getElementById("formError");

        form.addEventListener("submit", async e =>
        {
            e.preventDefault();
            const file = imageInput.files[0];
            const err = validate(nameInput.value, textInput.value, file);
            errorDiv.textContent = err;
            if (err) return;
            let imageBase64 = "";
            if (file)
            {
                try
                {
                    imageBase64 = await fileToBase64(file);
                }
                catch
                {
                    errorDiv.textContent = "Не удалось загрузить картинку";
                    return;
                }
            }

            const newReview =
            {
                name: nameInput.value.trim(),
                text: textInput.value.trim(),
                image: imageBase64
            };

            userReviews.unshift(newReview);
            saveUserReviews(userReviews);
            renderReviews(userReviews);

            nameInput.value = "";
            textInput.value = "";
            imageInput.value = "";
            errorDiv.textContent = "Отзыв добавлен!";
            setTimeout(() => errorDiv.textContent = "", 2500);
        });
    }

    window.addEventListener('resize', function() 
    {
        document.querySelectorAll('.popup-overlay.active').forEach(p => 
        {
            const pos = getRandomPosition(p);
            p.style.top = pos.top;
            p.style.left = pos.left;
        });
    });
})();