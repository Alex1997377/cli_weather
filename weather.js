#!/usr/bin/env node
import { getArgs } from './helpers/args.js'
import { printHelp, printSuccess, printError } from './services/log.service.js'
import { getKeyValue, saveKeyValue, TOKEN_DICTIONARY } from './services/storage.service.js'
import { getWeather, getIcon } from './services/api.service.js'
const saveToken  = async (token) => {
    if (!token.length) {
        printError('Не передан токен')
        return 
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token)
        printSuccess('Token is save')
    } catch (e) {
        printError(e.message)
    }
}

const saveCity = async (city) => {
    if (!city.length) {
        printError('Не передано название города')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city)
        printSuccess('Город сохранен')
    } catch (e) {
        printError(e.message)
    }
}

const getForcast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city)
        const weather = await getWeather()
        console.log(weather, getIcon(weather.weather[0].icon))
    } catch (e) {
        if (e?.response?.status == 404) {
            printError('Неверном указан город')
        } else if (e?.response?.status == 401) {
            printError('Неверном указан токен')
        } else {
            printError(e.message)
        }
    }
}

const initCLI = () => {
    const args = getArgs(process.argv)
    console.log(args)
    if (args.h) {
        printHelp()
    }
    if (args.s) {
        return saveCity(args.s)
    }
    if (args.t) {
        return saveToken(args.t)
    }
    getForcast()

    // Вывести погоду
}

initCLI()