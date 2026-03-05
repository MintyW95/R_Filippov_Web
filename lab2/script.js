(function() 
{
    window.showPopup = function(popupId) 
    {
        const popup = document.getElementById(popupId);
        if (popup) 
        {
            popup.classList.add('active');
        }
    };
    
    window.hidePopup = function(popupId) 
    {
        const popup = document.getElementById(popupId);
        if (popup) 
        {
            popup.classList.remove('active');
        }
    };
    
    window.addEventListener('load', function() 
    {
        setTimeout(() => showPopup('popup1'), 2000);
        setTimeout(() => showPopup('popup2'), 4000);
        setTimeout(() => showPopup('popup3'), 6000);
        setTimeout(() => showPopup('popup4'), 8000);
        setTimeout(() => showPopup('popup5'), 10000);
    });
})();
