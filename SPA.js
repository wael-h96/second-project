function showPage(e) {//This page controlls the Single Page App 
    const divName = e.srcElement.name
    
    if (divName === 'live-page') {
        $('div#home-page').css('display', 'none')
        $('div#about-page').css('display', 'none')
        $(`div#${divName}`).css('display', 'block')
        startLive()
    }
    if (divName === 'home-page') {
        $('div#live-page').css('display', 'none')
        $('div#about-page').css('display', 'none')
        $(`div#${divName}`).css('display', 'block')
        clearInterval(localStorage.getItem('intervalId'))
        startHomePage()
    }
    if (divName === 'about-page') {
        $(`div#home-page`).css('display', 'none')
        $('div#live-page').css('display', 'none')
        $(`div#${divName}`).css('display', 'flex')
        clearInterval(localStorage.getItem('intervalId'))
    }
}