var timeState = []// array of obj to save the time for each currency so its reachable everywhere in this code
async function getData(coinId) {

    var url = URL_coin + coinId
    if (ifShouldUpdate(coinId)) {
        deleteFromTimeState(coinId)
        console.log('updated')
        const myCache = caches.open('myCache')
            ; (await myCache).delete(url)
    }

    try {
        const cacheStorage = await caches.open('myCache')
        const resData = await cacheStorage.match(url)

        if (resData === undefined) {//if data is not found in the cache
            // return await saveDataOnCache(coinId)
            const res = await saveDataOnCache(coinId)

            timeState.push({
                id: coinId,
                savedTime: res.timeSaved,
            })
            return res
        } else {//if the data is already in the Cache
            return resData
        }
    } catch (err) {
        console.log('ERROR:', err)
    }

}

async function saveDataOnCache(coinId) {
    var url = URL_coin + coinId;
    var now = new Date().getMinutes()//getting the minute to check if 2 mins passed
    try {
        const cacheStorage = await caches.open('myCache')
        const addToCache = await cacheStorage.add(url)
        var resData = await cacheStorage.match(url)
        resData.timeSaved = now;

    } catch (err) {
        console.log('ERROR:', err)
    }
    return resData
}

function ifShouldUpdate(coindId) {
    var now = new Date().getMinutes();
    for (let i = 0; i < timeState.length; i++) {
        let element = timeState[i]
        if (element.id === coindId) {
            if (now < element.savedTime) {//(example) if saved at x:58 and used it at x+1:02  
                if ((element.savedTime - now) >= 2)
                    return true;
            }
            else if ((now - element.savedTime) >= 2)
                return true;
        }
    }
    return false
}

function deleteFromTimeState(id) {
    for (let i = timeState.length - 1; i >= 0; i--) {
        if (timeState[i].id === id) {
            timeState.splice(i, 1);
        }
    }
}