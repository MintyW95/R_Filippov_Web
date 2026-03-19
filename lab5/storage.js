(function() 
{
    window.StorageManager = 
    {
        set: function(key, value) 
        {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function(key) 
        {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
    };
})();
