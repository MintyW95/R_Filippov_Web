let chips = 1000;
const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];
let wincount = 0;
function playSlot() 
{
    alert("начинаем наше лудоприключение");
    alert("Атомный Ковбой приветствует Вас! У вас " + chips + " фишек");
    while (chips > 0) 
    {
        let bet = prompt("У вас " + chips + " фишек. Сколько ставите?");
        if (bet === null) 
	{
            alert("Приходите ещё!");
            break;
        }
        bet = Number(bet);
        if (isNaN(bet) || bet > chips || bet <= 0) 
	{
            alert("ЧОТА НЕ ТО ВВЁЛ");
            continue;
        }
        chips -= bet;
        const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
        alert(`${slot1} |       | `);
        alert(`${slot1} | ${slot2} |`);
        alert(`${slot1} | ${slot2} | ${slot3}`);
        let win = bet;
        if (slot1 === slot2 && slot2 === slot3) 
	{
            switch(slot1) 
	    {
                case "🍒": win = win * 25; prompt("МЕГА ВЫИГРЫШ!!! ВЫ НА ТЕЛЕКЕ!!! хотите что-то передать маме?"); break; 
                case "🍋": win = win * 10; break;
                case "🍊": win = win * 5; break;
                case "⭐": win = win * 3; break;
                case "💎": win = win * 5; break;
            }
            chips += win;
            alert("+" + (win-bet) + " фишек!");
            wincount += 1;
            if (wincount == 3) 
	    {
                alert("I'm sorry, you just win too much.");
                alert("[ВАМ ЗАПРЕТИЛИ ИГРАТЬ В ЭТОМ КАЗИНО]");
                break; // Также можно завершить игру здесь  
            }
        } 
	else if (slot1 === "🍒" || slot2 === "🍒" || slot3 === "🍒") 
	{
            win = win * 2;
            chips += win;
            alert("Утешительный приз: +" + (win-bet) + " фишек!");
        } 
	else 
	{
            alert("Ты, наверное, думаешь, что тебе выпало 18 карат невезения? Да нет, просто игра попалась нечестная");
        }
        if (!confirm("Хе-хе, повторим?")) break;
    }
    alert("Последний дэп поставил жирную точку в этой истории. Я снял руку с рычага — всё было кончено. Мой баланс был " + chips + " фишек...");
}
document.getElementById("slotBtn").addEventListener("click", playSlot);