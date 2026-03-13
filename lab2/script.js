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
    
    window.addEventListener('load', function() 
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