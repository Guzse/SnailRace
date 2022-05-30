const getDialogStart = () => $("dialog.bettingCenter");
const getDialogEnd = () => $("dialog.raceEnd");
const getBtnStart = () => $("#btnGo");
const getSnailByID = (id) => $(`#${id}`);

const generateSnailSpeed = () => {
    return (Math.random() * 5 + 10).toFixed(2);
};

const generateSnailLuck = () => {
    return Math.round(Math.random() * 100);
};

let snailData = [
    {
        name: "Lightning Bolt",
        img: 'https://i.imgur.com/PNx5mzO.png',
        speed: generateSnailSpeed(),
        luck: generateSnailLuck(),
        position: 0,
        stats: {
            victories: window.localStorage.getItem("snail0_victories") || 0,
            experience: 10,
            grit: 6,
            speed: 1
        },
    },
    {
        name: "Mach5",
        img: 'https://i.imgur.com/YxaAKkR.png',
        speed: generateSnailSpeed(),
        luck: generateSnailLuck(),
        position: 0,
        stats: {
            victories: window.localStorage.getItem("snail1_victories") || 0,
            experience: 4,
            grit: 8,
            speed: 1
        },
    },
    {
        name: "Flashy",
        img: 'https://i.imgur.com/YiLVsAM.png',
        speed: generateSnailSpeed(),
        luck: generateSnailLuck(),
        position: 0,
        stats: {
            victories: window.localStorage.getItem("snail2_victories") || 0,
            experience: 2,
            grit: 10,
            speed: 1
        },
    },
];
let chosenSnail = -1;
let titlePresses = 0;

const onTitlePress = () => {
    titlePresses++;
    if (titlePresses > 10) {
        $("h1").text("Snail Race EX");
        $("h1").addClass("party");
    }
}

const translate1 = (number) => number;
const translate2 = (number) => Math.pow(number, 2) / 100;
const translate3 = (number) => {
    const x0 = number - 100;
    const x1 = Math.pow(x0, 2) / 100;
    return 0 - x1 + 100;
};
const translate4 = (number) => {
    const x0 = number - 50;
    const x1 = Math.pow(x0, 2);
    const x2 = Math.pow(x0, 3);
    const xVal = x1 + x2;
    return xVal / 2500 + 49;
};

/** @type {Number} */
let startTime;
const translate5 = (number) => {
    if (number < 80) 
        return 0;
    if (number < 95)
        return -(number / 20); 
    return (number - 95) * 20;
}

let raceFinished = false;

console.table([
    {
        name: "translate1",
        min: translate1(0),
        mid: translate1(50),
        max: translate1(100),
    },
    {
        name: "translate2",
        min: translate2(0),
        mid: translate2(50),
        max: translate2(100),
    },
    {
        name: "translate3",
        min: translate3(0),
        mid: translate3(50),
        max: translate3(100),
    },
    {
        name: "translate4",
        min: translate4(0),
        mid: translate4(50),
        max: translate4(100),
    },
    {
        name: "translate5",
        min: translate5(0),
        mid: translate5(50),
        max: translate5(100),
    },
]);

const onSelect = (e) => {
    getBtnStart().prop("disabled", false);
    const index = e.querySelector('input:checked').value;
    console.log(index);
    const data = snailData[index];
    $(".overview > img").attr('src', data.img);
    $("#exp").attr('value', data.stats.experience);
    $("#grit").attr('value', data.stats.grit);
    $("#speed").attr('value', data.stats.speed);
    $(".overview > p").text('Victories: ' + data.stats.victories);
    chosenSnail = index;
};

const startRace = () => {
    getDialogStart()[0].close();
    getBtnStart().prop("disabled", true);

    snailData.forEach((snail, index) => {
        if (snail.luck > 95) {
            snail.speed = (parseInt(snail.speed) + 50).toString();
            let element = getSnailByID(index);
            element.addClass('spinning')
        }
    })
    console.table(snailData);
    startTime = Date.now();
    loop();
};

/**
 * 
 * @param {Date} date 
 * @returns {String}
 */
const dateFormat = () => {
    const zeroPad = (num, pad) => String(num).padStart(pad, '0');
    const subtract = Date.now() - startTime;
    const date = new Date(subtract);
    return `${date.getHours() - 1}:${zeroPad(date.getMinutes(), 2)}:${zeroPad(date.getSeconds(), 2)}:${zeroPad(date.getMilliseconds(), 3)}`;
}

function loop() {
    if (!raceFinished) {
        $("#time").text(dateFormat());
        snailData.forEach((data, index) => {
            let position;
            let boost = titlePresses > 10 ? 100 : 1;
            data.position += data.speed / 10000 * boost;
            if (data.luck < 25) {
                position = translate4(data.position);
            } else if (data.luck < 50) {
                position = translate3(data.position);
            } else if (data.luck < 75) {
                position = translate2(data.position);
            } else if (data.luck > 95) {
                position = translate5(data.position);
            }
            else {
                position = translate1(data.position);
            }
            let element = getSnailByID(index);
            if (data.position < 100) {
                element.css({
                    "margin-left": `calc(${position.toFixed(2)}% - ${
                        position.toFixed(2) * 1.5
                    }px)`,
                });
            } else {
                raceFinished = true;
                console.log(index);
                window.localStorage.setItem(`snail${index}_victories`, parseInt(data.stats.victories) + 1);
                console.log({index, chosenSnail});
                if (index == chosenSnail) {
                    $('.raceEnd > h2').text("You won!");
                    const prev = window.localStorage.getItem('victories');
                    const victories = parseInt(prev || "0");
                    window.localStorage.setItem('victories', victories + 1);
                }
                $('.raceEnd > p').text(`${data.name} won the race.`);
                getDialogEnd()[0].showModal();
            }
        });
        window.requestAnimationFrame(loop);
    }
}

window.onload = () => {
    getDialogStart()[0].showModal();
    $("#wins").text(`Wins: ${window.localStorage.getItem('victories') || 0}`);
}