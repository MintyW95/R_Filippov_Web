(function() 
{
    window.CookieManager = 
    {
        set: function(name, value, days) 
        {
            if (typeof name !== 'string' || name.trim() === '') 
            {
                throw new Error('Имя cookie должно быть непустой строкой');
            }
            if (typeof value !== 'string') 
            {
                throw new Error('Значение cookie должно быть строкой');
            }
            const encodedValue = encodeURIComponent(value);
            let expires = '';  
            if (days) 
            {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }
            document.cookie = name + '=' + encodedValue + expires + '; path=/; SameSite=Lax; Secure';
        },

        get: function(name) 
        {
            if (typeof name !== 'string' || name.trim() === '') 
            {
                throw new Error('Имя cookie должно быть непустой строкой');
            }

            const cookies = document.cookie.split(';');
            for (let cookie of cookies) 
            {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) 
                {
                    const value = cookie.substring(name.length + 1);
                    return decodeURIComponent(value);
                }
            }
            return null;
        },

        saveReviews: function(reviews) 
        {
            try 
            {
                const reviewsJSON = JSON.stringify(reviews);
                this.set('reviews', reviewsJSON, 30);
            } 
            catch (error) 
            {
                console.error('Ошибка при сохранении отзывов:', error);
            }
        },

        loadReviews: function() 
        {
            try 
            {
                const reviewsJSON = this.get('reviews');
                if (reviewsJSON) 
                {
                    return JSON.parse(reviewsJSON);
                }
            } 
            catch (error) 
            {
                console.error('Ошибка при загрузке отзывов:', error);
            }
            return [];
        }
    };
})();