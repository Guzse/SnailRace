let snails;

function generateSnailSpeed() {
    return Math.round(Math.random() * 19 + 1);
}

function generateSnailLuck() {
    return Math.round(Math.random() * 100);
}

function startRace() {
    snails = [
        {
            speed: generateSnailSpeed(),
            luck: generateSnailLuck(),
            victoryCount: window.localStorage.getItem("snail2_Victories") || 0,
        },
        {
            speed: generateSnailSpeed(),
            luck: generateSnailLuck(),
            victoryCount: window.localStorage.getItem("snail2_Victories") || 0,
        },
        {
            speed: generateSnailSpeed(),
            luck: generateSnailLuck(),
            victoryCount: window.localStorage.getItem("snail2_Victories") || 0,
        },
    ];
    loop();
}

function loop() {
    let i = 0;
    snails.forEach(snail => {
        let snailEl = $(`#${i}`);
        let position = parseInt(snailEl.css('margin-left'));
        snailEl.css({'margin-left': `${position + snail.speed}px`});
        console.log(`id: ${i}, snail.speed: ${snail.speed}, position: ${position}`);
        i++;
    });
    window.requestAnimationFrame(loop);
}
