
const $gameTitle = $('#game-title');

function titleAnimation() {

    let i = 0;
    let current = "top";
    const $topLetters = $('.top-title-letter');
    const $bottomLetters = $('.bottom-title-letter');

    stopper = setInterval(() => {


        if (i < $topLetters.length) {

            if (current == "top") {

                $topLetters.eq(i).addClass("has-text-primary");
                current = "bottom";

            }
            else {

                $bottomLetters.eq(i).addClass("has-text-primary");
                current = "top";
                i++;
            }
        }
        else {
            clearInterval(stopper);
            $topLetters.hide();
            $bottomLetters.hide();
            $gameTitle.show();
        }

    }, 500)
}

function stopAnimation(stopper){

    clearInterval(stopper);
}